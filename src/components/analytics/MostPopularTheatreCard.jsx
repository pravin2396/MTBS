import React, { useState, useMemo } from 'react';
import { Building2, Award, MapPin, Users, Ticket, TrendingUp } from 'lucide-react';
import { MOST_POPULAR_THEATRES } from '../../data/mockAnalyticsData';

const MostPopularTheatreCard = () => {
  const [selectedCity, setSelectedCity] = useState('All');
  const topTheatre = MOST_POPULAR_THEATRES[0];

  const uniqueCities = useMemo(() => {
    return ['All', ...new Set(MOST_POPULAR_THEATRES.map((t) => t.city))];
  }, []);

  const filteredTheatres = useMemo(() => {
    if (selectedCity === 'All') return MOST_POPULAR_THEATRES;
    return MOST_POPULAR_THEATRES.filter((t) => t.city === selectedCity);
  }, [selectedCity]);

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
      {/* Header & City Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <Building2 className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Most Popular Theatre
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Cinema footfall, screen utilization, and venue gross revenue
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/10 self-start sm:self-auto">
          {uniqueCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Showcase for Top #1 Theatre */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-rose-500/20 space-y-4 relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>#1 Ranked Venue</span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>{topTheatre.city}</span>
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {topTheatre.name}
            </h3>
            <p className="text-xs text-rose-400 font-medium">
              {topTheatre.screenType} • {topTheatre.totalScreens} Screens
            </p>
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
              Venue Gross Revenue
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {topTheatre.revenue}
            </span>
          </div>
        </div>

        {/* 3 Metric Chips */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 block">Total Tickets Booked</span>
            <span className="font-extrabold text-white text-sm">
              {topTheatre.bookingsCount.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 block">Seat Occupancy</span>
            <span className="font-extrabold text-rose-300 text-sm">
              {topTheatre.occupancyRate}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 block">Footfall Estimated</span>
            <span className="font-extrabold text-cyan-300 text-sm">
              {topTheatre.footfall}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
          <span>Best Selling Show: <strong className="text-white">{topTheatre.bestSellingShow}</strong></span>
          <span className="text-emerald-400 font-semibold">+18.5% YoY growth</span>
        </div>
      </div>

      {/* Popular Theatres Table */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>Cinema Locations Ranking</span>
          <span>Footfall & Occupancy</span>
        </h4>

        <div className="space-y-2">
          {filteredTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    theatre.rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : theatre.rank === 2
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {theatre.rank}
                </span>

                <div className="min-w-0">
                  <h5 className="font-bold text-white truncate max-w-[200px] sm:max-w-[240px]">
                    {theatre.name}
                  </h5>
                  <p className="text-[11px] text-gray-400 truncate">
                    {theatre.city} • {theatre.screenType} ({theatre.totalScreens} screens)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="font-mono font-bold text-rose-300 block">
                    {theatre.bookingsCount.toLocaleString()} bookings
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {theatre.revenue}
                  </span>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-right font-mono">
                  <span className="font-bold text-white block">{theatre.occupancyRate}%</span>
                  <span className="text-[9px] text-gray-400 uppercase">Occupancy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostPopularTheatreCard;
