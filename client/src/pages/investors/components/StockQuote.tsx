import { useState, useEffect, useRef } from 'react';
import { investorsCmsApi, stockApi } from '../../../services/api';
import {
  investorCardClass,
  investorContainer,
  investorSectionWhiteClass,
  investorSpinnerClass,
  investorToggleActiveClass,
  investorToggleInactiveClass,
} from '../investorLayout';

interface StockQuoteSettings {
  title?: string;
  currency?: string;
  columnCurrency?: string;
  columnPrice?: string;
  columnBid?: string;
  columnOffer?: string;
  columnChange?: string;
  columnVolume?: string;
  columnTodayOpen?: string;
  columnPreviousClose?: string;
  columnIntradayHigh?: string;
  columnIntradayLow?: string;
  columnWeekHigh52?: string;
  columnWeekLow52?: string;
  footerText?: string;
  isActive?: boolean;
}

interface StockQuoteAPIResponse {
  price?: string | number;
  bid?: string | number;
  offer?: string | number;
  change?: string | number;
  volume?: string | number;
  today_open?: string | number;
  previous_close?: string | number;
  intraday_high?: string | number;
  intraday_low?: string | number;
  week_high_52?: string | number;
  week_low_52?: string | number;
  currency?: string;
  [key: string]: any;
}

