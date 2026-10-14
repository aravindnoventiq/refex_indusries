import { useState, useEffect, useRef } from 'react';
import { investorsCmsApi, stockApi } from '../../../services/api';
import {
  investorContainer,
  investorSectionWhiteClass,
  investorToggleActiveClass,
  investorToggleInactiveClass,
} from '../investorLayout';

interface StockRecord {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  tradeValue: string;
  trades: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface HistoricalStockQuoteSettings {
  title: string;
  columnDate?: string;
  columnOpen?: string;
  columnHigh?: string;
  columnLow?: string;
  columnClose?: string;
  columnVolume?: string;
  columnTradeValue?: string;
  columnTrades?: string;
  filter1M?: string;
  filter3M?: string;
  filter6M?: string;
  filter1Y?: string;
  defaultExchange?: string;
  recordsPerPage?: number;
  nonce?: string;
  isActive: boolean;
}

function toLocalDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayLocal(): string {
  return toLocalDateInput(new Date());
}

function monthsAgoLocal(months: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(now.getDate(), lastDay));
  return toLocalDateInput(target);
}

function openDatePicker(event: React.MouseEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
    } catch {
      /* picker already open or not allowed */
    }
  }
}

export default function HistoricalStockQuote() {
  const [settings, setSettings] = useState<HistoricalStockQuoteSettings | null>(null);
  const [exchange, setExchange] = useState<'BSE' | 'NSE'>('NSE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<number | null>(1); // null means no filter selected
  const [stockData, setStockData] = useState<StockRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const isFilterButtonChange = useRef(false); // Track if date change is from filter button

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      if (settings.defaultExchange === 'BSE' || settings.defaultExchange === 'NSE') {
        setExchange(settings.defaultExchange);
      }
      initializeDates();
    }
  }, [settings]);

  useEffect(() => {
    if (settings && startDate && endDate) {
      // If dates changed manually (not from filter button), clear the active filter
      if (!isFilterButtonChange.current) {
        setActiveFilter(null); // Clear filter selection
      }
      isFilterButtonChange.current = false; // Reset the flag
      
      fetchHistoricalData();
    }
  }, [startDate, endDate, currentPage, exchange]);

  const loadSettings = async () => {
    try {
      const data = await investorsCmsApi.getHistoricalStockQuote();
      if (data && data.isActive) {
        setSettings(data);
      } else {
        setSettings({
          title: 'Historical Stock Quote',
          columnDate: 'DATE',
          columnOpen: 'OPEN',
          columnHigh: 'HIGH',
          columnLow: 'LOW',
          columnClose: 'CLOSE',
          columnVolume: 'VOLUME',
          columnTradeValue: 'TRADE VALUE',
          columnTrades: 'No. OF TRADES',
          filter1M: '1M',
          filter3M: '3M',
          filter6M: '6M',
          filter1Y: '1Y',
          defaultExchange: 'BSE',
          recordsPerPage: 10,
          nonce: '44efac5c14',
          isActive: true,
        });
      }
    } catch (err) {
      console.error('Failed to load historical stock quote settings:', err);
      setSettings({
        title: 'Historical Stock Quote',
        columnDate: 'DATE',
        columnOpen: 'OPEN',
        columnHigh: 'HIGH',
        columnLow: 'LOW',
        columnClose: 'CLOSE',
        columnVolume: 'VOLUME',
        columnTradeValue: 'TRADE VALUE',
        columnTrades: 'No. OF TRADES',
        filter1M: '1M',
        filter3M: '3M',
        filter6M: '6M',
        filter1Y: '1Y',
        defaultExchange: 'BSE',
        recordsPerPage: 10,
        nonce: '44efac5c14',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDates = () => {
    if (!startDate) {
      setStartDate(monthsAgoLocal(1));
    }
    if (!endDate) {
      setEndDate(todayLocal());
    }
  };

  const fetchHistoricalData = async () => {
    if (!settings || !startDate || !endDate) return;

    try {
      setLoading(true);

      const recordsPerPage = settings.recordsPerPage || 10;
      
      // Use the server's /api/historical endpoint
      const response = await stockApi.getHistoricalData({
        page: currentPage,
        limit: recordsPerPage,
        startDate: startDate,
        endDate: endDate,
        exchange: exchange,
      });

      if (response && response.success && response.data) {
        // Parse the API response data (response.data is the array of stock records)
        const parsedData = parseApiResponse(response.data);
        
        // Server already filters by date, so we use the data directly
        setStockData(parsedData);
        
        // Set pagination info from server response
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          // If no pagination from server, create default
          setPagination({
            currentPage: currentPage,
            totalPages: 1,
            totalRecords: parsedData.length,
            limit: recordsPerPage,
            hasNextPage: false,
            hasPrevPage: currentPage > 1
          });
        }
      } else {
        setStockData([]);
        setPagination(null);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch historical stock data:', err);
      setStockData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const parseApiResponse = (apiData: any): StockRecord[] => {
    const records: StockRecord[] = [];

    // Handle different API response structures
    let dataArray: any[] = [];
    
    if (Array.isArray(apiData)) {
      dataArray = apiData;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      dataArray = apiData.data;
    } else if (apiData.records && Array.isArray(apiData.records)) {
      dataArray = apiData.records;
    } else if (apiData.historical_data && Array.isArray(apiData.historical_data)) {
      dataArray = apiData.historical_data;
    }

    dataArray.forEach((item: any) => {
      // Helper function to get field value with multiple fallbacks
      const getFieldValue = (fieldNames: string[]): string => {
        for (const name of fieldNames) {
          if (item[name] !== undefined && item[name] !== null && item[name] !== '') {
            return String(item[name]);
          }
        }
        return '0';
      };

      // Format trade value with proper formatting
      const formatTradeValue = (value: any): string => {
        if (value === undefined || value === null || value === '') return '0';
        const numValue = parseFloat(String(value));
        if (isNaN(numValue)) return '0';
        // Format with commas and 2 decimal places
        return numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

      // Format volume with proper formatting
      const formatVolume = (value: any): string => {
        if (value === undefined || value === null || value === '') return '0';
        const numValue = parseInt(String(value));
        if (isNaN(numValue)) return '0';
        return numValue.toLocaleString('en-IN');
      };

      records.push({
        date: item.date || item.Date || item.DATE || item.timestamp || '',
        open: String(parseFloat(item.open || item.Open || item.OPEN || item.opening || '0').toFixed(2)),
        high: String(parseFloat(item.high || item.High || item.HIGH || item.high_price || '0').toFixed(2)),
        low: String(parseFloat(item.low || item.Low || item.LOW || item.low_price || '0').toFixed(2)),
        close: String(parseFloat(item.close || item.Close || item.CLOSE || item.closing || item.price || '0').toFixed(2)),
        volume: formatVolume(item.volume || item.Volume || item.VOLUME || item.traded_volume),
        tradeValue: formatTradeValue(getFieldValue(['tradeValue', 'value', 'Value', 'VALUE', 'trade_value', 'TradeValue', 'trade_value_amount', 'tradeValueAmount'])),
        trades: formatVolume(item.noOfTrades || item.trades || item.Trades || item.no_of_trades || item.number_of_trades || item.totalTrades),
      });
    });

    records.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return records;
  };

  const handleQuickFilter = (months: number) => {
    isFilterButtonChange.current = true;
    setCurrentPage(1);
    setEndDate(todayLocal());
    setStartDate(monthsAgoLocal(months));
    setActiveFilter(months);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStart = e.target.value;
    if (!nextStart) return;
    isFilterButtonChange.current = false;
    setCurrentPage(1);
    setActiveFilter(null);
    if (endDate && nextStart > endDate) {
      setEndDate(nextStart);
    }
    setStartDate(nextStart);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextEnd = e.target.value;
    if (!nextEnd) return;
    isFilterButtonChange.current = false;
    setCurrentPage(1);
    setActiveFilter(null);
    if (startDate && nextEnd < startDate) {
      setStartDate(nextEnd);
    }
    setEndDate(nextEnd);
  };

  const handleSearch = () => {
    fetchHistoricalData();
  };

  const recordsPerPage = settings?.recordsPerPage || 10;
  // Use server pagination if available, otherwise calculate from local data
  const totalPages = pagination?.totalPages || Math.ceil(stockData.length / recordsPerPage);
  const totalRecords = pagination?.totalRecords || stockData.length;
  
  // Since server handles pagination, we display all records returned
  const currentRecords = stockData;

  // Calculate maximum pages to show based on active filter
  const getMaxPagesToShow = () => {
    if (activeFilter === 1) {
      return 3; // 1 month: show max 3 page numbers
    }
    return 5; // 3M, 6M, 1Y: show max 5 page numbers
  };

  // Calculate which page numbers to display (centered around current page)
  // This dynamically adjusts based on the actual number of pages available from the loaded data
  const getVisiblePages = () => {
    // If no data or only one page, return empty array (no pagination needed)
    if (totalPages <= 0) {
      return [];
    }

    // If only one page, show it
    if (totalPages === 1) {
      return [1];
    }

    const maxPagesToShow = getMaxPagesToShow();
    const pages: number[] = [];

    // Always show the actual number of pages available (up to the maximum limit)
    // If total pages is less than max, show all pages
    const pagesToDisplay = Math.min(totalPages, maxPagesToShow);

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start page, trying to center around current page
      let startPage = Math.max(1, currentPage - Math.floor((pagesToDisplay - 1) / 2));
      let endPage = Math.min(totalPages, startPage + pagesToDisplay - 1);

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - pagesToDisplay + 1);
      }

      // Ensure we don't go below page 1
      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPages, pagesToDisplay);
      }

      // Add page numbers to display
      for (let i = startPage; i <= endPage && i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (!settings || !settings.isActive) {
    return null;
  }

  return (
    <section className={investorSectionWhiteClass}>
      <div className={investorContainer}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black uppercase tracking-wider sm:text-5xl">
            {settings.title || 'Historical Stock Quote'}
          </h2>
        </div>

        <div className="theme-keep-light bg-white rounded-lg shadow-sm p-6">
          <div className="historical-quote-controls mb-6 flex flex-wrap gap-4 items-end" style={{ colorScheme: 'light' }}>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Exchange</label>
              <select
                value={exchange}
                onChange={(e) => {
                  setExchange(e.target.value as 'BSE' | 'NSE');
                  setCurrentPage(1); // Reset to first page when exchange changes
                }}
                className="h-[42px] cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900"
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>

            <div className="flex min-w-[16rem] flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="historical-start-date">Start Date</label>
              <input
                required
                id="historical-start-date"
                type="date"
                value={startDate}
                min="2000-01-01"
                max={endDate || todayLocal()}
                onChange={handleStartDateChange}
                onClick={openDatePicker}
                className="h-[42px] min-w-[16rem] cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 [color-scheme:light] [appearance:auto]"
              />
            </div>

            <div className="flex min-w-[16rem] flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="historical-end-date">End Date</label>
              <input
                required
                id="historical-end-date"
                type="date"
                value={endDate}
                min={startDate || '2000-01-01'}
                max={todayLocal()}
                onChange={handleEndDateChange}
                onClick={openDatePicker}
                className="h-[42px] min-w-[16rem] cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 [color-scheme:light] [appearance:auto]"
              />
            </div>

            <button 
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-[#7cd244] text-white rounded-md font-medium hover:bg-[#6db038] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickFilter(1)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === 1
                  ? 'bg-[#7cd244] text-white hover:bg-[#6db038]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {settings.filter1M || '1M'}
            </button>
            <button
              onClick={() => handleQuickFilter(3)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === 3
                  ? 'bg-[#7cd244] text-white hover:bg-[#6db038]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {settings.filter3M || '3M'}
            </button>
            <button
              onClick={() => handleQuickFilter(6)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === 6
                  ? 'bg-[#7cd244] text-white hover:bg-[#6db038]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {settings.filter6M || '6M'}
            </button>
            <button
              onClick={() => handleQuickFilter(12)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === 12
                  ? 'bg-[#7cd244] text-white hover:bg-[#6db038]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {settings.filter1Y || '1Y'}
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>Exchange : {exchange} | Period : {startDate} to {endDate}</p>
            {totalRecords > 0 && (
              <p className="mt-1">Total Records: {totalRecords} | Page {currentPage} of {totalPages}</p>
            )}
          </div>

          {loading && stockData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cd244]"></div>
                <p className="mt-4 text-gray-600">Loading historical stock data...</p>
              </div>
            </div>
          ) : stockData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available for the selected period.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnDate || 'DATE'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnOpen || 'OPEN'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnHigh || 'HIGH'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnLow || 'LOW'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnClose || 'CLOSE'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnVolume || 'VOLUME'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnTradeValue || 'TRADE VALUE'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        {settings.columnTrades || 'No. OF TRADES'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3">{record.date}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.open}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.high}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.low}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.close}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.volume}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.tradeValue}</td>
                        <td className="border border-gray-300 px-4 py-3">{record.trades}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2 items-center">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                        : 'text-black hover:text-gray-700 cursor-pointer bg-transparent hover:bg-gray-100'
                    }`}
                  >
                    &lt;&lt;&lt;
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                        : 'text-black hover:text-gray-700 cursor-pointer bg-transparent hover:bg-gray-100'
                    }`}
                  >
                    &lt;&lt;
                  </button>
                  {visiblePages.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#7cd244] text-white'
                          : 'text-black bg-transparent hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                        : 'text-black hover:text-gray-700 cursor-pointer bg-transparent hover:bg-gray-100'
                    }`}
                  >
                    &gt;&gt;
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                        : 'text-black hover:text-gray-700 cursor-pointer bg-transparent hover:bg-gray-100'
                    }`}
                  >
                    &gt;&gt;&gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
