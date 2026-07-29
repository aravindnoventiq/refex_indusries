import { NseIndia } from "stock-nse-india";
const nseIndia = new NseIndia();
import fs from 'fs';

function convertDate(dateStr) {
  // "25-Feb-2025" → "2025-02-25"
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  const [day, mon, year] = dateStr.split("-");
  return `${year}-${months[mon]}-${day.padStart(2, '0')}`;
}

// Export function for API use
export async function getRefexData() {
    try {
        // Get today's date
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        
        // Calculate start date: 1 year ago from today
        const startDate = new Date(todayYear - 1, todayMonth, todayDay);
        
        // End date: today
        const endDate = new Date(todayYear, todayMonth, todayDay);
        
        // Define the 1-year range (1 year ago from today to today)
        const range = {
            start: startDate,
            end: endDate
        };
        
        console.log(`📅 Fetching data from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

        // Fetching historical data for Refex Industries
        const data = await nseIndia.getEquityHistoricalData('REFEX', range);
        
        const newData = data
        .flatMap(block =>
          block.data.map(item => ({
            date: convertDate(item.mtimestamp),
            timestamp: item.mtimestamp,
            symbol: item.chSymbol,
            open: item.chOpeningPrice,
            high: item.chTradeHighPrice,
            low: item.chTradeLowPrice,
            close: item.chClosingPrice,
            previousClose: item.chPreviousClsPrice,
            lastTradedPrice: item.chLastTradedPrice,
            volume: item.chTotTradedQty,
            tradeValue: item.chTotTradedVal,
            noOfTrades: item.chTotalTrades,
            vwap: item.vwap,
            series: item.chSeries
          }))
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        // Load existing data from file (if exists) to merge
        let allData = [];
        const existingFilePath = 'refex_data.json';
        
        if (fs.existsSync(existingFilePath)) {
            try {
                const existingData = JSON.parse(fs.readFileSync(existingFilePath, 'utf8'));
                if (Array.isArray(existingData)) {
                    allData = existingData;
                    console.log(`📂 Loaded ${existingData.length} existing records from refex_data.json`);
                }
            } catch (err) {
                console.log('⚠️  Could not load existing data, starting fresh');
            }
        }

        // Create a map of existing data by date for quick lookup
        const existingDataMap = new Map();
        allData.forEach(item => {
            if (item.date) {
                existingDataMap.set(item.date, item);
            }
        });

        // Merge new data with existing data (new data overwrites old data for same date)
        newData.forEach(newItem => {
            if (newItem.date) {
                existingDataMap.set(newItem.date, newItem);
            }
        });

        // Convert map back to array - ALL DATA in one array
        const formattedData = Array.from(existingDataMap.values());

        // Sort by date - NEWEST FIRST (current data first)
        formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Save ALL data to ONE single file (refex_data.json)
        fs.writeFileSync('refex_data.json', JSON.stringify(formattedData, null, 2));
        
        // Also save with timestamp for backup
        const timestamp = new Date().toISOString().split('T')[0];
        fs.writeFileSync(`refex_data_${timestamp}.json`, JSON.stringify(formattedData, null, 2));

        console.log("✅ Successfully saved ALL REFEX data to ONE file");
        console.log(`📊 Total records in file: ${formattedData.length}`);
        if (formattedData.length > 0) {
            console.log(`📅 Date range: ${formattedData[formattedData.length - 1]?.date} to ${formattedData[0]?.date}`);
        }
        console.log(`📄 Files saved:`);
        console.log(`   - refex_data.json (ALL DATA - ${formattedData.length} records, newest first)`);
        console.log(`   - refex_data_${timestamp}.json (backup)`);

        return {
            success: true,
            records: formattedData.length,
            data: formattedData
        };

    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            success: false,
            error: error.message
        };
    }
}


// Run the script if executed directly

getRefexData();