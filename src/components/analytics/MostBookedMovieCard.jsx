import React from 'react';
import { Film, Award, TrendingUp, Star, Ticket, Percent } from 'lucide-react';
import { MOST_BOOKED_MOVIES } from '../../data/mockAnalyticsData';

const MostBookedMovieCard = () => {
  const topMovie = MOST_BOOKED_MOVIES[0];
  const maxBookings = topMovie.bookingsCount;

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <Film className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Most Booked Movie
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Box office title performance & audience demand leaderboard
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>#1 Box Office Hit</span>
        </span>
      </div>

      {/* Hero Showcase for Top #1 Movie */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-950 border border-rose-500/20 relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Poster */}
        <div className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-lg border border-white/10 group-hover:scale-102 transition-transform">
          <img
            src={topMovie.poster}
            alt={topMovie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details & Metrics */}
        <div className="flex-1 space-y-2.5 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                {topMovie.genre}
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                {topMovie.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>{topMovie.rating}</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
            <div>
              <span className="text-[10px] text-gray-400 block">Total Bookings</span>
              <span className="font-extrabold text-white text-sm">
                {topMovie.bookingsCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Gross Revenue</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                {topMovie.revenue}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Seat Occupancy</span>
              <span className="font-extrabold text-rose-300 text-sm">
                {topMovie.occupancyRate}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span>Running on {topMovie.screenCount} Multiplex Screens</span>
            <span className="text-emerald-400 font-semibold">{topMovie.change} this week</span>
          </div>
        </div>
      </div>

      {/* Top 6 Movie Leaderboard */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>Top Titles Leaderboard</span>
          <span>Bookings & Share</span>
        </h4>

        <div className="space-y-2.5">
          {MOST_BOOKED_MOVIES.map((movie) => {
            const barWidthPercent = Math.round((movie.bookingsCount / maxBookings) * 100);

            return (
              <div
                key={movie.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-white/10 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        movie.rank === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : movie.rank === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                          : movie.rank === 3
                          ? 'bg-amber-800/20 text-amber-500 border border-amber-800/40'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {movie.rank}
                    </span>
                    <span className="font-bold text-white truncate max-w-[150px] sm:max-w-[200px]">
                      {movie.title}
                    </span>
                    <span className="text-[10px] text-gray-500 hidden sm:inline">
                      • {movie.genre.split('/')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {movie.occupancyRate}% Occ.
                    </span>
                    <span className="font-mono font-bold text-rose-300 text-xs">
                      {movie.bookingsCount.toLocaleString()} seats
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      movie.rank === 1
                        ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                        : 'bg-gradient-to-r from-rose-800 to-rose-600'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MostBookedMovieCard;
