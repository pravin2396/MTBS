import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMovieById } from '../services/movieApi';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Globe,
  Play,
  Ticket,
  Film,
  MapPin,
  User,
  AlertTriangle,
  Share2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const DEFAULT_POSTER_FALLBACK = 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg';

const MovieDetail = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(2);
  const [selectedHall, setSelectedHall] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Resilient image loading fallbacks
  const [posterError, setPosterError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadMovie = async () => {
      setIsLoading(true);
      setError(null);
      setPosterError(false);
      setBackdropError(false);

      try {
        const data = await getMovieById(id);
        if (isMounted) {
          setMovie(data);
          if (data.halls && data.halls.length > 0) {
            setSelectedHall(data.halls[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Movie not found or failed to load details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadMovie();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle direct ticket booking that replicates to KPI stats
  const handleBookTickets = () => {
    if (!movie) return;
    setIsBooking(true);

    try {
      // Replicate to KPI stats in localStorage
      const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        stats.totalBookings.value += ticketCount;
        stats.todaysBookings.value += ticketCount;
        stats.totalBookings.subtext = `+${ticketCount} for ${movie.title}`;
        stats.todaysBookings.subtext = `+${ticketCount} booked today`;
        localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
      }

      toast.success(
        `🎉 Successfully booked ${ticketCount} ticket(s) for "${movie.title}" in ${selectedHall || 'Cinema Hall'}!`
      );
    } catch (e) {
      console.error('Failed to update stats:', e);
      toast.success(`Booked ${ticketCount} ticket(s) for "${movie.title}"!`);
    } finally {
      setTimeout(() => {
        setIsBooking(false);
      }, 500);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Movie link copied to clipboard!');
    } else {
      toast.info(`Sharing "${movie?.title}"`);
    }
  };

  // Safe image sources with fallbacks
  const effectiveBackdrop = backdropError
    ? movie?.poster || DEFAULT_POSTER_FALLBACK
    : movie?.backdrop || movie?.poster || DEFAULT_POSTER_FALLBACK;

  const effectivePoster = posterError
    ? DEFAULT_POSTER_FALLBACK
    : movie?.poster || DEFAULT_POSTER_FALLBACK;

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Movies</span>
            </Link>

            {movie && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Share Movie"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 sm:p-12 space-y-6 animate-pulse">
              <div className="h-8 bg-slate-800 rounded w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-96 bg-slate-800 rounded-2xl" />
                <div className="md:col-span-2 space-y-4">
                  <div className="h-6 bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-800 rounded w-1/4" />
                  <div className="space-y-2 pt-4">
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-5/6" />
                    <div className="h-4 bg-slate-800 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="rounded-3xl bg-rose-950/20 border border-rose-500/30 p-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Movie Not Found</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">{error}</p>
              <div className="pt-2">
                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Movies Catalog</span>
                </Link>
              </div>
            </div>
          )}

          {/* Detailed Movie View */}
          {!isLoading && !error && movie && (
            <div className="space-y-8">
              {/* Cinematic Hero Section with Optimized Ambient Backdrop & Framed Poster */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 min-h-[380px] sm:min-h-[440px] flex items-end">
                {/* Backdrop Image - Full bleed with multi-angle gradient overlays */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={effectiveBackdrop}
                    alt={`${movie.title} Backdrop`}
                    onError={() => setBackdropError(true)}
                    className="w-full h-full object-cover object-center filter brightness-[0.75] transition-opacity duration-500"
                  />
                  {/* Subtle darkening and gradient feathering for maximum text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent" />
                </div>

                {/* Foreground Hero Content */}
                <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-end">
                  {/* Optimized Poster Card with 2:3 aspect ratio */}
                  <div className="w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-slate-950 group">
                    <img
                      src={effectivePoster}
                      alt={movie.title}
                      onError={() => setPosterError(true)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title, Genres & Quick Metadata */}
                  <div className="flex-1 space-y-3.5 text-center md:text-left">
                    {/* Genre Tags & Language */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      {Array.isArray(movie.genre) &&
                        movie.genre.map((g, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold backdrop-blur-sm"
                          >
                            {g}
                          </span>
                        ))}
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-sm">
                        <Globe className="h-3 w-3 text-rose-400" />
                        {movie.language}
                      </span>
                    </div>

                    {/* Movie Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                      {movie.title}
                    </h1>

                    {/* Tagline */}
                    {movie.tagline && (
                      <p className="text-sm sm:text-base italic text-gray-300 font-light max-w-2xl">
                        "{movie.tagline}"
                      </p>
                    )}

                    {/* Metadata Stats Row */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-gray-300 pt-1">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{movie.rating}</span>
                        {movie.votes && (
                          <span className="text-xs text-gray-400 font-normal">
                            ({movie.votes} votes)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-rose-400" />
                        <span>{movie.duration}</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Calendar className="h-4 w-4 text-rose-400" />
                        <span>{movie.releaseDate}</span>
                      </div>
                    </div>

                    {/* Trailer Button (Strictly UI-Only) */}
                    <div className="pt-2 flex justify-center md:justify-start">
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`🎬 Trailer preview for "${movie.title}" (UI Feature Only)`)
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm border border-rose-500/40 shadow-lg shadow-rose-950/50 hover:shadow-rose-600/30 transition-all cursor-pointer backdrop-blur-sm"
                        title="Trailer (UI Only)"
                      >
                        <Play className="h-4 w-4 fill-current text-white" />
                        <span>Watch Official Trailer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Plot & Cast Details on Left, Booking Box on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left (2 cols): Synopsis & Cast */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Storyline / Synopsis */}
                  <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-3 shadow-lg">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Film className="h-4 w-4 text-rose-500" />
                      <span>Plot Synopsis</span>
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {movie.description}
                    </p>
                  </div>

                  {/* Cast & Director Section */}
                  <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-5 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <User className="h-4 w-4 text-rose-500" />
                        <span>Cast & Crew</span>
                      </h2>

                      {movie.director && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 uppercase tracking-wider font-semibold">
                            Director:
                          </span>
                          <span className="text-white font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                            {movie.director}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rich Cast Cards */}
                    {movie.cast && movie.cast.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block">
                          Starring:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {movie.cast.map((actor, idx) => {
                            const isObj = typeof actor === 'object' && actor !== null;
                            const name = isObj ? actor.name : String(actor);
                            const character = isObj ? actor.character : '';
                            const initials = name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase();

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-white/[0.07] transition-all"
                              >
                                {/* Actor Initials Avatar Badge */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600/30 to-purple-600/30 border border-white/15 flex items-center justify-center text-xs font-bold text-rose-300 shrink-0 shadow-inner">
                                  {initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                                    {name}
                                  </p>
                                  {character && (
                                    <p className="text-[11px] text-gray-400 truncate">
                                      as <span className="text-gray-300 font-medium">{character}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right (1 col): Ticket Booking Box */}
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 space-y-5 shadow-xl">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-rose-500" />
                        <span>Reserve Tickets</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Select hall and ticket count to replicate directly.
                      </p>
                    </div>

                    {/* Hall Selection */}
                    {movie.halls && movie.halls.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-rose-400" />
                          Auditorium Hall
                        </label>
                        <select
                          value={selectedHall}
                          onChange={(e) => setSelectedHall(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer"
                        >
                          {movie.halls.map((hall, idx) => (
                            <option key={idx} value={hall}>
                              {hall}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Ticket Count Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Quantity of Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTicketCount(num)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              ticketCount === num
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                                : 'bg-slate-950 border border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price summary */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Price per ticket</span>
                        <span className="text-white font-semibold">{movie.price || '$18.00'}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Total Quantity</span>
                        <span className="text-white font-semibold">{ticketCount} seat(s)</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                        <span className="text-white">Estimated Total</span>
                        <span className="text-rose-400">
                          $
                          {(
                            ticketCount *
                            parseFloat((movie.price || '$18.00').replace(/[^0-9.]/g, '') || 18)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      type="button"
                      disabled={isBooking}
                      onClick={handleBookTickets}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Ticket className="h-4 w-4" />
                      <span>{isBooking ? 'Processing Reservation...' : 'Confirm Ticket Reservation'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MovieDetail;
