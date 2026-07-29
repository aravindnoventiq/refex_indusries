const status = require("../helpers/response");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const puppeteer = require("puppeteer");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

// Refex Industries stock symbols
const BSE_SYMBOL = "532884"; // BSE Scrip Symbol
const NSE_SYMBOL = "REFEX"; // NSE Scrip Code
const REPO_ROOT = path.join(__dirname, "..");

/**
 * Utility to wait until at least one CSV appears in a directory (or timeout)
 */
async function waitForCsv(downloadDir, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const files = fs.readdirSync(downloadDir).filter((f) => f.toLowerCase().endsWith(".csv"));
    if (files.length > 0) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

/**
 * Read the most recent CSV file from a directory into an array of records
 */
async function readLatestCsv(downloadDir) {
  const csvFiles = fs
    .readdirSync(downloadDir)
    .filter((f) => f.toLowerCase().endsWith(".csv"));

  if (!csvFiles.length) return null;

  csvFiles.sort((a, b) => {
    const aTime = fs.statSync(path.join(downloadDir, a)).mtimeMs;
    const bTime = fs.statSync(path.join(downloadDir, b)).mtimeMs;
    return bTime - aTime;
  });

  const latestFile = path.join(downloadDir, csvFiles[0]);

  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(latestFile)
      .pipe(csv())
      .on("data", (row) => records.push(row))
      .on("end", () => resolve({ latestFile, records }))
      .on("error", (err) => reject(err));
  });
}

/**
 * Normalize NSE historical CSV columns & parse dates
 * Mirrors the Python logic:
 *   df.columns = [re.sub(r'\s+', ' ', re.sub(r'[^A-Za-z ]', ' ', col)).strip().upper() ...]
 *   df['DATE'] = pd.to_datetime(df['DATE'], format='%d-%b-%Y')
 */
function normalizeColumnsNSE(records) {
  if (!records || !records.length) return [];

  return records.map((row) => {
    const newRow = {};

    Object.entries(row).forEach(([key, value]) => {
      let col = String(key).trim();
      col = col.replace(/[^A-Za-z ]/g, " "); // remove non-letters
      col = col.replace(/\s+/g, " "); // collapse whitespace
      col = col.trim().toUpperCase();
      newRow[col] = value;
    });

    if (newRow.DATE) {
      // Expect format like "17-Dec-2024"
      const parts = String(newRow.DATE).trim().split("-");
      if (parts.length === 3) {
        const [dd, monStr, yyyyStr] = parts;
        const months = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];
        const idx = months.indexOf(monStr.toUpperCase());
        const day = String(parseInt(dd, 10)).padStart(2, "0");
        if (idx >= 0) {
          const month = String(idx + 1).padStart(2, "0");
          newRow.DATE = `${yyyyStr}-${month}-${day}`;
        }
      }
    }

    return newRow;
  });
}

/**
 * Normalize BSE historical CSV columns & parse dates
 * Mirrors the Python logic:
 *   df.rename(columns={'No.of Shares': 'VOLUME'}, inplace=True)
 *   remove parentheses, non-letters, "PRICE", uppercase, strip
 *   DATE format "%d-%B-%Y"
 *   replace inf/-inf with NaN, then fillna(0)
 */
