import React from 'react';
import {
  Ticket,
  DollarSign,
  TrendingUp,
  Percent,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const KPIStatGrid = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Total Bookings */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Total Bookings
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Ticket className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white mt-2 tracking-tight">
          {metrics.totalBookings.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>{metrics.totalBookings.change}</span>
          </span>
          <span className="text-gray-500 truncate">{metrics.totalBookings.subtext}</span>
        </div>
      </div>

      {/* 2. Total Revenue */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Total Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-emerald-400 mt-2 tracking-tight">
          {metrics.totalRevenue.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>{metrics.totalRevenue.change}</span>
          </span>
          <span className="text-gray-500 truncate">Gross Sales</span>
        </div>
      </div>

      {/* 3. Seat Occupancy Rate */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Seat Occupancy
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-cyan-300 mt-2 tracking-tight">
          {metrics.seatOccupancyRate.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>{metrics.seatOccupancyRate.change}</span>
          </span>
          <span className="text-gray-500 truncate">Cap. Filled</span>
        </div>
      </div>

      {/* 4. Avg Ticket Value */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Avg Ticket Value
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white mt-2 tracking-tight">
          {metrics.avgTicketPrice.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" />
            <span>{metrics.avgTicketPrice.change}</span>
          </span>
          <span className="text-gray-500 truncate">Per seat</span>
        </div>
      </div>

      {/* 5. Today's Bookings */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Today's Bookings
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-purple-300 mt-2 tracking-tight">
          {metrics.todaysBookings.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <span>+14%</span>
          </span>
          <span className="text-gray-500 truncate">vs yesterday</span>
        </div>
      </div>

      {/* 6. Cancellation Rate */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-xl group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Cancel Rate
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white mt-2 tracking-tight">
          {metrics.cancellationRate.formatted}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
            <span>{metrics.cancellationRate.change}</span>
          </span>
          <span className="text-gray-500 truncate">Low churn</span>
        </div>
      </div>
    </div>
  );
};

export default KPIStatGrid;
