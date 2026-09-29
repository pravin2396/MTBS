import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Globe, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  // Format release date nicely
  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Coming Soon';

  const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

  const posterImage = imgError
    ? 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    : movie.poster;

  const handleTrailerClick = () => {
    toast.info(`🎬 Trailer preview for "${movie.title}" (UI Feature Only)`);
  };

  return (
    <article className="group rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/20 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden">
      {/* Left Thumbnail (authentic 2:3 vertical poster, uncropped) */}
      <div className="relative w-full sm:w-44 md:w-48 h-56 sm:h-auto aspect-[2/3] shrink-0 overflow-hidden bg-slate-950">
        <img
          src={posterImage}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-amber-400 text-[11px] font-bold flex items-center gap-1 shadow-md">
          <Star className="h-3 w-3 fill-current" />
          <span>{movie.rating}</span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md">
          <Globe className="h-2.5 w-2.5 text-rose-400" />
          <span>{movie.language}</span>
        </div>
      </div>

      {/* Right Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/movies/${movie.id}`} className="block group-hover:text-rose-400 transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                {movie.title}
              </h3>
            </Link>
          </div>

          {/* Duration & Release Date */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-rose-400" />
              <span>{movie.duration}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-rose-400" />
              <span>{formattedDate}</span>
            </span>
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[10px] font-medium"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Description (Prominently displayed) */}
          <p className="text-xs text-gray-300 line-clamp-2 sm:line-clamp-3 leading-relaxed pt-0.5">
            {movie.description}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
          {/* Trailer Button (UI Only) */}
          <button
            type="button"
            onClick={handleTrailerClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-rose-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Trailer (UI Only)"
          >
            <Play className="h-3 w-3 fill-current text-rose-400" />
            <span>Trailer</span>
          </button>

          <Link
            to={`/movies/${movie.id}`}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all cursor-pointer group/btn"
          >
            <span>Details</span>
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
