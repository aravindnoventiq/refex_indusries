import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

interface HistoricalStockQuoteData {
  id?: number;
  title: string;
  // Column labels
  columnDate?: string;
  columnOpen?: string;
  columnHigh?: string;
  columnLow?: string;
  columnClose?: string;
  columnVolume?: string;
  columnTradeValue?: string;
  columnTrades?: string;
  // Quick filter labels
  filter1M?: string;
  filter3M?: string;
  filter6M?: string;
  filter1Y?: string;
  // Settings
  defaultExchange?: string;
  recordsPerPage?: number;
  // API settings
  nonce?: string;
  isActive: boolean;
}

export default function InvestorHistoricalStockQuoteCMS() {
  const [historicalStockQuote, setHistoricalStockQuote] = useState<HistoricalStockQuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadHistoricalStockQuote();
  }, []);

  const loadHistoricalStockQuote = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getHistoricalStockQuote();
      if (data) {
        setHistoricalStockQuote(data);
      } else {
        setHistoricalStockQuote({
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
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load historical stock quote data');
      }
      setHistoricalStockQuote({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!historicalStockQuote) return;

    if (!historicalStockQuote.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await investorsCmsApi.saveHistoricalStockQuote(historicalStockQuote);
      setSuccess('Historical Stock Quote settings saved successfully');
      loadHistoricalStockQuote();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save historical stock quote data');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading historical stock quote settings...</p>
        </div>
      </div>
    );
  }

  if (!historicalStockQuote) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No historical stock quote data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historical Stock Quote Section</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
        <p className="font-semibold">Note:</p>
        <p className="text-sm mt-1">Historical stock quote data is fetched automatically from the API. You can customize the section title, column labels, and settings here.</p>
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
                value={historicalStockQuote.title}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, title: e.target.value })}
                placeholder="Historical Stock Quote"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Exchange</label>
              <select
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.defaultExchange || 'BSE'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, defaultExchange: e.target.value })}
              >
                <option value="BSE">BSE</option>
                <option value="NSE">NSE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Records Per Page</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.recordsPerPage || 10}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, recordsPerPage: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Nonce</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.nonce || ''}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, nonce: e.target.value })}
                placeholder="44efac5c14"
              />
              <p className="mt-1 text-xs text-gray-500">Nonce for admin-ajax API authentication</p>
            </div>
          </div>
        </div>

        {/* Table Column Labels */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Table Column Labels</h3>
          <p className="text-sm text-gray-600 mb-4">These labels define the headers for the historical stock quote table. The values will be fetched from the API.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnDate || 'DATE'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Open Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnOpen || 'OPEN'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnOpen: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">High Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnHigh || 'HIGH'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnHigh: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnLow || 'LOW'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnLow: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Close Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnClose || 'CLOSE'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnClose: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnVolume || 'VOLUME'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnVolume: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trade Value Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnTradeValue || 'TRADE VALUE'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnTradeValue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trades Column</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.columnTrades || 'No. OF TRADES'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, columnTrades: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Quick Filter Labels */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Filter Button Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1 Month Filter</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.filter1M || '1M'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, filter1M: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3 Months Filter</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.filter3M || '3M'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, filter3M: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6 Months Filter</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.filter6M || '6M'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, filter6M: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1 Year Filter</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={historicalStockQuote.filter1Y || '1Y'}
                onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, filter1Y: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={historicalStockQuote.isActive}
            onChange={(e) => setHistoricalStockQuote({ ...historicalStockQuote, isActive: e.target.checked })}
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
            Save Historical Stock Quote Settings
          </button>
        </div>
      </form>
    </div>
  );
}

