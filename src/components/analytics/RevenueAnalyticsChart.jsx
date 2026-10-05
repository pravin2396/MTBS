import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Popcorn,
  Ticket,
  CreditCard,
  PieChart,
} from 'lucide-react';
import {
  REVENUE_CHART_DATA,
  PAYMENT_METHOD_DISTRIBUTION,
} from '../../data/mockAnalyticsData';

const RevenueAnalyticsChart = () => {
  const [period, setPeriod] = useState('weekly'); // 'weekly' | 'monthly' | 'quarterly'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const activeDataset = REVENUE_CHART_DATA[period];
  const maxTotal = Math.max(...activeDataset.map((d) => d.total));

  // Compute period totals
  const totalRevenuePeriod = activeDataset.reduce((sum, d) => sum + d.total, 0);
  const totalTicketsPeriod = activeDataset.reduce((sum, d) => sum + d.ticketSales, 0);
  const totalConcessionsPeriod = activeDataset.reduce((sum, d) => sum + d.concessions, 0);

  const activeItem =
    hoveredIndex !== null ? activeDataset[hoveredIndex] : activeDataset[activeDataset.length - 1];

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <DollarSign className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Revenue Analytics & Financial Trends
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Comparative dual-stream revenue tracking (Box Office Tickets vs F&B Concessions)
          </p>
        </div>

        {/* Period Selector Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/10 self-start sm:self-auto">
          {[
            { id: 'weekly', label: 'Last 7 Days' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'quarterly', label: 'Quarterly' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setPeriod(tab.id);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Period Gross Revenue
          </span>
          <p className="text-xl sm:text-2xl font-black text-white">
            ${totalRevenuePeriod.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+19.4% vs previous cycle</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Ticket className="h-3 w-3" />
            <span>Ticket Sales Revenue</span>
          </span>
          <p className="text-xl sm:text-2xl font-black text-rose-300">
            ${totalTicketsPeriod.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-400">
            {Math.round((totalTicketsPeriod / totalRevenuePeriod) * 100)}% of total gross
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Popcorn className="h-3 w-3" />
            <span>Concessions & F&B</span>
          </span>
          <p className="text-xl sm:text-2xl font-black text-amber-300">
            ${totalConcessionsPeriod.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-400">
            {Math.round((totalConcessionsPeriod / totalRevenuePeriod) * 100)}% of total gross
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold text-gray-300">
            {period === 'weekly'
              ? 'Daily Performance (Ticket vs Concession)'
              : period === 'monthly'
              ? 'Monthly Trajectory (May - Oct)'
              : 'Quarterly Financials (Q1 - Q4)'}
          </span>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
              <span>Ticket Sales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              <span>Concessions</span>
            </span>
          </div>
        </div>

        {/* Scaled Multi-Bar Chart */}
        <div className="h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-3 px-3 bg-slate-950 rounded-2xl border border-white/5 relative">
          {activeDataset.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const totalHeightPercent = Math.max(12, Math.round((item.total / maxTotal) * 100));
            const ticketRatio = item.ticketSales / item.total;
            const concessionRatio = item.concessions / item.total;

            return (
              <div
                key={item.period}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                {/* Floating Tooltip Pill */}
                <div
                  className={`text-[10px] font-bold mb-1.5 transition-all pointer-events-none ${
                    isHovered
                      ? 'text-rose-400 scale-110 font-black'
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  ${(item.total / 1000).toFixed(1)}k
                </div>

                {/* Stacked Compound Bar */}
                <div
                  className="w-full max-w-[48px] rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-300 group-hover:brightness-125 group-hover:shadow-lg group-hover:shadow-rose-600/20"
                  style={{ height: `${totalHeightPercent}%` }}
                >
                  {/* Ticket Sales Portion (Rose) */}
                  <div
                    className="w-full bg-gradient-to-t from-rose-700 to-rose-500 transition-all"
                    style={{ height: `${Math.round(ticketRatio * 100)}%` }}
                    title={`Tickets: $${item.ticketSales.toLocaleString()}`}
                  />
                  {/* Concession Portion (Amber) */}
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 border-b border-black/30 transition-all"
                    style={{ height: `${Math.round(concessionRatio * 100)}%` }}
                    title={`Concessions: $${item.concessions.toLocaleString()}`}
                  />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`text-[11px] font-semibold mt-2 transition-colors ${
                    isHovered ? 'text-white font-bold' : 'text-gray-400'
                  }`}
                >
                  {item.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & Payment Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-white/5">
        {/* Selected Period Inspector */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>Segment Details:</span>
              <span className="text-rose-400 font-extrabold">{activeItem.period}</span>
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Total: ${activeItem.total.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 block">Box Office</span>
              <span className="font-bold text-rose-300">
                ${activeItem.ticketSales.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 block">Concessions</span>
              <span className="font-bold text-amber-300">
                ${activeItem.concessions.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 block">Convenience Fees</span>
              <span className="font-bold text-gray-300">
                ${activeItem.fees.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Channels Distribution */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-rose-400" />
              <span>Payment Channel Share</span>
            </span>
            <span className="text-[10px] text-gray-400">Card vs UPI vs Wallet</span>
          </div>

          <div className="space-y-1.5">
            {PAYMENT_METHOD_DISTRIBUTION.map((item) => (
              <div key={item.method} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">{item.method}</span>
                  <span className="text-white font-mono font-bold">
                    {item.percentage}% ({item.revenue})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsChart;