function normalizeColumnsBSE(records) {
  if (!records || !records.length) return [];

  return records.map((origRow) => {
    const renamedRow = {};

    // First, rename "No.of Shares" -> "VOLUME"
    Object.entries(origRow).forEach(([key, value]) => {
      let newKey = key;
      if (key === "No.of Shares") newKey = "VOLUME";
      renamedRow[newKey] = value;
    });

    const finalRow = {};

    Object.entries(renamedRow).forEach(([key, value]) => {
      let col = String(key);
      col = col.replace(/\(.*?\)/g, ""); // remove text in parentheses
      col = col.replace(/[^A-Za-z ]/g, " "); // remove non-letters
      col = col.replace(/\s+/g, " "); // collapse whitespace
      col = col.toUpperCase().replace("PRICE", ""); // remove literal PRICE
      col = col.trim();

      finalRow[col] = value;
    });

    // Parse DATE in "%d-%B-%Y" (e.g., "01-September-2024")
    if (finalRow.DATE) {
      const parts = String(finalRow.DATE).trim().split("-");
      if (parts.length === 3) {
        const [dd, monthName, yyyyStr] = parts;
        const monthMap = {
          JANUARY: 1,
          FEBRUARY: 2,
          MARCH: 3,
          APRIL: 4,
          MAY: 5,
          JUNE: 6,
          JULY: 7,
          AUGUST: 8,
          SEPTEMBER: 9,
          OCTOBER: 10,
          NOVEMBER: 11,
          DECEMBER: 12,
        };
        const mIdx = monthMap[monthName.toUpperCase()];
        const day = String(parseInt(dd, 10)).padStart(2, "0");
        if (mIdx) {
          const month = String(mIdx).padStart(2, "0");
          finalRow.DATE = `${yyyyStr}-${month}-${day}`;
        }
      }
    }

    // Replace infinities / invalid numbers / empty with 0
    Object.keys(finalRow).forEach((k) => {
      const v = finalRow[k];
      if (v === null || v === undefined || v === "") {
        finalRow[k] = 0;
      } else if (typeof v === "number") {
        if (!Number.isFinite(v)) finalRow[k] = 0;
      } else {
        const num = Number(String(v).replace(/,/g, ""));
        if (Number.isNaN(num) || !Number.isFinite(num)) {
          // keep as string if it's clearly non-numeric (like a label column)
          // but for numeric-like fields Python would have filled 0; here we only coerce where it was numeric-like
          finalRow[k] = v;
        } else {
          finalRow[k] = num;
        }
      }
    });

    return finalRow;
  });
}

/**
 * Core scraper that mimics the Python historical_data_report_func(type)
 * Uses Puppeteer (already in your dependencies) instead of Selenium.
 */
async function historicalDataReportFunc(type) {
  const upperType = String(type || "").toUpperCase();

  try {
    if (upperType === "NSE") {
      const folderName = "historical_report_file";
      const downloadDir = path.join(REPO_ROOT, folderName);
      if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

      const browser = await puppeteer.launch({
        headless: "new",
        ignoreHTTPSErrors: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-http2",
          "--disable-quic",
        ],
      });

      try {
        const page = await browser.newPage();

        // Spoof a real browser as much as possible
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
        await page.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          "Upgrade-Insecure-Requests": "1",
        });

        // Enable downloads to the desired folder
        const client = await page.target().createCDPSession();
        await client.send("Page.setDownloadBehavior", {
          behavior: "allow",
          downloadPath: downloadDir,
        });

        const url = "https://www.nseindia.com/get-quotes/equity?symbol=REFEX";
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Historic data tab can be blocked / delayed by NSE's anti-bot system.
        // Wait longer and require the element to be visible.
        await page.waitForSelector("#historic_data", {
          timeout: 60000,
          visible: true,
        });
        await page.click("#historic_data");
        await page.waitForTimeout(1000);

        await page.waitForSelector("#oneY", { timeout: 20000 });
        await page.click("#oneY");
        await page.waitForTimeout(500);

        await page.waitForSelector("#dwldcsv", { timeout: 20000 });
        await page.click("#dwldcsv");

        await waitForCsv(downloadDir, 20000);
      } finally {
        await browser.close();
      }

      const res = await readLatestCsv(downloadDir);
      if (!res) return { status: false, msg: "No CSV files found." };

      const { latestFile, records } = res;
      const data = normalizeColumnsNSE(records);

      if (fs.existsSync(latestFile)) fs.unlinkSync(latestFile);

      return { status: true, data };
    }

    if (upperType === "BSE") {
      const today = new Date();
      const oneYearBefore = new Date(today);
      oneYearBefore.setFullYear(today.getFullYear() - 1);

      const folderName = "BSE_India_Report_File";
      const downloadDir = path.join(REPO_ROOT, folderName);
      if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      try {
        const page = await browser.newPage();

        const client = await page.target().createCDPSession();
        await client.send("Page.setDownloadBehavior", {
          behavior: "allow",
          downloadPath: downloadDir,
        });

        const url =
          "https://www.bseindia.com/markets/equity/EQReports/StockPrcHistori.aspx?expandable=7&scripcode=532884&flag=sp&Submit=G";
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        const fromSelector = "#ContentPlaceHolder1_txtFromDate";
        await page.waitForSelector(fromSelector, { timeout: 20000 });

        // Format date as dd/mm/yyyy (BSE expects this format)
        const d = oneYearBefore.getDate().toString().padStart(2, "0");
        const m = (oneYearBefore.getMonth() + 1).toString().padStart(2, "0");
        const y = oneYearBefore.getFullYear();
        const fromDateStr = `${d}/${m}/${y}`;

        await page.evaluate(
          (selector, value) => {
            const el = document.querySelector(selector);
            if (el) {
              el.value = value;
              const event = new Event("change", { bubbles: true });
              el.dispatchEvent(event);
            }
          },
          fromSelector,
          fromDateStr
        );

        // Click submit
        const submitSelector = "#ContentPlaceHolder1_btnSubmit";
        await page.waitForSelector(submitSelector, { timeout: 20000 });
        await Promise.all([
          page.click(submitSelector),
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }),
        ]);

        // Click download
        const downloadSelector = "#ContentPlaceHolder1_btnDownload1";
        await page.waitForSelector(downloadSelector, { timeout: 20000 });
        await page.click(downloadSelector);

        await waitForCsv(downloadDir, 20000);
      } finally {
        await browser.close();
      }

      const res = await readLatestCsv(downloadDir);
      if (!res) return { status: false, msg: "No CSV files found." };

      const { latestFile, records } = res;
      const data = normalizeColumnsBSE(records);

      if (fs.existsSync(latestFile)) fs.unlinkSync(latestFile);

      return { status: true, data };
    }

    return { status: false, msg: "Please provide the correct type of historical report." };
  } catch (err) {
    return {
      status: false,
      msg: `${err.name} was raised: ${err.message}`,
    };
  }
}

