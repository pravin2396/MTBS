import React from 'react';
import { Percent, Armchair, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { SEAT_OCCUPANCY_DATA } from '../../data/mockAnalyticsData';

const SeatOccupancyCard = () => {
  const { overallRate, targetRate, tierBreakdown, timeSlotBreakdown } = SEAT_OCCUPANCY_DATA;

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <Percent className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Seat Occupancy Rate
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Auditorium seat capacity utilization across price tiers and screening hours
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
          Target: {targetRate}%
        </span>
      </div>

      {/* Main Gauge & KPI Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-white/5 items-center">
        {/* Radial / Visual Progress Indicator */}
        <div className="flex flex-col items-center justify-center p-3 text-center sm:border-r border-white/5">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-rose-500"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * overallRate) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{overallRate}%</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                Capacity
              </span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+5.2% vs last month</span>
          </p>
        </div>

        {/* High Demand Tier highlight */}
        <div className="sm:col-span-2 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Seat Class Utilization
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Capacity vs Sold</span>
          </div>

          <div className="space-y-2">
            {tierBreakdown.map((t) => (
              <div key={t.tier} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-200 font-medium flex items-center gap-1.5">
                    <Armchair className="h-3.5 w-3.5 text-rose-400" />
                    <span>{t.tier}</span>
                    <span className="text-[10px] text-gray-500">({t.rows})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{t.price}/seat</span>
                    <span className="font-mono font-bold text-white">{t.rate}%</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${t.color}`}
                    style={{ width: `${t.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Showtime Slot Occupancy Rates */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>Occupancy by Showtime Window</span>
          <span>Fill Rate %</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {timeSlotBreakdown.map((slot) => {
            const isPrime = slot.rate > 85;

            return (
              <div
                key={slot.slot}
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                  isPrime
                    ? 'bg-rose-950/30 border-rose-500/40 shadow-sm'
                    : 'bg-slate-950/70 border-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                  <Clock className="h-3 w-3 text-rose-400" />
                  <span className="truncate">{slot.label}</span>
                </div>
                <p className="text-base font-black text-white">{slot.rate}%</p>
                <span className="text-[9px] text-gray-500 block truncate">
                  {slot.slot.split('(')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatOccupancyCard;
