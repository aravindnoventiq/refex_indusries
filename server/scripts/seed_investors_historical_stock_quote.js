const { InvestorsHistoricalStockQuote, sequelize } = require("../models");
const historicalStockQuoteData = require("../seeds/investors_historical_stock_quote.json");

async function seedInvestorsHistoricalStockQuote() {
  try {
    console.log("Starting to seed Investors Historical Stock Quote section...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [historicalStockQuote, created] = await InvestorsHistoricalStockQuote.findOrCreate({
      where: { title: historicalStockQuoteData.title },
      defaults: historicalStockQuoteData,
    });

    if (!created) {
      await historicalStockQuote.update(historicalStockQuoteData);
      console.log(`✓ Investors Historical Stock Quote section updated: ${historicalStockQuote.title}`);
    } else {
      console.log(`✓ Investors Historical Stock Quote section created: ${historicalStockQuote.title}`);
    }

    console.log("✓ Investors Historical Stock Quote section seeded successfully!");
  } catch (error) {
    console.error("Error seeding Investors Historical Stock Quote section:", error);
  }
}

module.exports = seedInvestorsHistoricalStockQuote;

