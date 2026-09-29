import React from 'react';
import { CalendarClock, MapPin, Ticket, Flame } from 'lucide-react';

const AvailableShows = ({ shows, onBookTicket }) => {
  const handleSelectShow = (show) => {
    if (onBookTicket) {
      onBookTicket(show);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400">
          <CalendarClock className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Available Shows Today
          </h2>
        </div>
        <span className="text-xs text-cyan-400 font-medium">Live Seat Occupancy</span>
      </div>

      {/* Grid of shows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shows.map((show) => {
          const bookedSeats = show.totalSeats - show.availableSeats;
          const occupancy = Math.round((bookedSeats / show.totalSeats) * 100);
          const isAlmostFull = show.availableSeats <= 15;

          return (
            <div
              key={show.id}
              className="rounded-xl bg-slate-950/70 border border-white/10 p-4 space-y-3 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {show.format}
                  </span>
                  <span className="text-xs font-black text-rose-400">{show.price}</span>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {show.movie}
                </h3>

                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{show.theatre}</span>
                </p>
              </div>

              {/* Occupancy Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 font-semibold">{show.time}</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isAlmostFull ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isAlmostFull && <Flame className="h-3 w-3" />}
                    {show.availableSeats} seats left
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${occupancy}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancy > 80
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Book button */}
              <button
                type="button"
                onClick={() => handleSelectShow(show)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Book Tickets</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableShows;