/**
 * Fetch stock price from BSE
 * Note: BSE doesn't have a public free API, so this is a placeholder
 * You may need to use a paid service or scrape the BSE website
 */
async function fetchBSEPrice() {
  try {
    // Option 1: Use a stock API service (e.g., Alpha Vantage, Yahoo Finance, etc.)
    // For now, returning a mock structure - replace with actual API call
    
    // Example using a free stock API (you'll need to sign up and get an API key)
    // const response = await axios.get(`https://api.example.com/bse/${BSE_SYMBOL}`);
    
    // For now, return null to indicate manual update needed
    return null;
  } catch (error) {
    console.error("Error fetching BSE price:", error);
    return null;
  }
}

/**
 * Fetch stock price from NSE
 * Note: NSE doesn't have a public free API, so this is a placeholder
 * You may need to use a paid service or scrape the NSE website
 */
async function fetchNSEPrice() {
  try {
    // Option 1: Use a stock API service
    // For now, returning a mock structure - replace with actual API call
    
    // Example using a free stock API
    // const response = await axios.get(`https://api.example.com/nse/${NSE_SYMBOL}`);
    
    // For now, return null to indicate manual update needed
    return null;
  } catch (error) {
    console.error("Error fetching NSE price:", error);
    return null;
  }
}

/**
 * Fetch stock prices from Yahoo Finance (free alternative)
 * This uses Yahoo Finance's public API
 */
async function fetchFromYahooFinance() {
  try {
    // Yahoo Finance API endpoint (unofficial but free)
    const bseSymbol = `${BSE_SYMBOL}.BO`; // .BO for BSE
    const nseSymbol = `${NSE_SYMBOL}.NS`; // .NS for NSE
    
    const [bseResponse, nseResponse] = await Promise.all([
      axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${bseSymbol}`, {
        params: {
          interval: '1d',
          range: '1d'
        },
        timeout: 5000
      }).catch(() => null),
      axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${nseSymbol}`, {
        params: {
          interval: '1d',
          range: '1d'
        },
        timeout: 5000
      }).catch(() => null)
    ]);

    const result = {
      bse: null,
      nse: null
    };

    if (bseResponse && bseResponse.data && bseResponse.data.chart && bseResponse.data.chart.result) {
      const bseData = bseResponse.data.chart.result[0];
      const meta = bseData.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);
      
      result.bse = {
        price: currentPrice.toFixed(2),
        change: `${change >= 0 ? '+' : ''}${changePercent}%`,
        changeValue: change.toFixed(2),
        indicator: change >= 0 ? 'up' : 'down'
      };
    }

    if (nseResponse && nseResponse.data && nseResponse.data.chart && nseResponse.data.chart.result) {
      const nseData = nseResponse.data.chart.result[0];
      const meta = nseData.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);
      
      result.nse = {
        price: currentPrice.toFixed(2),
        change: `${change >= 0 ? '+' : ''}${changePercent}%`,
        changeValue: change.toFixed(2),
        indicator: change >= 0 ? 'up' : 'down'
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching from Yahoo Finance:", error);
    return null;
  }
}

