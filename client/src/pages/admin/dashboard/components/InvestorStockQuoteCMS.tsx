import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

interface StockQuoteData {
  id?: number;
  title: string;
  currency: string;
  // Column labels
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
  // Footer
  footerText?: string;
  isActive: boolean;
}

export default function InvestorStockQuoteCMS() {
  const [stockQuote, setStockQuote] = useState<StockQuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStockQuote();
  }, []);

  const loadStockQuote = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getStockQuote();
      if (data) {
        setStockQuote(data);
      } else {
        // Fallback to default data
        setStockQuote({
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
        });
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load stock quote data');
      }
      // Fallback to default data
      setStockQuote({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stockQuote) return;

    if (!stockQuote.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await investorsCmsApi.saveStockQuote(stockQuote);
      setSuccess('Stock Quote settings saved successfully');
      loadStockQuote();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save stock quote data');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stock quote settings...</p>
        </div>
      </div>
    );
  }

  if (!stockQuote) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No stock quote data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Stock Quote Section</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
        <p className="font-semibold">Note:</p>
        <p className="text-sm mt-1">Stock values are fetched automatically from the API. You can only customize the column labels and section settings here.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.title}
                onChange={(e) => setStockQuote({ ...stockQuote, title: e.target.value })}
                placeholder="STOCK QUOTE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.currency}
                onChange={(e) => setStockQuote({ ...stockQuote, currency: e.target.value })}
                placeholder="Rupees"
              />
            </div>
          </div>
        </div>

        {/* Column Labels - First Table */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Column Labels (First Table)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnCurrency || 'CURRENCY'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnCurrency: e.target.value })}
                placeholder="CURRENCY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnPrice || 'PRICE'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnPrice: e.target.value })}
                placeholder="PRICE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bid Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnBid || 'BID'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnBid: e.target.value })}
                placeholder="BID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnOffer || 'OFFER'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnOffer: e.target.value })}
                placeholder="OFFER"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnChange || 'CHANGE IN (%)'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnChange: e.target.value })}
                placeholder="CHANGE IN (%)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnVolume || 'VOLUME'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnVolume: e.target.value })}
                placeholder="VOLUME"
              />
            </div>
          </div>
        </div>

        {/* Column Labels - Second Table */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Column Labels (Second Table)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Today's Open Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnTodayOpen || "TODAY'S OPEN"}
                onChange={(e) => setStockQuote({ ...stockQuote, columnTodayOpen: e.target.value })}
                placeholder="TODAY'S OPEN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Close Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnPreviousClose || 'PREVIOUS CLOSE'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnPreviousClose: e.target.value })}
                placeholder="PREVIOUS CLOSE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intraday High Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnIntradayHigh || 'INTRADAY HIGH'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnIntradayHigh: e.target.value })}
                placeholder="INTRADAY HIGH"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intraday Low Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnIntradayLow || 'INTRADAY LOW'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnIntradayLow: e.target.value })}
                placeholder="INTRADAY LOW"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">52 Week High Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnWeekHigh52 || '52 WEEK HIGH'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnWeekHigh52: e.target.value })}
                placeholder="52 WEEK HIGH"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">52 Week Low Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockQuote.columnWeekLow52 || '52 WEEK LOW'}
                onChange={(e) => setStockQuote({ ...stockQuote, columnWeekLow52: e.target.value })}
                placeholder="52 WEEK LOW"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={stockQuote.footerText || ''}
              onChange={(e) => setStockQuote({ ...stockQuote, footerText: e.target.value })}
              placeholder="Pricing delayed by 5 minutes"
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={stockQuote.isActive}
            onChange={(e) => setStockQuote({ ...stockQuote, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Stock Quote Settings
          </button>
        </div>
      </form>
    </div>
  );
}
