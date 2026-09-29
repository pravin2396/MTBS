import React, { useState } from 'react';
import { DollarSign, TrendingUp, Popcorn, Ticket, ArrowUpRight } from 'lucide-react';

const RevenueSummary = ({ revenueData }) => {
  const [activeDay, setActiveDay] = useState('Sun');
  const maxTotal = Math.max(...revenueData.weeklyData.map((d) => d.total));

  const selectedDayData =
    revenueData.weeklyData.find((d) => d.day === activeDay) ||
    revenueData.weeklyData[revenueData.weeklyData.length - 1];

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <DollarSign className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Revenue Summary
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time financial performance across ticket counter & concession stands
          </p>
        </div>

        {/* Revenue Key Metrics Pill Row */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+19.8% this week</span>
          </span>
        </div>
      </div>

      {/* Top 4 KPI mini cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-black text-white">{revenueData.totalRevenue}</p>
          <span className="text-[10px] text-emerald-400 font-medium">All time</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Today's Revenue</p>
          <p className="text-xl sm:text-2xl font-black text-rose-400">{revenueData.todaysRevenue}</p>
          <span className="text-[10px] text-emerald-400 font-medium">+12% vs avg</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Concessions</p>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{revenueData.concessionsRevenue}</p>
          <span className="text-[10px] text-gray-400 font-medium">Snacks & Drinks</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Avg Ticket</p>
          <p className="text-xl sm:text-2xl font-black text-cyan-400">{revenueData.avgTicketPrice}</p>
          <span className="text-[10px] text-gray-400 font-medium">Per customer</span>
        </div>
      </div>

      {/* Weekly Revenue Visualizer Chart */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300">Weekly Revenue Breakdown </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
              Ticket Sales
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              Concessions
            </span>
          </div>
        </div>

        {/* CSS/Tailwind Scaled Bar Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 bg-slate-950/60 rounded-xl border border-white/5">
          {revenueData.weeklyData.map((item) => {
            const isSelected = item.day === activeDay;
            const totalHeightPercent = Math.round((item.total / maxTotal) * 100);
            const ticketRatio = item.tickets / item.total;
            const concessionRatio = item.concessions / item.total;

            return (
              <div
                key={item.day}
                onClick={() => setActiveDay(item.day)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                {/* Tooltip on hover/active */}
                <div
                  className={`text-[10px] font-bold mb-1 transition-all ${
                    isSelected
                      ? 'text-rose-400 scale-110 font-extrabold'
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  ${(item.total / 1000).toFixed(1)}k
                </div>

                {/* Stacked Bar */}
                <div
                  className={`w-full max-w-[36px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-white/60 shadow-lg shadow-rose-500/20'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ height: `${totalHeightPercent}%` }}
                >
                  <div
                    style={{ height: `${concessionRatio * 100}%` }}
                    className="w-full bg-amber-400 transition-all"
                    title={`Concessions: $${item.concessions}`}
                  />
                  <div
                    style={{ height: `${ticketRatio * 100}%` }}
                    className="w-full bg-rose-500 transition-all"
                    title={`Tickets: $${item.tickets}`}
                  />
                </div>

                {/* Day Label */}
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Day Details */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
          <span className="text-gray-400">
            Selected Day: <strong className="text-white">{selectedDayData.day}</strong>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-rose-400">
              Tickets: <strong>${selectedDayData.tickets.toLocaleString()}</strong>
            </span>
            <span className="text-amber-400">
              Concessions: <strong>${selectedDayData.concessions.toLocaleString()}</strong>
            </span>
            <span className="text-emerald-400 font-bold">
              Total: ${selectedDayData.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;
