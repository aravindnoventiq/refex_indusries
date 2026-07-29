import { useState, useEffect, useRef } from 'react';
import { investorsCmsApi, stockApi } from '../../../services/api';
import { investorContainer, investorSectionSageClass } from '../investorLayout';

interface ChartDataPoint {
  x: number;
  y: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume: number;
  time: Date;
}

interface StockChartSettings {
  title: string;
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
  defaultChartType?: string;
  defaultExchange?: string;
  defaultFilter?: string;
  nonce?: string;
  isActive: boolean;
}

export default function StockChart() {
  const [settings, setSettings] = useState<StockChartSettings | null>(null);
  const [activeExchange, setActiveExchange] = useState<'BSE' | 'NSE'>('BSE');
  const [activeFilter, setActiveFilter] = useState('Today');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sliderPosition, setSliderPosition] = useState({ start: 0, end: 100 });
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'middle' | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);

  // Load CMS settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Fetch chart data when exchange/filter changes
  useEffect(() => {
    if (settings) {
      fetchChartData();
    }
  }, [activeExchange, activeFilter, fromDate, toDate, settings]);

  const loadSettings = async () => {
    try {
      const data = await investorsCmsApi.getStockChart();
      if (data && data.isActive) {
        setSettings(data);
        setActiveExchange((data.defaultExchange || 'BSE') as 'BSE' | 'NSE');
        setActiveFilter(data.defaultFilter || 'Today');
        setChartType((data.defaultChartType || 'line') as 'line' | 'candle');
      } else {
        setSettings({
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
          isActive: true,
        });
      }
    } catch (err) {
      console.error('Failed to load stock chart settings:', err);
      setSettings({
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
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (!settings) return;

    try {
      setLoading(true);
      let data: ChartDataPoint[] = [];

      // Get correct stock symbol based on exchange
      const stockSymbol = activeExchange === 'BSE' ? 'REFEX.BO' : 'REFEX.NS';

      if (activeFilter === 'Today') {
        // Use intraday API for today
        try {
          const response = await stockApi.getIntradayChartData(stockSymbol, '');
          console.log('Intraday API Response:', response);
          // Handle different response structures
          let chartArray = null;
          if (Array.isArray(response)) {
            chartArray = response;
          } else if (response && Array.isArray(response.data)) {
            chartArray = response.data;
          } else if (response && response.chart_data && Array.isArray(response.chart_data)) {
            chartArray = response.chart_data;
          }
          
          if (chartArray) {
            console.log('Chart data array sample:', chartArray[0]);
            data = parseIntradayData(chartArray);
          }
        } catch (err) {
          console.error('Failed to fetch intraday data:', err);
        }
      } else {
        // Calculate date range based on filter
        let startDate = '';
        let endDate = '';
        const today = new Date();
        endDate = formatDateForApi(today);

        if (showCustomFilter && fromDate && toDate) {
          startDate = fromDate;
          endDate = toDate;
        } else {
          const startDateObj = new Date();
          
          switch (activeFilter) {
            case '5 Days':
              startDateObj.setDate(startDateObj.getDate() - 5);
              break;
            case '1 Month':
              startDateObj.setMonth(startDateObj.getMonth() - 1);
              break;
            case '3 Months':
              startDateObj.setMonth(startDateObj.getMonth() - 3);
              break;
            case '6 Months':
              startDateObj.setMonth(startDateObj.getMonth() - 6);
              break;
            case '1 Year':
              startDateObj.setFullYear(startDateObj.getFullYear() - 1);
              break;
            case '3 Years':
              startDateObj.setFullYear(startDateObj.getFullYear() - 3);
              break;
            case 'YTD':
              startDateObj.setMonth(0);
              startDateObj.setDate(1);
              break;
            case 'MAX':
              startDateObj.setFullYear(startDateObj.getFullYear() - 10);
              break;
          }
          startDate = formatDateForApi(startDateObj);
        }

        // Use chart-by-api for historical data
        try {
          const response = await stockApi.getChartByApi(stockSymbol, startDate, endDate);
          console.log('Chart API Response:', response);
          
          // Handle new API response format: { data: [...], start_date, end_date }
          let chartArray = null;
          if (response && Array.isArray(response.data)) {
            chartArray = response.data;
          } else if (Array.isArray(response)) {
            chartArray = response;
          } else if (response && response.chart_data && Array.isArray(response.chart_data)) {
            chartArray = response.chart_data;
          }
          
          if (chartArray && chartArray.length > 0) {
            // Filter data by start_date and end_date
            const filteredArray = filterDataByDateRange(chartArray, startDate, endDate);
            console.log('Filtered chart data:', {
              original: chartArray.length,
              filtered: filteredArray.length,
              startDate,
              endDate
            });
            console.log('Chart data array sample:', filteredArray[0]);
            data = parseHistoricalData(filteredArray, startDate, endDate);
          }
        } catch (err) {
          console.error('Failed to fetch chart data:', err);
        }
      }

      if (data.length === 0) {
        data = generateMockChartData();
      }

      setChartData(data);
      setSliderPosition({ start: 0, end: 100 });
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setChartData(generateMockChartData());
    } finally {
      setLoading(false);
    }
  };

  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter data array by start_date and end_date
  const filterDataByDateRange = (dataArray: any[], startDate: string, endDate: string): any[] => {
    if (!startDate || !endDate || !Array.isArray(dataArray) || dataArray.length === 0) {
      return dataArray;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set end date to end of day for inclusive filtering
    end.setHours(23, 59, 59, 999);

    return dataArray.filter((item: any) => {
      const dateStr = item.Date || item.date || item.Datetime || item.datetime;
      if (!dateStr) return false;
      
      // Parse date string (format: "2007-08-20" or "2007-08-20 00:00:00")
      const itemDateStr = dateStr.split(' ')[0]; // Get date part only
      const itemDate = new Date(itemDateStr);
      
      // Check if date is within range (inclusive)
      return itemDate >= start && itemDate <= end;
    });
  };

  const parseIntradayData = (apiData: any): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    
    // Helper to parse date string like "2025-12-08 09:20:00"
    const parseDateTime = (dateStr: string): Date => {
      if (!dateStr) return new Date();
      // Replace space with T for ISO format compatibility
      const isoStr = dateStr.replace(' ', 'T');
      return new Date(isoStr);
    };
    
    if (Array.isArray(apiData)) {
      console.log('Parsing intraday data, total items:', apiData.length);
      
      // First, map all raw data points
      apiData.forEach((item: any, idx: number) => {
        const dateValue = item.Date || item.date || item.Time || item.time || item.Datetime || item.datetime;
        const timestamp = parseDateTime(dateValue);
        const closeValue = parseFloat(item.Close || item.close || '0');
        
        if (idx < 3) {
          console.log(`Item ${idx}:`, { Date: dateValue, Close: item.Close, close: item.close, parsedClose: closeValue });
        }
        
        data.push({
          x: 0, // Will be set after sorting / aggregation
          y: closeValue,
          open: parseFloat(item.Open || item.open || closeValue.toString()),
          high: parseFloat(item.High || item.high || closeValue.toString()),
          low: parseFloat(item.Low || item.low || closeValue.toString()),
          close: closeValue,
          volume: parseFloat(item.Volume || item.volume || '0'),
          time: timestamp,
        });
      });
      
      // Sort by time to ensure correct order
      data.sort((a, b) => a.time.getTime() - b.time.getTime());

      // For "Today" filter, show data at 10-minute intervals with correct close values
      if (activeFilter === 'Today') {
        // Filter to only show data points at 10-minute intervals (9:20, 9:30, 9:40, etc.)
        // and use the close value from that exact time
        const filteredData: ChartDataPoint[] = [];
        
        data.forEach((point) => {
          const minutes = point.time.getMinutes();
          // Only include points where minutes are multiples of 10 (0, 10, 20, 30, 40, 50)
          if (minutes % 10 === 0) {
            filteredData.push({
              ...point,
              x: filteredData.length, // Will be reassigned after filtering
            });
          }
        });

        // Reassign x indices after filtering
        filteredData.forEach((point, index) => {
          point.x = index;
        });

        console.log('Filtered 10‑minute interval points:', filteredData.slice(0, 5).map(d => ({
          time: d.time.toLocaleTimeString(),
          close: d.close,
          y: d.y,
          minutes: d.time.getMinutes()
        })));
        
        return filteredData;
      }
      
      // Default: no aggregation, just assign x after sorting
      data.forEach((point, index) => {
        point.x = index;
      });
      
      console.log('Parsed data (first 3):', data.slice(0, 3).map(d => ({ time: d.time.toISOString(), y: d.y, close: d.close })));
    }
    return data;
  };

  const parseHistoricalData = (
    apiData: any,
    startDate: string,
    endDate: string
  ): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Helper to parse date string like "2025-12-08 09:20:00"
    const parseDateTime = (dateStr: string): Date => {
      if (!dateStr) return new Date();
      // Replace space with T for ISO format compatibility
      const isoStr = dateStr.replace(' ', 'T');
      return new Date(isoStr);
    };
    
    if (Array.isArray(apiData)) {
      const isDailyGrouping = activeFilter === '1 Month' || activeFilter === '5 Days';
      if (isDailyGrouping) {
        // Group into 1-day candles for 1 Month filter
        const dayMap = new Map<
          string,
          {
            time: Date;
            open: number;
            high: number;
            low: number;
            close: number;
            volume: number;
          }
        >();

        apiData.forEach((item: any) => {
          const dateValue = item.Date || item.date || item.Time || item.time;
          const timestamp = parseDateTime(dateValue);

          if (timestamp < start || timestamp > end) return;

          const dayKey = timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
          const priceOpen = parseFloat(item.Open || item.open || '0');
          const priceHigh = parseFloat(item.High || item.high || '0');
          const priceLow = parseFloat(item.Low || item.low || '0');
          const priceClose = parseFloat(item.Close || item.close || '0');
          const vol = parseFloat(item.Volume || item.volume || '0');

          const existing = dayMap.get(dayKey);
          if (!existing) {
            dayMap.set(dayKey, {
              time: timestamp,
              open: priceOpen,
              high: priceHigh,
              low: priceLow,
              close: priceClose,
              volume: vol,
            });
          } else {
            existing.high = Math.max(existing.high, priceHigh);
            existing.low = Math.min(existing.low, priceLow);
            existing.close = priceClose; // last close of the day
            existing.volume += vol;
            // keep earliest time as time field (for ordering)
          }
        });

        const grouped: ChartDataPoint[] = Array.from(dayMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([_, v], index) => ({
            x: index,
            y: v.close,
            open: v.open,
            high: v.high,
            low: v.low,
            close: v.close,
            volume: v.volume,
            time: v.time,
          }));

        return grouped;
      } else {
        // Original behavior: use each API point as-is (within date range)
        apiData.forEach((item: any) => {
          const dateValue = item.Date || item.date || item.Time || item.time;
          const timestamp = parseDateTime(dateValue);

          // Filter by date range
          if (timestamp >= start && timestamp <= end) {
            data.push({
              x: 0, // Will be set after sorting
              y: parseFloat(item.Close || item.close || '0'),
              open: parseFloat(item.Open || item.open || '0'),
              high: parseFloat(item.High || item.high || '0'),
              low: parseFloat(item.Low || item.low || '0'),
              close: parseFloat(item.Close || item.close || '0'),
              volume: parseFloat(item.Volume || item.volume || '0'),
              time: timestamp,
            });
          }
        });

        // Sort by date to ensure correct order
        data.sort((a, b) => a.time.getTime() - b.time.getTime());

        // Update x index after sorting
        data.forEach((point, index) => {
          point.x = index;
        });
      }
    }
    return data;
  };

  const generateMockChartData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const basePrice = 331;
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(15, 30, 0, 0);
    
    const totalMinutes = (endTime.getTime() - today.getTime()) / (1000 * 60);
    const points = Math.floor(totalMinutes / 5);
    
    for (let i = 0; i < points; i++) {
      const variation = Math.sin(i / 15) * 3 + (Math.random() - 0.5) * 1.5;
      const timestamp = new Date(today.getTime() + i * 5 * 60 * 1000);
      const price = basePrice + variation;
      
      const open = price + (Math.random() - 0.5) * 0.5;
      const close = price + (Math.random() - 0.5) * 0.5;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      
      data.push({
        x: i,
        y: price,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000) + 100,
        time: timestamp,
      });
    }
    return data;
  };

  // Calculate visible data based on slider position
  const startIdx = Math.floor((sliderPosition.start / 100) * chartData.length);
  const endIdx = Math.ceil((sliderPosition.end / 100) * chartData.length);
  const visibleData = chartData.slice(startIdx, endIdx || chartData.length);

  const maxPrice = visibleData.length > 0 ? Math.max(...visibleData.map(d => chartType === 'candle' ? (d.high || d.y) : d.y)) : 340;
  const minPrice = visibleData.length > 0 ? Math.min(...visibleData.map(d => chartType === 'candle' ? (d.low || d.y) : d.y)) : 330;
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = visibleData.length > 0 ? Math.max(...visibleData.map(d => d.volume)) : 10000;

  // Adjust chart heights slightly for short ranges like 5 Days
  const isFiveDays = activeFilter === '5 Days';
  const priceChartHeight = isFiveDays ? 260 : 300;
  const volumeChartHeight = isFiveDays ? 80 : 100;

  // Format time for display (HH:MM format)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Format date for general display (DD/MM/YYYY format)
  const formatDisplayDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date specifically for X-axis labels based on active filter
  const formatXAxisLabel = (date: Date): string => {
    const monthShort = date.toLocaleString('en-US', { month: 'short' }); // Jan, Feb, ...
    const monthShortUpper = monthShort.toUpperCase(); // JAN, FEB, ...
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    switch (activeFilter) {
      // Show day-level labels: "DEC 15"
      case '5 Days':
      case '1 Month':
        return `${monthShortUpper} ${day}`;

      // Custom range: if within ~1 month, also show day-level labels
      case 'Custom': {
        if (fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          const diffMs = to.getTime() - from.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays <= 31) {
            return `${monthShortUpper} ${day}`;
          }
        }
        // Fallback: show month name
        return monthShort;
      }

      // Show month-level labels: "Jan", "Feb", "Mar"
      case '3 Months':
      case '6 Months':
      case '1 Year':
        return monthShort;

      // Show year + month for January, and month only for others:
      // e.g., "Jan 2023, Jul, Jan 2024, Jul, Jan 2025, Jul"
      case '3 Years':
        if (date.getMonth() === 0) {
          // January
          return `${monthShort} ${year}`;
        }
        return monthShort;

      // Default fallback
      default:
        return formatDisplayDate(date);
    }
  };

  // Turn raw dates + positions into final label strings, ensuring that
  // if the same month appears more than once in the same year, we also show the day.
  const finalizeTimeLabels = (
    raw: { date: Date; position: number }[],
    useTimeOnly: boolean
  ): { time: string; position: number }[] => {
    if (raw.length === 0) return [];

    // Count how many times each (year, month) appears
    const monthCounts = new Map<string, number>();
    raw.forEach(({ date }) => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
    });

    return raw.map(({ date, position }) => {
      let label: string;

      if (useTimeOnly) {
        label = formatTime(date);
      } else {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const count = monthCounts.get(key) || 0;

        if (count > 1) {
          // If the same month appears multiple times in this year, include the day as well: "DEC 16"
          const monthShortUpper = date
            .toLocaleString('en-US', { month: 'short' })
            .toUpperCase();
          const day = String(date.getDate()).padStart(2, '0');
          label = `${monthShortUpper} ${day}`;
        } else {
          // Normal behavior based on active filter
          label = formatXAxisLabel(date);
        }
      }

      return { time: label, position };
    });
  };

  // Get default start date for the current (non-custom) filter
  const getFilterStartDate = (): Date => {
    const startDate = new Date();
    switch (activeFilter) {
      case '5 Days':
        startDate.setDate(startDate.getDate() - 5);
        break;
      case '1 Month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3 Months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6 Months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1 Year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '3 Years':
        startDate.setFullYear(startDate.getFullYear() - 3);
        break;
      case 'YTD':
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
      case 'MAX':
        startDate.setFullYear(startDate.getFullYear() - 10);
        break;
    }
    return startDate;
  };

  // Get display date based on filter
  const getFilterDateDisplay = (): string => {
    const today = new Date();
    
    if (activeFilter === 'Today') {
      return formatDisplayDate(today);
    }
    
    if (showCustomFilter && fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`;
    }
    
    const startDate = getFilterStartDate();
    
    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(today)}`;
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end' | 'middle') => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (isDragging === 'start') {
      setSliderPosition(prev => ({
        ...prev,
        start: Math.min(percentage, prev.end - 5)
      }));
    } else if (isDragging === 'end') {
      setSliderPosition(prev => ({
        ...prev,
        end: Math.max(percentage, prev.start + 5)
      }));
    } else if (isDragging === 'middle') {
      const width = sliderPosition.end - sliderPosition.start;
      const newStart = Math.max(0, Math.min(100 - width, percentage - width / 2));
      setSliderPosition({
        start: newStart,
        end: newStart + width
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleChartMouseMove = (e: React.MouseEvent, chartRef: React.RefObject<HTMLDivElement | null>) => {
    if (!chartRef.current || visibleData.length === 0) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Chart area: left margin is ~5%, right extends to ~100%
    const chartLeftMargin = rect.width * 0.05;
    const chartWidth = rect.width * 0.95;
    
    if (x < chartLeftMargin) {
      setHoveredIndex(null);
      return;
    }
    
    const relativeX = (x - chartLeftMargin) / chartWidth;
    const dataIndex = Math.round(relativeX * (visibleData.length - 1));
    const clampedIndex = Math.max(0, Math.min(visibleData.length - 1, dataIndex));
    
    setHoveredIndex(clampedIndex);
    setMousePos({ x, y });
  };

  const handleChartMouseLeave = () => {
    setHoveredIndex(null);
  };

  const getFilterLabel = (filter: string): string => {
    if (!settings) return filter;
    
    const filterMap: { [key: string]: string } = {
      'Today': settings.filterToday || 'Today',
      '5 Days': settings.filter5Days || '5 Days',
      '1 Month': settings.filter1Month || '1 Month',
      '3 Months': settings.filter3Months || '3 Months',
      '6 Months': settings.filter6Months || '6 Months',
      '1 Year': settings.filter1Year || '1 Year',
      '3 Years': settings.filter3Years || '3 Years',
      'YTD': settings.filterYTD || 'YTD',
      'MAX': settings.filterMAX || 'MAX',
      'Custom': settings.filterCustom || 'Custom',
    };
    
    return filterMap[filter] || filter;
  };

  const filters = ['Today', '5 Days', '1 Month', '3 Months', '6 Months', '1 Year', '3 Years', 'Custom'];

  // Generate time/date labels for X-axis based on active filter
  const getTimeLabels = () => {
    if (visibleData.length === 0) return [];
    
    // We'll first collect raw date + position, then decide label text
    const rawLabels: { date: Date; position: number }[] = [];
    const useTimeOnly = activeFilter === 'Today';
    const startTime = visibleData[0].time.getTime();
    const endTime = visibleData[visibleData.length - 1].time.getTime();
    const totalRange = Math.max(1, endTime - startTime);

    // Helper to compute X position (0-100) for a given date
    const getPositionForDate = (d: Date) => {
      const t = d.getTime();
      const clamped = Math.min(endTime, Math.max(startTime, t));
      return ((clamped - startTime) / totalRange) * 100;
    };

    // Special handling for 3 Months: show exactly 3 month labels (start/mid/end months)
    if (activeFilter === '3 Months' && !useTimeOnly) {
      const startDate = new Date(visibleData[0].time);
      const labelDates: Date[] = [];

      // First month (start)
      labelDates.push(new Date(startDate.getFullYear(), startDate.getMonth(), 1));

      // Middle month (start month + 1)
      labelDates.push(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1));

      // Last month (start month + 2)
      labelDates.push(new Date(startDate.getFullYear(), startDate.getMonth() + 2, 1));

      labelDates.forEach((d) => {
        rawLabels.push({
          date: d,
          position: getPositionForDate(d),
        });
      });

      // We'll convert to final labels after collision handling
      return finalizeTimeLabels(rawLabels, useTimeOnly);
    }

    // Special handling for 3 Years: show a few month markers per year (Jan with year, Apr, Sep)
    if (activeFilter === '3 Years' && !useTimeOnly) {
      const startDate = new Date(visibleData[0].time);
      const endDate = new Date(visibleData[visibleData.length - 1].time);
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      const markerMonths = [0, 3, 8]; // Jan, Apr, Sep

      for (let y = startYear; y <= endYear; y++) {
        markerMonths.forEach((m) => {
          const d = new Date(y, m, 1);
          if (d >= startDate && d <= endDate) {
            rawLabels.push({
              date: d,
              position: getPositionForDate(d),
            });
          }
        });
      }

      return finalizeTimeLabels(rawLabels, useTimeOnly);
    }

    // Default behaviour: sample visible data points evenly
    const baseLabelCount = 6;
    const step = Math.max(1, Math.floor(visibleData.length / baseLabelCount));
    
    for (let i = 0; i < visibleData.length; i += step) {
      rawLabels.push({
        date: visibleData[i].time,
        position: (i / (visibleData.length - 1)) * 100
      });
    }
    
    // Always include last point
    if (rawLabels.length > 0 && rawLabels[rawLabels.length - 1].position < 95) {
      rawLabels.push({
        date: visibleData[visibleData.length - 1].time,
        position: 100
      });
    }

    return finalizeTimeLabels(rawLabels, useTimeOnly);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, sliderPosition]);

  // Show loader when loading and no data exists
  if (loading && chartData.length === 0) {
    return (
      <section className={investorSectionSageClass}>
        <div className={investorContainer}>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cd244]"></div>
            <p className="mt-4 text-gray-600">Loading stock chart...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!settings || !settings.isActive) {
    return null;
  }

  const timeLabels = getTimeLabels();

  return (
    <section className={investorSectionSageClass}>
      <div className={investorContainer}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black uppercase tracking-wider">
            {settings.title || 'STOCK CHART'}
          </h2>
        </div>

        {/* Exchange Tabs (BSE / NSE) - placed above filters */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setActiveExchange('BSE')}
            disabled={loading}
            className={`px-6 py-2 font-semibold text-sm rounded ${
              activeExchange === 'BSE'
                ? 'bg-[#7dc244] text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            BSE
          </button>
          <button
            onClick={() => setActiveExchange('NSE')}
            disabled={loading}
            className={`px-6 py-2 font-semibold text-sm rounded ${
              activeExchange === 'NSE'
                ? 'bg-[#7dc244] text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            NSE
          </button>
        </div>

        {/* Separator line between exchange tabs and filters */}
        <div className="w-full h-px bg-black mb-3" />

        {/* Filter Tabs (Today, 5 Days, 1 Month, etc.) */}
        <div className="bg-black text-white flex flex-wrap items-center px-4 py-2 gap-0">
          {filters.map((filter, index) => (
            <button
              key={filter}
              onClick={() => {
                if (loading) return;
                if (filter === 'Custom') {
                  // When opening Custom, default to previous filter's start date and today's date
                  if (!fromDate) {
                    const start = getFilterStartDate();
                    setFromDate(formatDateForApi(start));
                  }
                  if (!toDate) {
                    const todayStr = formatDateForApi(new Date());
                    setToDate(todayStr);
                  }
                  setActiveFilter('Custom');
                  setShowCustomFilter(true);
                } else {
                  setActiveFilter(filter);
                  setShowCustomFilter(false);
                }
              }}
              disabled={loading}
              className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              } ${
                (activeFilter === filter && filter !== 'Custom') || (filter === 'Custom' && showCustomFilter)
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-800'
              } ${index > 0 ? 'border-l border-white' : ''}`}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>

        {/* Custom Date Picker */}
        {showCustomFilter && (
          <div className="bg-gray-100 p-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={fromDate}
                max={toDate || formatDateForApi(new Date())}
                onChange={(e) => {
                  const newFrom = e.target.value;
                  const todayStr = formatDateForApi(new Date());
                  if (toDate && newFrom > toDate) {
                    // Ensure fromDate is never after toDate
                    setFromDate(toDate);
                  } else {
                    setFromDate(newFrom);
                  }
                  // Automatically update chart when both dates are set and valid
                  if (newFrom && toDate && newFrom <= toDate && toDate <= todayStr) {
                    setActiveFilter('Custom');
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={toDate}
                max={formatDateForApi(new Date())}
                onChange={(e) => {
                  const todayStr = formatDateForApi(new Date());
                  let newTo = e.target.value || '';
                  // Prevent selecting future dates
                  if (newTo > todayStr) {
                    newTo = todayStr;
                  }
                  // Ensure fromDate is not after toDate
                  if (fromDate && newTo && newTo < fromDate) {
                    setFromDate(newTo);
                  }
                  setToDate(newTo);
                  // Automatically update chart when both dates are set and valid
                  if (fromDate && newTo && fromDate <= newTo && newTo <= todayStr) {
                    setActiveFilter('Custom');
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cd244]"></div>
                <p className="mt-4 text-gray-600">Loading chart data...</p>
              </div>
            </div>
          )}

          {/* Date and Chart Type Selector */}
          <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200">
            <p className="text-sm text-gray-700 font-medium">{getFilterDateDisplay()}</p>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'candle')}
              className="px-4 py-2 border border-gray-300 rounded text-sm cursor-pointer bg-white"
            >
              <option value="line">Line</option>
              <option value="candle">Candle</option>
            </select>
          </div>

          {/* Main Price Chart */}
          <div 
            ref={priceChartRef}
            className="relative bg-[#f5f5f5] cursor-crosshair"
            style={{ height: `${priceChartHeight}px` }}
            onMouseMove={(e) => handleChartMouseMove(e, priceChartRef)}
            onMouseLeave={handleChartMouseLeave}
          >
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4 text-xs text-gray-600">
              {[0, 1, 2, 3, 4].map((i) => {
                const value = maxPrice - (priceRange / 4) * i;
                return (
                  <span key={i} className="text-right pr-2">{value.toFixed(0)}</span>
                );
              })}
            </div>

            {/* Chart Area */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" className="overflow-visible">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 75}
                    x2="1000"
                    y2={i * 75}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                ))}

                {chartType === 'line' ? (
                  <>
                    {/* Line chart */}
                    <polyline
                      points={visibleData
                        .map((point, i) => {
                          const x = (i / Math.max(1, visibleData.length - 1)) * 1000;
                          const y = ((maxPrice - point.y) / priceRange) * 300;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#2196F3"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Hover point circle */}
                    {hoveredIndex !== null && visibleData[hoveredIndex] && (
                      <circle
                        cx={(hoveredIndex / Math.max(1, visibleData.length - 1)) * 1000}
                        cy={((maxPrice - visibleData[hoveredIndex].y) / priceRange) * 300}
                        r="6"
                        fill="#2196F3"
                        stroke="#fff"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* Candle chart */}
                    {visibleData.map((point, i) => {
                      const x = (i / Math.max(1, visibleData.length - 1)) * 1000;
                      // Make 5 Days candles slimmer so they don't look oversized
                      const baseWidth = 800 / Math.max(1, visibleData.length);
                      const maxWidth = isFiveDays ? 40 : 80;
                      const candleWidth = Math.max(3, Math.min(baseWidth, maxWidth));
                      
                      const highY = ((maxPrice - (point.high || point.y)) / priceRange) * 300;
                      const lowY = ((maxPrice - (point.low || point.y)) / priceRange) * 300;
                      const openY = ((maxPrice - (point.open || point.y)) / priceRange) * 300;
                      const closeY = ((maxPrice - (point.close || point.y)) / priceRange) * 300;
                      
                      const isGreen = (point.close || point.y) >= (point.open || point.y);
                      const bodyTop = Math.min(openY, closeY);
                      const bodyHeight = Math.abs(closeY - openY);
                      
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={highY}
                            x2={x}
                            y2={lowY}
                            stroke={isGreen ? "#22c55e" : "#ef4444"}
                            strokeWidth="1"
                          />
                          <rect
                            x={x - candleWidth / 2}
                            y={bodyTop}
                            width={candleWidth}
                            height={Math.max(2, bodyHeight)}
                            fill={isGreen ? "#22c55e" : "#ef4444"}
                          />
                        </g>
                      );
                    })}
                  </>
                )}

                {/* Crosshair lines */}
                {hoveredIndex !== null && visibleData[hoveredIndex] && (
                  <>
                    {/* Vertical line */}
                    <line
                      x1={(hoveredIndex / Math.max(1, visibleData.length - 1)) * 1000}
                      y1="0"
                      x2={(hoveredIndex / Math.max(1, visibleData.length - 1)) * 1000}
                      y2="300"
                      stroke="#9ca3af"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Horizontal line */}
                    <line
                      x1="0"
                      y1={((maxPrice - visibleData[hoveredIndex].y) / priceRange) * 300}
                      x2="1000"
                      y2={((maxPrice - visibleData[hoveredIndex].y) / priceRange) * 300}
                      stroke="#9ca3af"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Tooltip */}
            {hoveredIndex !== null && visibleData[hoveredIndex] && (() => {
              const point = visibleData[hoveredIndex];
              return (
                <div 
                  className="absolute bg-[#1a237e] text-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none z-20"
                  style={{
                    left: mousePos.x > (priceChartRef.current?.clientWidth || 0) / 2 
                      ? `${mousePos.x - 170}px` 
                      : `${mousePos.x + 20}px`,
                    top: `${Math.min(mousePos.y, 220)}px`,
                  }}
                >
                  <div className="whitespace-nowrap">
                    <span className="text-gray-300">Date:</span>{' '}
                    {formatDisplayDate(point.time)}
                  </div>
                  {activeFilter === 'Today' && (
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">Time:</span>{' '}
                      {formatTime(point.time)}
                    </div>
                  )}

                  {chartType === 'candle' ? (
                    <>
                      <div className="whitespace-nowrap">
                        <span className="text-gray-300">open:</span>{' '}
                        {(point.open ?? point.y).toFixed(2)}
                      </div>
                      <div className="whitespace-nowrap">
                        <span className="text-gray-300">low:</span>{' '}
                        {(point.low ?? point.y).toFixed(2)}
                      </div>
                      <div className="whitespace-nowrap">
                        <span className="text-gray-300">high:</span>{' '}
                        {(point.high ?? point.y).toFixed(2)}
                      </div>
                      <div className="whitespace-nowrap">
                        <span className="text-gray-300">close:</span>{' '}
                        {(point.close ?? point.y).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">Price:</span>{' '}
                      {point.y.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Volume Chart */}
          <div 
            ref={volumeChartRef}
            className="relative bg-[#f5f5f5] border-t border-gray-300 cursor-crosshair"
            style={{ height: `${volumeChartHeight}px` }}
            onMouseMove={(e) => handleChartMouseMove(e, volumeChartRef)}
            onMouseLeave={handleChartMouseLeave}
          >
            {/* Y-axis labels for volume */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-2 text-xs text-gray-600">
              <span className="text-right pr-2">{maxVolume >= 1000 ? `${(maxVolume / 1000).toFixed(0)},000` : maxVolume.toFixed(0)}</span>
              <span className="text-right pr-2">{maxVolume >= 1000 ? `${(maxVolume / 2000).toFixed(0)},000` : (maxVolume / 2).toFixed(0)}</span>
              <span className="text-right pr-2">0</span>
            </div>

            {/* Volume bars */}
            <div className="absolute left-12 right-0 top-0 bottom-6">
              <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
                {visibleData.map((point, i) => {
                  const x = (i / Math.max(1, visibleData.length - 1)) * 1000;
                  const barWidth = Math.max(3, 800 / visibleData.length);
                  const barHeight = (point.volume / maxVolume) * 100;
                  const isHovered = hoveredIndex === i;
                  
                  return (
                    <rect
                      key={i}
                      x={x - barWidth / 2}
                      y={100 - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={isHovered ? "#1565c0" : "#2196F3"}
                    />
                  );
                })}
                
                {/* Crosshair vertical line on volume chart */}
                {hoveredIndex !== null && (
                  <line
                    x1={(hoveredIndex / Math.max(1, visibleData.length - 1)) * 1000}
                    y1="0"
                    x2={(hoveredIndex / Math.max(1, visibleData.length - 1)) * 1000}
                    y2="100"
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            </div>

            {/* Volume value indicator */}
            {hoveredIndex !== null && visibleData[hoveredIndex] && (
              <div 
                className="absolute bg-[#1a237e] text-white px-2 py-1 rounded text-xs pointer-events-none z-10"
                style={{
                  left: `${12 + (hoveredIndex / Math.max(1, visibleData.length - 1)) * (volumeChartRef.current?.clientWidth ? volumeChartRef.current.clientWidth - 48 : 0)}px`,
                  bottom: '28px',
                  transform: 'translateX(-50%)',
                }}
              >
                {visibleData[hoveredIndex].volume.toLocaleString()}
              </div>
            )}

            {/* Time axis labels */}
            <div className="absolute left-12 right-0 bottom-0 h-6 flex items-center justify-between px-2 text-xs text-gray-600">
              {timeLabels.map((label, i) => (
                <span key={i} style={{ position: 'absolute', left: `${label.position}%`, transform: 'translateX(-50%)' }}>
                  {label.time}
                </span>
              ))}
            </div>

            {/* Hovered time indicator */}
            {hoveredIndex !== null && visibleData[hoveredIndex] && (
              <div 
                className="absolute bg-[#1a237e] text-white px-2 py-1 rounded text-xs pointer-events-none z-10"
                style={{
                  left: `${12 + (hoveredIndex / Math.max(1, visibleData.length - 1)) * (volumeChartRef.current?.clientWidth ? volumeChartRef.current.clientWidth - 48 : 0)}px`,
                  bottom: '0px',
                  transform: 'translateX(-50%)',
                }}
              >
                {formatTime(visibleData[hoveredIndex].time)}
              </div>
            )}
          </div>

          {/* Mini-map Slider */}
          {chartData.length > 0 && (
            <div className="relative h-[60px] bg-gray-100 border-t border-gray-300">
              <div ref={sliderRef} className="relative h-full px-2 py-2">
                {/* Mini chart */}
                <svg width="100%" height="100%" viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 px-2 py-2">
                  <polyline
                    points={chartData
                      .map((point, i) => {
                        const x = (i / Math.max(1, chartData.length - 1)) * 1000;
                        const allMax = Math.max(...chartData.map(d => d.y));
                        const allMin = Math.min(...chartData.map(d => d.y));
                        const allRange = allMax - allMin || 1;
                        const y = 5 + (35 - ((point.y - allMin) / allRange) * 30);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                </svg>

                {/* Slider overlay */}
                <div className="absolute inset-x-2 top-2 bottom-2 flex items-stretch">
                  {/* Left gray area */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gray-400 opacity-40"
                    style={{ width: `${sliderPosition.start}%` }}
                  />
                  
                  {/* Selected area with handles */}
                  <div 
                    className="absolute top-0 bottom-0 border-2 border-blue-500 cursor-move bg-blue-500 bg-opacity-10"
                    style={{ 
                      left: `${sliderPosition.start}%`, 
                      width: `${sliderPosition.end - sliderPosition.start}%` 
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'middle')}
                  >
                    {/* Left handle */}
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-2 bg-blue-500 cursor-ew-resize hover:bg-blue-600"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'start');
                      }}
                    />
                    {/* Right handle */}
                    <div 
                      className="absolute top-0 bottom-0 right-0 w-2 bg-blue-500 cursor-ew-resize hover:bg-blue-600"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'end');
                      }}
                    />
                  </div>

                  {/* Right gray area */}
                  <div 
                    className="absolute top-0 bottom-0 right-0 bg-gray-400 opacity-40"
                    style={{ width: `${100 - sliderPosition.end}%` }}
                  />
                </div>

                {/* Time labels for slider */}
                <div className="absolute bottom-0 left-2 right-2 flex justify-between text-xs text-gray-500">
                  <span>{formatTime(chartData[0].time)}</span>
                  <span>{formatTime(chartData[Math.floor(chartData.length / 2)].time)}</span>
                  <span>{formatTime(chartData[chartData.length - 1].time)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
