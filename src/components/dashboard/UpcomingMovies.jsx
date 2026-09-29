import React from 'react';
import { Calendar, Bell, Star, Film, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const UpcomingMovies = ({ movies }) => {
  const handleNotify = (title) => {
    toast.success(`You will be notified as soon as tickets open for "${title}"! 🎟️`);
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-indigo-400">
          <Film className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Upcoming Movies
          </h2>
        </div>
        <span className="text-xs text-indigo-400 font-medium">Coming Soon to Theatres</span>
      </div>

      {/* Grid of Upcoming Movie Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-xl bg-slate-950/70 border border-white/10 overflow-hidden hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Poster Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-indigo-600/80 backdrop-blur-md text-[10px] font-bold text-white tracking-wide uppercase">
                {movie.status}
              </div>

              {/* Expected Rating */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{movie.ratingExpected}</span>
              </div>
            </div>

            {/* Info details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{movie.genre}</p>
                <p className="text-[11px] text-gray-500">Dir. {movie.director}</p>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="h-3 w-3 text-indigo-400" />
                    {movie.releaseDate}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {movie.theatresAllocated} screens
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNotify(movie.title)}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMovies;
