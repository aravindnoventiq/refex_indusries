const { InvestorsStockChart, sequelize } = require("../models");
const stockChartData = require("../seeds/investors_stock_chart.json");

async function seedInvestorsStockChart() {
  try {
    console.log("Starting to seed Investors Stock Chart section...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [stockChart, created] = await InvestorsStockChart.findOrCreate({
      where: { title: stockChartData.title },
      defaults: stockChartData,
    });

    if (!created) {
      await stockChart.update(stockChartData);
      console.log(`✓ Investors Stock Chart section updated: ${stockChart.title}`);
    } else {
      console.log(`✓ Investors Stock Chart section created: ${stockChart.title}`);
    }

    console.log("✓ Investors Stock Chart section seeded successfully!");
  } catch (error) {
    console.error("Error seeding Investors Stock Chart section:", error);
  }
}

module.exports = seedInvestorsStockChart;

