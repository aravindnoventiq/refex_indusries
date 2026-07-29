import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

interface StockChartData {
  id?: number;
  title: string;
  // Filter labels
  filterToday?: string;
  filter5Days?: string;
  filter1Month?: string;
  filter3Months?: string;
  filter6Months?: string;
  filter1Year?: string;
  filter3Years?: string;
  filterYTD?: string;
  filterMAX?: string;
  filterCustom?: string;
  // Chart settings
  defaultChartType?: string;
  defaultExchange?: string;
  defaultFilter?: string;
  // API settings
  nonce?: string;
  isActive: boolean;
}

export default function InvestorStockChartCMS() {
  const [stockChart, setStockChart] = useState<StockChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStockChart();
  }, []);

  const loadStockChart = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getStockChart();
      if (data) {
        setStockChart(data);
      } else {
        // Fallback to default data
        setStockChart({
          title: 'STOCK CHART',
          filterToday: 'Today',
          filter5Days: '5 Days',
          filter1Month: '1 Month',
          filter3Months: '3 Months',
          filter6Months: '6 Months',
          filter1Year: '1 Year',
          filter3Years: '3 Years',
          filterYTD: 'YTD',
          filterMAX: 'MAX',
          filterCustom: 'Custom',
          defaultChartType: 'line',
          defaultExchange: 'BSE',
          defaultFilter: 'Today',
          nonce: '44efac5c14',
          isActive: true,
        });
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load stock chart data');
      }
      // Fallback to default data
      setStockChart({
        title: 'STOCK CHART',
        filterToday: 'Today',
        filter5Days: '5 Days',
        filter1Month: '1 Month',
        filter3Months: '3 Months',
        filter6Months: '6 Months',
        filter1Year: '1 Year',
        filter3Years: '3 Years',
        filterYTD: 'YTD',
        filterMAX: 'MAX',
        filterCustom: 'Custom',
        defaultChartType: 'line',
        defaultExchange: 'BSE',
        defaultFilter: 'Today',
        nonce: '44efac5c14',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stockChart) return;

    if (!stockChart.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await investorsCmsApi.saveStockChart(stockChart);
      setSuccess('Stock Chart settings saved successfully');
      loadStockChart();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save stock chart data');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stock chart settings...</p>
        </div>
      </div>
    );
  }

  if (!stockChart) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No stock chart data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Stock Chart Section</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
        <p className="font-semibold">Note:</p>
        <p className="text-sm mt-1">Chart data is fetched automatically from the APIs. You can customize the section title, filter labels, and default settings here.</p>
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
                value={stockChart.title}
                onChange={(e) => setStockChart({ ...stockChart, title: e.target.value })}
                placeholder="STOCK CHART"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Exchange</label>
              <select
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.defaultExchange || 'BSE'}
                onChange={(e) => setStockChart({ ...stockChart, defaultExchange: e.target.value })}
              >
                <option value="BSE">BSE</option>
                <option value="NSE">NSE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Chart Type</label>
              <select
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.defaultChartType || 'line'}
                onChange={(e) => setStockChart({ ...stockChart, defaultChartType: e.target.value })}
              >
                <option value="line">Line</option>
                <option value="candle">Candle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Filter</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.defaultFilter || 'Today'}
                onChange={(e) => setStockChart({ ...stockChart, defaultFilter: e.target.value })}
                placeholder="Today"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Nonce</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.nonce || ''}
                onChange={(e) => setStockChart({ ...stockChart, nonce: e.target.value })}
                placeholder="44efac5c14"
              />
              <p className="mt-1 text-xs text-gray-500">Nonce for admin-ajax API authentication</p>
            </div>
          </div>
        </div>

        {/* Filter Button Labels */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Button Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Today</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filterToday || 'Today'}
                onChange={(e) => setStockChart({ ...stockChart, filterToday: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5 Days</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter5Days || '5 Days'}
                onChange={(e) => setStockChart({ ...stockChart, filter5Days: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1 Month</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter1Month || '1 Month'}
                onChange={(e) => setStockChart({ ...stockChart, filter1Month: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3 Months</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter3Months || '3 Months'}
                onChange={(e) => setStockChart({ ...stockChart, filter3Months: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6 Months</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter6Months || '6 Months'}
                onChange={(e) => setStockChart({ ...stockChart, filter6Months: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1 Year</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter1Year || '1 Year'}
                onChange={(e) => setStockChart({ ...stockChart, filter1Year: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3 Years</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filter3Years || '3 Years'}
                onChange={(e) => setStockChart({ ...stockChart, filter3Years: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YTD</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filterYTD || 'YTD'}
                onChange={(e) => setStockChart({ ...stockChart, filterYTD: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MAX</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filterMAX || 'MAX'}
                onChange={(e) => setStockChart({ ...stockChart, filterMAX: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={stockChart.filterCustom || 'Custom'}
                onChange={(e) => setStockChart({ ...stockChart, filterCustom: e.target.value })}
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
            checked={stockChart.isActive}
            onChange={(e) => setStockChart({ ...stockChart, isActive: e.target.checked })}
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
            Save Stock Chart Settings
          </button>
        </div>
      </form>
    </div>
  );
}

