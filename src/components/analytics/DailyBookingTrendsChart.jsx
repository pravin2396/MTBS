import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  Ticket,
} from 'lucide-react';
import {
  DAILY_BOOKING_TRENDS,
  HOURLY_BOOKING_CURVE,
} from '../../data/mockAnalyticsData';

const DailyBookingTrendsChart = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'hourly'
  const maxDailyBookings = Math.max(...DAILY_BOOKING_TRENDS.map((d) => d.ticketsSold));
  const maxHourlyCount = Math.max(...HOURLY_BOOKING_CURVE.map((h) => h.count));

  const totalWeekTickets = DAILY_BOOKING_TRENDS.reduce((sum, d) => sum + d.ticketsSold, 0);
  const totalWeekBookings = DAILY_BOOKING_TRENDS.reduce((sum, d) => sum + d.bookings, 0);

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
      {/* Top Header & Sub-selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Daily Booking Trends & Peak Demand
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Velocity of ticket transactions across weekday and weekend schedules
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Day-by-Day (7 Days)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hourly'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hourly Velocity Curve
          </button>
        </div>
      </div>

      {activeTab === 'daily' ? (
        /* DAY-BY-DAY CHART */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-semibold">Weekly Total:</span>
              <span className="text-white font-mono font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {totalWeekTickets.toLocaleString()} Tickets ({totalWeekBookings.toLocaleString()} Orders)
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                <span>Tickets Sold</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                <span>Orders</span>
              </span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-3 px-3 bg-slate-950 rounded-2xl border border-white/5">
            {DAILY_BOOKING_TRENDS.map((item) => {
              const ticketPercent = Math.max(15, Math.round((item.ticketsSold / maxDailyBookings) * 100));
              const bookingPercent = Math.max(10, Math.round((item.bookings / maxDailyBookings) * 100));
              const isWeekend = item.day === 'Sat' || item.day === 'Sun';

              return (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-bold text-gray-500 group-hover:text-rose-400 mb-1.5 transition-colors text-center">
                    {item.ticketsSold}
                  </div>

                  {/* Dual Bars for Tickets vs Bookings */}
                  <div className="flex items-end gap-1 w-full max-w-[42px] justify-center">
                    {/* Orders Bar */}
                    <div
                      className="w-1/2 bg-gradient-to-t from-purple-800 to-purple-500 rounded-t-md transition-all group-hover:brightness-125"
                      style={{ height: `${bookingPercent}%` }}
                      title={`Orders: ${item.bookings}`}
                    />
                    {/* Tickets Bar */}
                    <div
                      className={`w-1/2 rounded-t-md transition-all group-hover:brightness-125 ${
                        isWeekend
                          ? 'bg-gradient-to-t from-rose-700 to-rose-400 shadow-md shadow-rose-600/20'
                          : 'bg-gradient-to-t from-rose-800 to-rose-500'
                      }`}
                      style={{ height: `${ticketPercent}%` }}
                      title={`Tickets: ${item.ticketsSold}`}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-[11px] font-bold block ${
                        isWeekend ? 'text-rose-400 font-extrabold' : 'text-gray-300'
                      }`}
                    >
                      {item.day}
                    </span>
                    <span className="text-[9px] text-gray-500 block truncate">{item.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peak Slot Insights */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-gray-300">
                Peak Demand Window:{' '}
                <strong className="text-white">Saturday 05:30 PM & 08:45 PM Shows</strong> (1,540 tickets)
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Weekend Spike: +94% vs Weekday Avg
            </span>
          </div>
        </div>
      ) : (
        /* HOURLY VELOCITY CURVE */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-semibold text-gray-300">
              Customer Booking Activity Throughout the Day
            </span>
            <span className="text-rose-400 font-medium">Prime Peaks: 06 PM - 09 PM</span>
          </div>

          {/* Scaled Hourly Curve */}
          <div className="h-52 w-full flex items-end justify-between gap-2 sm:gap-3 pt-8 pb-3 px-3 bg-slate-950 rounded-2xl border border-white/5">
            {HOURLY_BOOKING_CURVE.map((h) => {
              const heightPercent = Math.max(12, Math.round((h.count / maxHourlyCount) * 100));

              return (
                <div
                  key={h.hour}
                  className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                >
                  <span
                    className={`text-[10px] font-bold mb-1.5 transition-colors ${
                      h.isPeak ? 'text-rose-400 font-extrabold' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    {h.count}
                  </span>

                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                      h.isPeak
                        ? 'bg-gradient-to-t from-rose-700 to-rose-400 shadow-lg shadow-rose-600/30'
                        : 'bg-gradient-to-t from-slate-800 to-slate-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${h.hour}: ${h.count} tickets/hr`}
                  />

                  <span
                    className={`text-[10px] font-semibold mt-2 ${
                      h.isPeak ? 'text-rose-300 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Morning (10 AM - 02 PM): Moderate traffic</span>
            <span className="text-rose-400 font-bold">Evening (06 PM - 10 PM): 71% of daily volume</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyBookingTrendsChart;
