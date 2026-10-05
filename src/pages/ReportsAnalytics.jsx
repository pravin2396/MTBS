import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KPIStatGrid from '../components/analytics/KPIStatGrid';
import RevenueAnalyticsChart from '../components/analytics/RevenueAnalyticsChart';
import DailyBookingTrendsChart from '../components/analytics/DailyBookingTrendsChart';
import MostBookedMovieCard from '../components/analytics/MostBookedMovieCard';
import MostPopularTheatreCard from '../components/analytics/MostPopularTheatreCard';
import SeatOccupancyCard from '../components/analytics/SeatOccupancyCard';
import {
  KPI_SUMMARY_METRICS,
  ANALYTICS_TIMEFRAMES,
} from '../data/mockAnalyticsData';
import {
  BarChart3,
  Calendar,
  Download,
  ArrowLeft,
  Film,
  TrendingUp,
  RefreshCw,
  Printer,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const RECENT_BOOKINGS_STORAGE_KEY = 'mtbs_recent_bookings';

const ReportsAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const [isExporting, setIsExporting] = useState(false);

  // Synchronize top KPI metrics with live localStorage records if available
  const metrics = useMemo(() => {
    let base = { ...KPI_SUMMARY_METRICS };
    try {
      const savedKpi = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedKpi) {
        const parsed = JSON.parse(savedKpi);
        if (parsed.totalBookings?.value) {
          const val = parsed.totalBookings.value;
          base.totalBookings = {
            ...base.totalBookings,
            value: val,
            formatted: val.toLocaleString(),
          };
        }
        if (parsed.todaysBookings?.value) {
          const tVal = parsed.todaysBookings.value;
          base.todaysBookings = {
            ...base.todaysBookings,
            value: tVal,
            formatted: tVal.toLocaleString(),
          };
        }
      }

      // Check recent bookings for total revenue boost
      const savedBookings = localStorage.getItem(RECENT_BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        const bookingsList = JSON.parse(savedBookings);
        if (Array.isArray(bookingsList) && bookingsList.length > 0) {
          const additionalRevenue = bookingsList.reduce((sum, b) => {
            const rawAmount = parseFloat(String(b.amount || '0').replace(/[^0-9.]/g, '')) || 0;
            return sum + rawAmount;
          }, 0);
          const newGross = Math.round(78450 + additionalRevenue);
          base.totalRevenue = {
            ...base.totalRevenue,
            value: newGross,
            formatted: `$${newGross.toLocaleString()}`,
          };
        }
      }
    } catch (err) {
      console.error('Error synchronizing analytics metrics:', err);
    }
    return base;
  }, []);

  // Export Analytics Report handler
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success('📊 CineTick-Analytics-Report.pdf generated and downloaded successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Top Quick Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-semibold text-rose-400">Reports & Analytics</span>
              <span>•</span>
              <span>Executive Business Intelligence</span>
            </div>
          </div>

          {/* Header Banner with Signature Film Reel Background */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-6 sm:p-8 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Executive Reports & Analytics</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Cinema <span className="text-rose-500">Analytics</span> & Insights
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                Comprehensive tracking of box office gross, daily booking velocity, multiplex screen utilization, seat occupancy rates, and title leaderboards.
              </p>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Timeframe Selector */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/90 border border-white/10 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-rose-400 ml-2" />
                  {ANALYTICS_TIMEFRAMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeframe(t.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        timeframe === t.id
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Export Report Button */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportReport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{isExporting ? 'Generating PDF...' : 'Export Analytics Report'}</span>
                </button>

                {/* Print Quick Summary */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-rose-400" />
                  <span>Print View</span>
                </button>
              </div>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* 1. Dashboard Statistics KPI Cards Grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span>Dashboard Statistics</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live Sync
                </span>
              </h2>
              <span className="text-xs text-gray-500">Updated just now</span>
            </div>

            <KPIStatGrid metrics={metrics} />
          </section>

          {/* 2. Dual Column: Revenue Charts (Left) & Daily Booking Trends (Right) */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RevenueAnalyticsChart />
            <DailyBookingTrendsChart />
          </section>

          {/* 3. Triple Column: Most Booked Movie & Most Popular Theatre & Seat Occupancy */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MostBookedMovieCard />
            <MostPopularTheatreCard />
            <SeatOccupancyCard />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
