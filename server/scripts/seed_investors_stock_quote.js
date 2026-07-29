const { InvestorsStockQuote, sequelize } = require("../models");
const stockQuoteData = require("../seeds/investors_stock_quote.json");

async function seedInvestorsStockQuote() {
  try {
    console.log("Starting to seed Investors Stock Quote section...");

    // Connect to database
    await sequelize.authenticate();
    console.log("Database connection established");

    // Seed stock quote - try to find existing or create new
    const existing = await InvestorsStockQuote.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(stockQuoteData);
      console.log(`✓ Investors Stock Quote section updated: ${existing.title}`);
    } else {
      const stockQuote = await InvestorsStockQuote.create(stockQuoteData);
      console.log(`✓ Investors Stock Quote section created: ${stockQuote.title}`);
    }

    console.log("✓ Investors Stock Quote section seeded successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Stock Quote section:", error);
    await sequelize.close();
    process.exit(1);
  }
}

seedInvestorsStockQuote();