export default function StockQuote() {
  const [activeExchange, setActiveExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<StockQuoteSettings | null>(null);
  const [nseData, setNseData] = useState<StockQuoteAPIResponse | null>(null);
  const [bseData, setBseData] = useState<StockQuoteAPIResponse | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default settings as fallback
  const defaultSettings: StockQuoteSettings = {
    title: 'STOCK QUOTE',
    currency: 'Rupees',
    columnCurrency: 'CURRENCY',
    columnPrice: 'PRICE',
    columnBid: 'BID',
    columnOffer: 'OFFER',
    columnChange: 'CHANGE IN (%)',
    columnVolume: 'VOLUME',
    columnTodayOpen: "TODAY'S OPEN",
    columnPreviousClose: 'PREVIOUS CLOSE',
    columnIntradayHigh: 'INTRADAY HIGH',
    columnIntradayLow: 'INTRADAY LOW',
    columnWeekHigh52: '52 WEEK HIGH',
    columnWeekLow52: '52 WEEK LOW',
    footerText: 'Pricing delayed by 5 minutes',
    isActive: true,
  };

  useEffect(() => {
    loadSettings();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (settings?.isActive) {
      fetchStockData();
      // Fetch stock data every 30 seconds
      intervalRef.current = setInterval(() => {
        fetchStockData();
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [settings?.isActive]);

  const loadSettings = async () => {
    try {
      const data = await investorsCmsApi.getStockQuote();
      if (data && data.isActive) {
        setSettings(data);
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockData = async () => {
    try {
      // Fetch NSE data
      const nseResponse = await stockApi.getStockQuoteValue('REFEX.NS');
      console.log('=== NSE API Response (Raw) ===', JSON.stringify(nseResponse, null, 2));
      
      if (nseResponse) {
        // Handle new API response format: { status: true, data: {...} }
        let nseData = nseResponse;
        
        // Check for new API format: { status: true, data: {...} }
        if (nseResponse.status === true && nseResponse.data && typeof nseResponse.data === 'object') {
          nseData = nseResponse.data;
        } 
        // Check for nested structure like { data: {...} } (fallback)
        else if (nseResponse.data && typeof nseResponse.data === 'object' && !nseResponse.status) {
          nseData = nseResponse.data;
        } 
        // Check for old format: { nse_data: {...} }
        else if (nseResponse.nse_data && typeof nseResponse.nse_data === 'object') {
          nseData = nseResponse.nse_data;
        }
        
        console.log('NSE Data extracted:', JSON.stringify(nseData, null, 2));
        console.log('NSE fiftyTwoWeekHigh:', nseData.fiftyTwoWeekHigh);
        console.log('NSE fiftyTwoWeekLow:', nseData.fiftyTwoWeekLow);
        console.log('NSE All Keys:', Object.keys(nseData || {}));
        
        // Set data if we have any valid fields
        if (nseData && typeof nseData === 'object' && nseData.current_price !== undefined) {
          setNseData(nseData);
        }
      }

      // Fetch BSE data
      const bseResponse = await stockApi.getStockQuoteValue('REFEX.BO');
      console.log('=== BSE API Response (Raw) ===', JSON.stringify(bseResponse, null, 2));
      
      if (bseResponse) {
        // Handle new API response format: { status: true, data: {...} }
        let bseData = bseResponse;
        
        // Check for new API format: { status: true, data: {...} }
        if (bseResponse.status === true && bseResponse.data && typeof bseResponse.data === 'object') {
          bseData = bseResponse.data;
        } 
        // Check for nested structure like { data: {...} } (fallback)
        else if (bseResponse.data && typeof bseResponse.data === 'object' && !bseResponse.status) {
          bseData = bseResponse.data;
        } 
        // Check for old format: { bse_data: {...} }
        else if (bseResponse.bse_data && typeof bseResponse.bse_data === 'object') {
          bseData = bseResponse.bse_data;
        }
        
        console.log('BSE Data extracted:', JSON.stringify(bseData, null, 2));
        console.log('BSE fiftyTwoWeekHigh:', bseData.fiftyTwoWeekHigh);
        console.log('BSE fiftyTwoWeekLow:', bseData.fiftyTwoWeekLow);
        console.log('BSE All Keys:', Object.keys(bseData || {}));
        
        // Set data if we have any valid fields
        if (bseData && typeof bseData === 'object' && bseData.current_price !== undefined) {
          setBseData(bseData);
        }
      }

      // Update last updated timestamp
      const now = new Date();
      setLastUpdated(`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`);
    } catch (err) {
      console.error('Failed to fetch stock quote data:', err);
    }
  };

  const formatValue = (value: string | number | undefined): string => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  };

  const getChangeValue = (change: string | number | undefined): string => {
    if (change === undefined || change === null) return '-';
    const changeStr = String(change);
    // If it doesn't start with + or -, add + for positive values
    if (!changeStr.startsWith('+') && !changeStr.startsWith('-')) {
      const num = parseFloat(changeStr);
      return num >= 0 ? `+${changeStr}` : changeStr;
    }
    return changeStr;
  };

  const isPositiveChange = (change: string | number | undefined): boolean => {
    if (change === undefined || change === null) return false;
    const changeStr = String(change);
    return changeStr.startsWith('+') || (!changeStr.startsWith('-') && parseFloat(changeStr) > 0);
  };

  // Helper to get value from API response with multiple possible field names
  const getFieldValue = (data: StockQuoteAPIResponse | null, fieldNames: string[]): string | number | undefined => {
    if (!data) return undefined;
    for (const fieldName of fieldNames) {
      if (data[fieldName] !== undefined && data[fieldName] !== null) {
        return data[fieldName];
      }
    }
    return undefined;
  };

  const currentSettings = settings || defaultSettings;
  const currentData = activeExchange === 'NSE' ? nseData : bseData;

  if (loading) {
    return (
      <section className={investorSectionWhiteClass}>
        <div className={investorContainer}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={investorSpinnerClass} aria-hidden />
              <p className="mt-4 text-[#5a5a5a]">Loading stock quote...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentSettings.isActive) {
    return null;
  }

  return (
    <section className={investorSectionWhiteClass}>
      <div className={investorContainer}>
        <div className="mb-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#4C8C2B]">
            Market Data
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl font-medium uppercase tracking-wide text-[#1f1f1f] sm:text-4xl">
            {currentSettings.title}
          </h2>

          <div className="mt-6 flex justify-end gap-3 sm:gap-4">
            <button
              onClick={() => setActiveExchange('NSE')}
              className={`rounded-full px-8 py-2.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeExchange === 'NSE' ? investorToggleActiveClass : investorToggleInactiveClass
              }`}
            >
              NSE
            </button>
            <button
              onClick={() => setActiveExchange('BSE')}
              className={`rounded-full px-8 py-2.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeExchange === 'BSE' ? investorToggleActiveClass : investorToggleInactiveClass
              }`}
            >
              BSE
            </button>
          </div>
        </div>

        <div className={`overflow-x-auto ${investorCardClass}`}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#2d5016] text-white">
                <th className="border-b border-[#dfe7da] px-4 py-3 text-left font-semibold">{currentSettings.columnCurrency}</th>
                <th className="border-b border-[#dfe7da] px-4 py-3 text-left font-semibold">{currentSettings.columnPrice}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnBid}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnOffer}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnChange}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnVolume}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-[#eef2ea] px-4 py-3">{currentSettings.currency}</td>
                <td className="border border-[#eef2ea] px-4 py-3 font-semibold">{formatValue(getFieldValue(currentData, ['price', 'Price', 'PRICE', 'current_price', 'last_price']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['bid', 'Bid', 'BID', 'bid_price']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['offer', 'Offer', 'OFFER', 'ask', 'Ask', 'ASK', 'ask_price']))}</td>
                <td className={`border border-[#eef2ea] px-4 py-3 font-semibold ${isPositiveChange(getFieldValue(currentData, ['change', 'Change', 'CHANGE', 'change_percent', 'change_percentage'])) ? 'text-green-600' : 'text-red-600'}`}>
                  {getChangeValue(getFieldValue(currentData, ['change', 'Change', 'CHANGE', 'change_percent', 'change_percentage']))}
                </td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['volume', 'Volume', 'VOLUME', 'trading_volume']))}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-[#eef2ea] mt-4">
            <thead>
              <tr className="bg-[#2d5016] text-white">
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnTodayOpen}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnPreviousClose}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnIntradayHigh}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnIntradayLow}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnWeekHigh52}</th>
                <th className="border border-[#eef2ea] px-4 py-3 text-left font-semibold">{currentSettings.columnWeekLow52}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['today_open', 'todayOpen', 'open', 'Open', 'OPEN', 'opening_price']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['previous_close', 'previousClose', 'prev_close', 'PrevClose', 'close', 'Close', 'CLOSE', 'closing_price']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['intraday_high', 'intradayHigh', 'high', 'High', 'HIGH', 'day_high', 'dayHigh']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['intraday_low', 'intradayLow', 'low', 'Low', 'LOW', 'day_low', 'dayLow']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['fiftyTwoWeekHigh', 'FiftyTwoWeekHigh', 'FIFTY_TWO_WEEK_HIGH', 'week_high_52', 'weekHigh52', '52_week_high', '52WeekHigh', 'year_high', 'yearHigh']))}</td>
                <td className="border border-[#eef2ea] px-4 py-3">{formatValue(getFieldValue(currentData, ['fiftyTwoWeekLow', 'FiftyTwoWeekLow', 'FIFTY_TWO_WEEK_LOW', 'week_low_52', 'weekLow52', '52_week_low', '52WeekLow', 'year_low', 'yearLow']))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right text-sm text-[#5a5a5a]">
          <p>{currentSettings.footerText}</p>
          {lastUpdated && <p>Last Updated {lastUpdated}</p>}
        </div>
      </div>
    </section>
  );
}
