const router = require("express").Router();
const ctrl = require("../controllers/stock");
const auth = require("../middlewares/auth");

// Get stock prices (public endpoint)
router.get("/", ctrl.getStockPrice);

// Update stock prices in Header CMS (protected endpoint)
router.post("/update-header", auth.authCheck, ctrl.updateHeaderStockPrice);

// Proxy endpoint to fetch stock prices from external API (public endpoint)
router.post("/external", ctrl.getStockPriceFromExternal);

// Proxy endpoint to fetch stock quote values from external API (public endpoint)
router.post("/quote-value", ctrl.getStockQuoteValue);

// Proxy endpoint to fetch stock chart data from admin-ajax API (public endpoint)
router.post("/chart-data", ctrl.getStockChartData);

// Proxy endpoint to fetch intraday chart data (public endpoint)
router.post("/intraday-chart", ctrl.getIntradayChartData);

// Proxy endpoint to fetch historical chart data by API (public endpoint)
router.post("/chart-by-api", ctrl.getChartByApi);

// Historical NSE/BSE data scraping endpoint (public)
// Mirrors the Python historical_data_report_func(type) behavior
router.get("/historical/:type", ctrl.getHistoricalReport);

module.exports = router;

