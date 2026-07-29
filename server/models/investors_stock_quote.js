"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsStockQuote = sequelize.define(
    "InvestorsStockQuote",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "STOCK QUOTE" },
      currency: { type: DataTypes.STRING, allowNull: false, defaultValue: "Rupees" },
      // Column labels for first table
      columnCurrency: { type: DataTypes.STRING, allowNull: true, defaultValue: "CURRENCY" },
      columnPrice: { type: DataTypes.STRING, allowNull: true, defaultValue: "PRICE" },
      columnBid: { type: DataTypes.STRING, allowNull: true, defaultValue: "BID" },
      columnOffer: { type: DataTypes.STRING, allowNull: true, defaultValue: "OFFER" },
      columnChange: { type: DataTypes.STRING, allowNull: true, defaultValue: "CHANGE IN (%)" },
      columnVolume: { type: DataTypes.STRING, allowNull: true, defaultValue: "VOLUME" },
      // Column labels for second table
      columnTodayOpen: { type: DataTypes.STRING, allowNull: true, defaultValue: "TODAY'S OPEN" },
      columnPreviousClose: { type: DataTypes.STRING, allowNull: true, defaultValue: "PREVIOUS CLOSE" },
      columnIntradayHigh: { type: DataTypes.STRING, allowNull: true, defaultValue: "INTRADAY HIGH" },
      columnIntradayLow: { type: DataTypes.STRING, allowNull: true, defaultValue: "INTRADAY LOW" },
      columnWeekHigh52: { type: DataTypes.STRING, allowNull: true, defaultValue: "52 WEEK HIGH" },
      columnWeekLow52: { type: DataTypes.STRING, allowNull: true, defaultValue: "52 WEEK LOW" },
      // Footer text
      footerText: { type: DataTypes.STRING, allowNull: true, defaultValue: "Pricing delayed by 5 minutes" },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_stock_quote", underscored: true }
  );
  return InvestorsStockQuote;
};

