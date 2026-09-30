import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Tv,
  Film,
  Star,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const DEFAULT_THEATRE_IMAGE = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const TheatreCard = ({ theatre }) => {
  const [imgError, setImgError] = useState(false);

  const handleTimingClick = (show, timing) => {
    try {
      // Replicate to KPI stats in localStorage
      const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        stats.totalBookings.value += 1;
        stats.todaysBookings.value += 1;
        stats.totalBookings.subtext = `+1 for ${show.movieTitle}`;
        stats.todaysBookings.subtext = `+1 at ${theatre.name}`;
        localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
      }

      toast.success(
        `🎟️ Reserved 1 ticket for "${show.movieTitle}" (${timing}) at ${theatre.name}!`
      );
    } catch (e) {
      console.error(e);
      toast.info(`Selected ${timing} show for "${show.movieTitle}" at ${theatre.name}`);
    }
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${theatre.name}, ${theatre.address}, ${theatre.city}`
  )}`;

  return (
    <article className="group rounded-2xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/20 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Banner & Image */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={imgError ? DEFAULT_THEATRE_IMAGE : theatre.image}
          alt={theatre.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-amber-400 text-xs font-bold flex items-center gap-1 shadow-md">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{theatre.rating}</span>
          <span className="text-[10px] text-gray-400 font-normal">({theatre.reviewsCount})</span>
        </div>

        {/* City & Screen Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-1 shadow-md">
            <MapPin className="h-3 w-3 text-rose-400" />
            {theatre.city}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 text-white text-xs font-bold flex items-center gap-1 shadow-md">
            <Tv className="h-3 w-3" />
            {theatre.totalScreens} Screens
          </span>
        </div>

        {/* Floating Theatre Name */}
        <div className="absolute bottom-3 left-4 right-4">
          <Link
            to={`/theatres/${theatre.id}`}
            className="block text-lg sm:text-xl font-bold text-white group-hover:text-rose-400 transition-colors drop-shadow-md truncate"
          >
            {theatre.name}
          </Link>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Address and Contact Information */}
        <div className="space-y-2.5 text-xs text-gray-300">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed text-gray-300">
              {theatre.address}, {theatre.city} - {theatre.pincode}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <a
              href={`tel:${theatre.contact.phone}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{theatre.contact.phone}</span>
            </a>
            <a
              href={`mailto:${theatre.contact.email}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{theatre.contact.email}</span>
            </a>
          </div>
        </div>

        {/* Available Shows Section */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-rose-400" />
              Available Shows Today ({theatre.shows?.length || 0})
            </span>
            <span className="text-[10px] text-gray-400">Click time to reserve</span>
          </div>

          {/* Show List */}
          <div className="space-y-2">
            {theatre.shows && theatre.shows.slice(0, 2).map((show) => (
              <div
                key={show.id}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {show.movieTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 text-[10px] font-semibold">
                    {show.format}
                  </span>
                </div>

                {/* Show Timings Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {show.timings.map((time, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTimingClick(show, time)}
                      className="px-2 py-1 rounded-lg bg-slate-950 border border-white/10 hover:border-rose-500 hover:bg-rose-600/20 text-[11px] text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      title="Quick Book This Show"
                    >
                      <Clock className="h-2.5 w-2.5 text-rose-400" />
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Chips */}
        {theatre.amenities && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {theatre.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] border border-white/5"
              >
                {amenity}
              </span>
            ))}
            {theatre.amenities.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px]">
                +{theatre.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <Link
            to={`/theatres/${theatre.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition-all cursor-pointer group"
          >
            <span>View All Shows</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Open Location in Google Maps"
          >
            <ExternalLink className="h-4 w-4 text-rose-400" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default TheatreCard;
