"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsHistoricalStockQuote = sequelize.define(
    "InvestorsHistoricalStockQuote",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Historical Stock Quote" },
      // Column labels
      columnDate: { type: DataTypes.STRING, allowNull: true, defaultValue: "DATE" },
      columnOpen: { type: DataTypes.STRING, allowNull: true, defaultValue: "OPEN" },
      columnHigh: { type: DataTypes.STRING, allowNull: true, defaultValue: "HIGH" },
      columnLow: { type: DataTypes.STRING, allowNull: true, defaultValue: "LOW" },
      columnClose: { type: DataTypes.STRING, allowNull: true, defaultValue: "CLOSE" },
      columnVolume: { type: DataTypes.STRING, allowNull: true, defaultValue: "VOLUME" },
      columnTradeValue: { type: DataTypes.STRING, allowNull: true, defaultValue: "TRADE VALUE" },
      columnTrades: { type: DataTypes.STRING, allowNull: true, defaultValue: "No. OF TRADES" },
      // Quick filter labels
      filter1M: { type: DataTypes.STRING, allowNull: true, defaultValue: "1M" },
      filter3M: { type: DataTypes.STRING, allowNull: true, defaultValue: "3M" },
      filter6M: { type: DataTypes.STRING, allowNull: true, defaultValue: "6M" },
      filter1Y: { type: DataTypes.STRING, allowNull: true, defaultValue: "1Y" },
      // Settings
      defaultExchange: { type: DataTypes.STRING, allowNull: true, defaultValue: "BSE" }, // "BSE" or "NSE"
      recordsPerPage: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 10 },
      // API settings
      nonce: { type: DataTypes.STRING, allowNull: true }, // Nonce for admin-ajax API
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_historical_stock_quote", underscored: true }
  );
  return InvestorsHistoricalStockQuote;
};