/**
 * Get stock prices
 * Tries multiple sources and returns the best available data
 */
module.exports = {
  getStockPrice: asyncHandler(async (req, res) => {
    try {
      // Try Yahoo Finance first (free)
      let stockData = await fetchFromYahooFinance();
      
      // If Yahoo Finance fails, try other sources
      if (!stockData || (!stockData.bse && !stockData.nse)) {
        // You can add other API sources here
        // For example: Alpha Vantage, IEX Cloud, etc.
        
        // Fallback: Return null to indicate manual update needed
        stockData = {
          bse: null,
          nse: null,
          message: "Stock price API not configured. Please update prices manually in Header CMS."
        };
      }

      return status.responseStatus(res, 200, "OK", {
        bse: stockData.bse || null,
        nse: stockData.nse || null,
        timestamp: new Date().toISOString(),
        source: stockData.bse || stockData.nse ? "yahoo_finance" : "manual"
      });
    } catch (error) {
      return status.responseStatus(res, 500, "Error fetching stock prices", { 
        error: error.message,
        bse: null,
        nse: null
      });
    }
  }),

  /**
   * Update stock prices in Header CMS
   * This endpoint fetches stock prices and automatically updates the Header CMS
   */
  updateHeaderStockPrice: asyncHandler(async (req, res) => {
    try {
      const { Header } = require("../models");
      
      // Fetch current stock prices
      const stockData = await fetchFromYahooFinance();
      
      if (!stockData || (!stockData.bse && !stockData.nse)) {
        return status.responseStatus(res, 400, "Unable to fetch stock prices", {
          error: "Stock price API returned no data"
        });
      }

      // Get current header data
      const header = await Header.findOne({ order: [["id", "DESC"]] });
      
      if (!header) {
        return status.responseStatus(res, 404, "Header data not found. Please create header data first.");
      }

      // Update stock prices
      const updateData = {};
      
      if (stockData.bse) {
        updateData.bsePrice = stockData.bse.price;
        updateData.bseChange = stockData.bse.change;
        updateData.bseChangeIndicator = stockData.bse.indicator;
      }
      
      if (stockData.nse) {
        updateData.nsePrice = stockData.nse.price;
        updateData.nseChange = stockData.nse.change;
        updateData.nseChangeIndicator = stockData.nse.indicator;
      }

      await header.update(updateData);

      return status.responseStatus(res, 200, "Stock prices updated successfully", {
        header: header.toJSON(),
        stockData: stockData
      });
    } catch (error) {
      return status.responseStatus(res, 500, "Error updating stock prices", { 
        error: error.message
      });
    }
  }),

  /**
   * Proxy endpoint to fetch stock prices from external API
   * This avoids CORS issues by making the request from the server
   */
  getStockPriceFromExternal: asyncHandler(async (req, res) => {
    try {
      const apiUrl = 'https://refex-finance.lab2.sharajman.com/stock_current_price';
      
      // Log the request being made
      console.log("Making request to external API:", apiUrl);
      console.log("Request timestamp:", new Date().toISOString());
      
      // Make parallel requests for both NSE and BSE
      const [nseResponse, bseResponse] = await Promise.allSettled([
        axios.post(apiUrl, { stock_name: "REFEX.NS" }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        }),
        axios.post(apiUrl, { stock_name: "REFEX.BO" }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        })
      ]);

      // Process NSE response
      let nseData = null;
      if (nseResponse.status === 'fulfilled' && nseResponse.value?.data) {
        const nse = nseResponse.value.data;
        if (nse.status === true) {
          nseData = {
            price: nse.current_price,
            index: nse.index,
            overall_index: nse.overall_index,
            exchange: nse.exchange
          };
        }
      } else if (nseResponse.status === 'rejected') {
        console.error("NSE API Error:", nseResponse.reason?.message);
      }

      // Process BSE response
      let bseData = null;
      if (bseResponse.status === 'fulfilled' && bseResponse.value?.data) {
        const bse = bseResponse.value.data;
        if (bse.status === true) {
          bseData = {
            price: bse.current_price,
            index: bse.index,
            overall_index: bse.overall_index,
            exchange: bse.exchange
          };
        }
      } else if (bseResponse.status === 'rejected') {
        console.error("BSE API Error:", bseResponse.reason?.message);
      }

      // Log the full response for debugging
      console.log("=== External API Response ===");
      console.log("NSE Data:", nseData);
      console.log("BSE Data:", bseData);
      console.log("Response Timestamp:", new Date().toISOString());
      console.log("=============================");

      // Format response to match expected structure
      const responseData = {
        nse_data: nseData,
        bse_data: bseData
      };

      // Return the formatted data
      return status.responseStatus(res, 200, "OK", responseData);
    } catch (error) {
      console.error("=== Error fetching stock prices from external API ===");
      console.error("Error message:", error.message);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      }
      
      console.error("==================================================");
      
      return status.responseStatus(res, 500, "Error fetching stock prices from external API", { 
        error: error.message,
        bse_data: null,
        nse_data: null
      });
    }
  }),

  /**
   * Proxy endpoint to fetch stock quote values from external API
   * This avoids CORS issues by making the request from the server
   * Supports both individual requests (with stock_name) and combined requests (without stock_name)
   */
  getStockQuoteValue: asyncHandler(async (req, res) => {
    try {
      const { stock_name } = req.body;
      const apiUrl = 'https://refex-finance.lab2.sharajman.com/stock_quote';
      
      // Log the request being made
      console.log("Making request to external stock quote API:", apiUrl);
      console.log("Stock name requested:", stock_name || "Both (NSE & BSE)");
      console.log("Request timestamp:", new Date().toISOString());
      
      // If stock_name is provided, fetch only that exchange
      if (stock_name) {
        const response = await axios.post(apiUrl, { stock_name }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        });

        console.log("=== Stock Quote API Response ===");
        console.log("Status Code:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
        console.log("Stock Name:", stock_name);
        console.log("Response Status:", response.data?.status);
        console.log("Response Data Keys:", response.data?.data ? Object.keys(response.data.data) : "No data");
        console.log("=============================");

        if (!response.data) {
          throw new Error("Empty response from external API");
        }

        // Verify response format: { status: true, data: {...} }
        if (response.data.status === true && response.data.data) {
          console.log("Valid response format received for", stock_name);
        } else {
          console.warn("Unexpected response format for", stock_name, ":", response.data);
        }

        // Return the response as-is (it already has status: true, data: {...})
        return status.responseStatus(res, 200, "OK", response.data);
      }
      
      // If no stock_name provided, fetch both NSE and BSE
      const [nseResponse, bseResponse] = await Promise.allSettled([
        axios.post(apiUrl, { stock_name: "REFEX.NS" }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        }),
        axios.post(apiUrl, { stock_name: "REFEX.BO" }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        })
      ]);

      // Process NSE response
      let nseData = null;
      if (nseResponse.status === 'fulfilled' && nseResponse.value?.data) {
        const nse = nseResponse.value.data;
        if (nse.status === true && nse.data) {
          nseData = nse.data;
        }
      } else if (nseResponse.status === 'rejected') {
        console.error("NSE Quote API Error:", nseResponse.reason?.message);
      }

      // Process BSE response
      let bseData = null;
      if (bseResponse.status === 'fulfilled' && bseResponse.value?.data) {
        const bse = bseResponse.value.data;
        if (bse.status === true && bse.data) {
          bseData = bse.data;
        }
      } else if (bseResponse.status === 'rejected') {
        console.error("BSE Quote API Error:", bseResponse.reason?.message);
      }

      // Log the full response for debugging
      console.log("=== Stock Quote API Response ===");
      console.log("NSE Data:", nseData);
      console.log("BSE Data:", bseData);
      console.log("Response Timestamp:", new Date().toISOString());
      console.log("=============================");

      // Format response to match expected structure
      const responseData = {
        nse: nseData ? {
          status: true,
          data: nseData
        } : null,
        bse: bseData ? {
          status: true,
          data: bseData
        } : null
      };

      // Return the formatted data
      return status.responseStatus(res, 200, "OK", responseData);
    } catch (error) {
      console.error("Error fetching stock quote from external API:", error.message);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      
      return status.responseStatus(res, 500, "Error fetching stock quote from external API", { 
        error: error.message,
        data: null
      });
    }
  }),

  /**
   * Proxy endpoint to fetch stock chart data from admin-ajax API
   * POST form data: action, stock_name, start_date, end_date, nonce
   */
  getStockChartData: asyncHandler(async (req, res) => {
    try {
      const { action, stock_name, start_date, end_date, nonce } = req.body;
      
      if (!action || !stock_name) {
        return status.responseStatus(res, 400, "Bad Request", { 
          error: "action and stock_name are required in request body"
        });
      }

      const apiUrl = 'https://refex.co.in/wp-admin/admin-ajax.php';
      
      console.log("Making request to stock chart API:", apiUrl);
      console.log("Request params:", { action, stock_name, start_date, end_date, nonce });
      console.log("Request timestamp:", new Date().toISOString());
      
      // Create form data payload
      const querystring = require('querystring');
      const formData = {
        action: action,
        stock_name: stock_name,
      };
      if (start_date) formData.start_date = start_date;
      if (end_date) formData.end_date = end_date;
      if (nonce) formData.nonce = nonce;
      
      const response = await axios.post(apiUrl, querystring.stringify(formData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log("=== Stock Chart API Response ===");
      console.log("Status Code:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("=============================");

      if (!response.data) {
        throw new Error("Empty response from external API");
      }

      return status.responseStatus(res, 200, "OK", response.data);
    } catch (error) {
      console.error("Error fetching stock chart data from external API:", error.message);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      
      return status.responseStatus(res, 500, "Error fetching stock chart data from external API", { 
        error: error.message,
        data: null
      });
    }
  }),

  /**
   * Proxy endpoint to fetch intraday chart data
   * POST JSON: {stock_name: "REFEX.BO" or "REFEX.NS", date: ""}
   */
  getIntradayChartData: asyncHandler(async (req, res) => {
    try {
      const { stock_name, date } = req.body;
      
      if (!stock_name) {
        return status.responseStatus(res, 400, "Bad Request", { 
          error: "stock_name is required in request body"
        });
      }

      const apiUrl = 'https://refex-finance.lab2.sharajman.com/stock_chart_interval';
      
      // Prepare payload with interval: "5m" and date (empty string if not provided)
      const payload = {
        stock_name: stock_name,
        date: date || "",
        interval: "5m"
      };
      
      console.log("Making request to intraday chart API:", apiUrl);
      console.log("Request payload:", payload);
      console.log("Request timestamp:", new Date().toISOString());
      
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        timeout: 30000, // Increased to 30 seconds to handle slower API responses
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log("=== Intraday Chart API Response ===");
      console.log("Status Code:", response.status);
      console.log("Full Response:", JSON.stringify(response.data, null, 2));
      console.log("Response Data length:", response.data?.data?.length || 0);
      console.log("Response Data sample:", JSON.stringify(response.data?.data?.slice(0, 2) || [], null, 2));
      console.log("=============================");

      if (!response.data) {
        throw new Error("Empty response from external API");
      }

      // Extract the data array from the response
      // External API returns: { status: true, data: [...] }
      // We need to return just the data array for the frontend
      let chartData = [];
      
      if (response.data.status === true && Array.isArray(response.data.data)) {
        chartData = response.data.data;
        console.log("Extracted chart data array with", chartData.length, "items");
      } else if (Array.isArray(response.data)) {
        chartData = response.data;
        console.log("Response data is already an array with", chartData.length, "items");
      } else {
        console.warn("Unexpected response format:", response.data);
        chartData = [];
      }

      // Return the data array directly
      return status.responseStatus(res, 200, "OK", chartData);
    } catch (error) {
      console.error("Error fetching intraday chart data from external API:", error.message);
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error("Request timeout - API took too long to respond");
        return status.responseStatus(res, 504, "Request timeout - API took too long to respond", { 
          error: "The stock chart API is taking too long to respond. Please try again later.",
          data: null
        });
      }
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        return status.responseStatus(res, error.response.status || 500, "Error fetching intraday chart data from external API", { 
          error: error.response.data?.message || error.message,
          data: null
        });
      }
      
      if (error.request) {
        console.error("No response received from API:", error.request);
        return status.responseStatus(res, 503, "Service unavailable - API did not respond", { 
          error: "The stock chart API is currently unavailable. Please try again later.",
          data: null
        });
      }
      
      return status.responseStatus(res, 500, "Error fetching intraday chart data from external API", { 
        error: error.message,
        data: null
      });
    }
  }),

  /**
   * Proxy endpoint to fetch historical chart data by API
   * POST JSON: {stock_name: "REFEX.BO" or "REFEX.NS", start_date: "", end_date: ""}
   * Note: start_date and end_date are used for filtering on frontend, not sent to API
   */
  getChartByApi: asyncHandler(async (req, res) => {
    try {
      const { stock_name, start_date, end_date } = req.body;
      
      if (!stock_name) {
        return status.responseStatus(res, 400, "Bad Request", { 
          error: "stock_name is required in request body"
        });
      }

      const apiUrl = 'https://refex-finance.lab2.sharajman.com/stock_chart';
      
      // New API only requires stock_name and date (empty string)
      const payload = {
        stock_name: stock_name,
        date: ""
      };
      
      console.log("Making request to chart-by-api:", apiUrl);
      console.log("Request payload:", payload);
      console.log("Filter dates (for frontend):", { start_date, end_date });
      console.log("Request timestamp:", new Date().toISOString());
      
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        timeout: 30000, // Increased timeout for historical data
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log("=== Chart By API Response ===");
      console.log("Status Code:", response.status);
      console.log("Response Data length:", response.data?.data?.length || 0);
      console.log("Response Data sample:", JSON.stringify(response.data?.data?.slice(0, 2) || [], null, 2));
      console.log("=============================");

      if (!response.data) {
        throw new Error("Empty response from external API");
      }

      // Extract the data array from the response
      // External API returns: { status: true, data: [...] }
      // Return the full data array so frontend can filter by start_date and end_date
      let chartData = [];
      
      if (response.data.status === true && Array.isArray(response.data.data)) {
        chartData = response.data.data;
        console.log("Extracted chart data array with", chartData.length, "items");
      } else if (Array.isArray(response.data)) {
        chartData = response.data;
        console.log("Response data is already an array with", chartData.length, "items");
      } else {
        console.warn("Unexpected response format:", response.data);
        chartData = [];
      }

      // Return the data array along with filter dates for frontend filtering
      return status.responseStatus(res, 200, "OK", {
        data: chartData,
        start_date: start_date || null,
        end_date: end_date || null
      });
    } catch (error) {
      console.error("Error fetching chart data from external API:", error.message);
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error("Request timeout - API took too long to respond");
        return status.responseStatus(res, 504, "Request timeout - API took too long to respond", { 
          error: "The stock chart API is taking too long to respond. Please try again later.",
          data: null
        });
      }
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        return status.responseStatus(res, error.response.status || 500, "Error fetching chart data from external API", { 
          error: error.response.data?.message || error.message,
          data: null
        });
      }
      
      if (error.request) {
        console.error("No response received from API:", error.request);
        return status.responseStatus(res, 503, "Service unavailable - API did not respond", { 
          error: "The stock chart API is currently unavailable. Please try again later.",
          data: null
        });
      }
      
      return status.responseStatus(res, 500, "Error fetching chart data from external API", { 
        error: error.message,
        data: null
      });
    }
  }),

  /**
   * NEW: Historical data API that mirrors the Python historical_data_report_func(type)
   * GET /api/stock/historical/:type  where :type is "NSE" or "BSE"
   */
  getHistoricalReport: asyncHandler(async (req, res) => {
    const type = (req.params.type || req.query.type || req.body.type || "").toUpperCase();

    if (!type) {
      return status.responseStatus(res, 400, "Type is required (NSE or BSE)", {
        error: "Missing type parameter",
      });
    }

    const result = await historicalDataReportFunc(type);

    if (!result.status) {
      return status.responseStatus(res, 400, result.msg || "Failed to fetch historical data", {
        type,
      });
    }

    // Return the same core shape as the Python function: { status: true, data: [...] }
    return res.json(result);
  })
};

