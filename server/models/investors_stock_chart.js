"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsStockChart = sequelize.define(
    "InvestorsStockChart",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "STOCK CHART" },
      // Filter button labels
      filterToday: { type: DataTypes.STRING, allowNull: true, defaultValue: "Today" },
      filter5Days: { type: DataTypes.STRING, allowNull: true, defaultValue: "5 Days" },
      filter1Month: { type: DataTypes.STRING, allowNull: true, defaultValue: "1 Month" },
      filter3Months: { type: DataTypes.STRING, allowNull: true, defaultValue: "3 Months" },
      filter6Months: { type: DataTypes.STRING, allowNull: true, defaultValue: "6 Months" },
      filter1Year: { type: DataTypes.STRING, allowNull: true, defaultValue: "1 Year" },
      filter3Years: { type: DataTypes.STRING, allowNull: true, defaultValue: "3 Years" },
      filterYTD: { type: DataTypes.STRING, allowNull: true, defaultValue: "YTD" },
      filterMAX: { type: DataTypes.STRING, allowNull: true, defaultValue: "MAX" },
      filterCustom: { type: DataTypes.STRING, allowNull: true, defaultValue: "Custom" },
      // Chart settings
      defaultChartType: { type: DataTypes.STRING, allowNull: true, defaultValue: "line" }, // "line" or "candle"
      defaultExchange: { type: DataTypes.STRING, allowNull: true, defaultValue: "BSE" }, // "BSE" or "NSE"
      defaultFilter: { type: DataTypes.STRING, allowNull: true, defaultValue: "Today" },
      // API settings - stored for CMS configuration
      nonce: { type: DataTypes.STRING, allowNull: true }, // Nonce for admin-ajax API
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_stock_chart", underscored: true }
  );
  return InvestorsStockChart;
};

