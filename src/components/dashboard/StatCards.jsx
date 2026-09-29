import React from 'react';
import { Film, Building2, Ticket, CalendarClock, TrendingUp, Sparkles, ArrowUp } from 'lucide-react';

const StatCards = ({ stats, lastUpdatedKey }) => {
  const cards = [
    {
      key: 'totalMovies',
      title: 'Total Movies',
      value: stats.totalMovies.value,
      subtext: stats.totalMovies.subtext,
      badge: stats.totalMovies.change,
      icon: Film,
      color: 'from-rose-500/20 to-rose-600/10',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      accentGlow: 'group-hover:shadow-rose-500/10',
    },
    {
      key: 'totalTheatres',
      title: 'Total Theatres',
      value: stats.totalTheatres.value,
      subtext: stats.totalTheatres.subtext,
      badge: stats.totalTheatres.change,
      icon: Building2,
      color: 'from-indigo-500/20 to-indigo-600/10',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      accentGlow: 'group-hover:shadow-indigo-500/10',
    },
    {
      key: 'totalBookings',
      title: 'Total Bookings',
      value: stats.totalBookings.value,
      subtext: stats.totalBookings.subtext,
      badge: stats.totalBookings.change,
      icon: Ticket,
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      accentGlow: 'group-hover:shadow-amber-500/10',
    },
    {
      key: 'availableShows',
      title: 'Available Shows',
      value: stats.availableShows.value,
      subtext: stats.availableShows.subtext,
      badge: stats.availableShows.change,
      icon: CalendarClock,
      color: 'from-cyan-500/20 to-cyan-600/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      accentGlow: 'group-hover:shadow-cyan-500/10',
    },
    {
      key: 'todaysBookings',
      title: "Today's Bookings",
      value: stats.todaysBookings.value,
      subtext: stats.todaysBookings.subtext,
      badge: stats.todaysBookings.change,
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      accentGlow: 'group-hover:shadow-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isRecentlyUpdated = lastUpdatedKey === card.key;
        const formattedValue =
          typeof card.value === 'number'
            ? card.value.toLocaleString()
            : card.value;

        return (
          <div
            key={card.key}
            className={`group relative overflow-hidden rounded-2xl bg-slate-900/70 p-5 backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isRecentlyUpdated
                ? 'ring-2 ring-emerald-400 border-emerald-400/80 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                : `${card.borderColor} ${card.accentGlow}`
            }`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {card.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {formattedValue}
                  </h3>
                  {isRecentlyUpdated && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-black animate-bounce shadow">
                      <ArrowUp className="h-3 w-3" /> +1
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} ${card.iconColor} border border-white/5 shadow-inner`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Bottom row: Subtext & Badge */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 truncate max-w-[130px]" title={card.subtext}>
                {card.subtext}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isRecentlyUpdated
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : card.badge.includes('+')
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {isRecentlyUpdated ? 'Replicated' : card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
