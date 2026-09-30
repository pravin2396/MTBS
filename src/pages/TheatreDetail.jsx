import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getTheatreById } from '../services/theatreApi';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Headphones,
  Star,
  Tv,
  Film,
  Clock,
  Ticket,
  ExternalLink,
  Share2,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const DEFAULT_THEATRE_IMAGE = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=85';

const TheatreDetail = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theatre, setTheatre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Selected booking state
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [isBooking, setIsBooking] = useState(false);

  // Show switching & date switching states
  const [activeShowTab, setActiveShowTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');

  useEffect(() => {
    let isMounted = true;
    const loadTheatre = async () => {
      setIsLoading(true);
      setError(null);
      setImgError(false);

      try {
        const data = await getTheatreById(id);
        if (isMounted) {
          setTheatre(data);
          if (data.shows && data.shows.length > 0) {
            setSelectedShow(data.shows[0]);
            setSelectedTime(data.shows[0].timings[0] || '');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Theatre not found or failed to load.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTheatre();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShowSelect = (show, time) => {
    setSelectedShow(show);
    setSelectedTime(time);
  };

  // Switch between shows by tab selection
  const handleSelectShowTab = (tabId) => {
    setActiveShowTab(tabId);
    if (tabId !== 'all') {
      const target = theatre?.shows?.find((s) => s.id === tabId);
      if (target) {
        setSelectedShow(target);
        setSelectedTime(target.timings[0] || '');
      }
    }
  };

  // Cycle to previous show
  const handlePrevShow = () => {
    if (!theatre?.shows || theatre.shows.length === 0) return;
    const currentId = activeShowTab === 'all' ? selectedShow?.id : activeShowTab;
    const currentIndex = theatre.shows.findIndex((s) => s.id === currentId);
    const prevIndex = currentIndex <= 0 ? theatre.shows.length - 1 : currentIndex - 1;
    const prevShow = theatre.shows[prevIndex];
    setSelectedShow(prevShow);
    setSelectedTime(prevShow.timings[0] || '');
    if (activeShowTab !== 'all') {
      setActiveShowTab(prevShow.id);
    }
  };

  // Cycle to next show
  const handleNextShow = () => {
    if (!theatre?.shows || theatre.shows.length === 0) return;
    const currentId = activeShowTab === 'all' ? selectedShow?.id : activeShowTab;
    const currentIndex = theatre.shows.findIndex((s) => s.id === currentId);
    const nextIndex = currentIndex >= theatre.shows.length - 1 ? 0 : currentIndex + 1;
    const nextShow = theatre.shows[nextIndex];
    setSelectedShow(nextShow);
    setSelectedTime(nextShow.timings[0] || '');
    if (activeShowTab !== 'all') {
      setActiveShowTab(nextShow.id);
    }
  };

  const handleBookTickets = () => {
    if (!theatre || !selectedShow) return;
    setIsBooking(true);

    try {
      // Replicate to KPI stats in localStorage
      const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        stats.totalBookings.value += ticketQuantity;
        stats.todaysBookings.value += ticketQuantity;
        stats.totalBookings.subtext = `+${ticketQuantity} for ${selectedShow.movieTitle}`;
        stats.todaysBookings.subtext = `+${ticketQuantity} at ${theatre.name}`;
        localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
      }

      toast.success(
        `🎉 Successfully reserved ${ticketQuantity} ticket(s) for "${selectedShow.movieTitle}" (${selectedTime}) at ${theatre.name}!`
      );
    } catch (e) {
      console.error(e);
      toast.success(`Booked ${ticketQuantity} ticket(s) for "${selectedShow.movieTitle}"!`);
    } finally {
      setTimeout(() => {
        setIsBooking(false);
      }, 500);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Theatre link copied to clipboard!');
    } else {
      toast.info(`Sharing "${theatre?.name}"`);
    }
  };

  const mapUrl = theatre
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${theatre.name}, ${theatre.address}, ${theatre.city}`
      )}`
    : '#';

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
              to="/theatres"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Theatres</span>
            </Link>

            {theatre && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Share Theatre"
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
              <div className="h-64 bg-slate-800 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-slate-800 rounded-2xl" />
                <div className="h-40 bg-slate-800 rounded-2xl" />
                <div className="h-40 bg-slate-800 rounded-2xl" />
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="rounded-3xl bg-rose-950/20 border border-rose-500/30 p-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Theatre Not Found</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">{error}</p>
              <div className="pt-2">
                <Link
                  to="/theatres"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Theatres List</span>
                </Link>
              </div>
            </div>
          )}

          {/* Detailed Theatre View */}
          {!isLoading && !error && theatre && (
            <div className="space-y-8">
              {/* Hero Banner Section with Optimized Ambient Background & Aligned Layout */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 min-h-[380px] sm:min-h-[420px] md:min-h-[440px] flex items-center">
                {/* Background Image Layer - Perfectly Aligned & Scaled */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={imgError ? DEFAULT_THEATRE_IMAGE : theatre.image}
                    alt={theatre.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-[center_35%] transform scale-105 filter brightness-[0.55] contrast-[1.08] transition-all duration-700"
                  />
                  {/* Subtle directional gradients for high contrast readability and visual depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent" />
                </div>

                {/* Hero Foreground Content - Perfectly Balanced & Aligned */}
                <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between">
                  {/* Left Content Area */}
                  <div className="flex-1 space-y-4 max-w-2xl">
                    {/* Floating Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <MapPin className="h-3 w-3" />
                        {theatre.city}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border border-white/10 shadow-sm">
                        <Tv className="h-3 w-3 text-rose-400" />
                        {theatre.totalScreens} Auditoriums
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md flex items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        {theatre.rating} ({theatre.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Theatre Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                      {theatre.name}
                    </h1>

                    {/* Address with Map Pin */}
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
                        <span>{theatre.address}, {theatre.city} - {theatre.pincode}</span>
                      </p>
                    </div>

                    {/* Amenities List */}
                    {theatre.amenities && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {theatre.amenities.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-gray-200 text-xs border border-white/10 flex items-center gap-1.5 shadow-sm"
                          >
                            <Sparkles className="h-2.5 w-2.5 text-rose-400" />
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Directions CTA */}
                    <div className="pt-2 flex items-center gap-3">
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs border border-rose-500/30 shadow-lg shadow-rose-950/50 backdrop-blur-sm transition-all cursor-pointer group"
                      >
                        <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        <span>Get Directions on Google Maps</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Showcase Card - High Definition Framed Theatre Card */}
                  <div className="hidden lg:block w-80 lg:w-96 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-slate-950 relative group">
                    <img
                      src={imgError ? DEFAULT_THEATRE_IMAGE : theatre.image}
                      alt={`${theatre.name} Showcase`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-semibold">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-[11px]">
                        <MapPin className="h-3 w-3 text-rose-400" />
                        {theatre.city}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-amber-400 text-[11px] font-bold">
                        <Star className="h-3 w-3 fill-current" />
                        {theatre.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Grid: Shows & Screens on Left, Contact & Reservation on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Available Shows & Screens */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Available Shows & Timings */}
                  <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-5 shadow-xl">
                    {/* Top Row: Title, Subtitle & Prev/Next Quick Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Film className="h-5 w-5 text-rose-500" />
                          <span>Available Shows & Timings Today</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          Switch between shows, select your preferred auditorium, and reserve seats.
                        </p>
                      </div>

                      {/* Previous / Next Show Quick Switcher */}
                      {theatre.shows && theatre.shows.length > 1 && (
                        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950/80 border border-white/10 rounded-xl p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={handlePrevShow}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Previous Show"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="px-2 text-[11px] font-semibold text-gray-300">
                            {activeShowTab === 'all'
                              ? `${theatre.shows.length} Shows`
                              : `Show ${(theatre.shows.findIndex((s) => s.id === activeShowTab) + 1 || 1)} of ${theatre.shows.length}`}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextShow}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Next Show"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Date Selector Row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0 pl-0.5">
                        <Calendar className="h-3.5 w-3.5 text-rose-400" />
                        Schedule:
                      </span>
                      {[
                        { id: 'today', label: 'Today (Live)' },
                        { id: 'tomorrow', label: 'Tomorrow' },
                        { id: 'weekend', label: 'Weekend Special' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedDate(d.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                            selectedDate === d.id
                              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                              : 'bg-slate-950/60 text-gray-400 border border-white/5 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {/* Movie / Show Switcher Tabs */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-gray-300">
                          <Layers className="h-3 w-3 text-rose-400" />
                          Switch Between Shows:
                        </span>
                        {activeShowTab !== 'all' && (
                          <button
                            type="button"
                            onClick={() => handleSelectShowTab('all')}
                            className="text-rose-400 hover:text-rose-300 font-semibold text-xs cursor-pointer"
                          >
                            View All ({theatre.shows?.length || 0})
                          </button>
                        )}
                      </div>

                      {/* Interactive Horizontal Switcher Tabs */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                          type="button"
                          onClick={() => handleSelectShowTab('all')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeShowTab === 'all'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                              : 'bg-slate-950 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Film className="h-3 w-3" />
                          <span>All Shows ({theatre.shows?.length || 0})</span>
                        </button>

                        {theatre.shows && theatre.shows.map((show) => {
                          const isActive = activeShowTab === show.id;
                          return (
                            <button
                              key={show.id}
                              type="button"
                              onClick={() => handleSelectShowTab(show.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                                isActive
                                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30 border border-rose-400/50'
                                  : 'bg-slate-950 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <img
                                src={show.moviePoster}
                                alt={show.movieTitle}
                                className="w-4 h-5 rounded object-cover"
                              />
                              <span className="truncate max-w-[140px]">{show.movieTitle}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/5 text-rose-300 border border-white/5'
                                }`}
                              >
                                {show.format}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Show Spotlight Banner when switched to a single show */}
                    {activeShowTab !== 'all' && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-rose-600/10 border border-rose-500/20 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-gray-300">
                            Switched to: <strong className="text-white">{selectedShow?.movieTitle}</strong> in{' '}
                            <strong className="text-rose-400">{selectedShow?.screen}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectShowTab('all')}
                          className="text-rose-300 hover:text-white font-semibold underline underline-offset-2 cursor-pointer"
                        >
                          Show All Movies
                        </button>
                      </div>
                    )}

                    {/* Shows List (Filtered by switcher or All) */}
                    <div className="space-y-4">
                      {theatre.shows &&
                        (activeShowTab === 'all'
                          ? theatre.shows
                          : theatre.shows.filter((s) => s.id === activeShowTab)
                        ).map((show) => (
                          <div
                            key={show.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              selectedShow?.id === show.id
                                ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                              {/* Poster thumbnail */}
                              <img
                                src={show.moviePoster}
                                alt={show.movieTitle}
                                className="w-16 sm:w-20 aspect-[2/3] rounded-xl object-cover border border-white/10 shrink-0"
                              />

                              {/* Details & Showtimings */}
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <Link
                                    to={`/movies/${show.movieId}`}
                                    className="text-base font-bold text-white hover:text-rose-400 transition-colors"
                                  >
                                    {show.movieTitle}
                                  </Link>
                                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30">
                                    {show.format}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                    <Star className="h-3 w-3 fill-current" />
                                    {show.rating}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-rose-400" />
                                    {show.duration}
                                  </span>
                                  <span>•</span>
                                  <span className="text-gray-300 font-medium">{show.screen}</span>
                                  <span>•</span>
                                  <span className="text-rose-300 font-bold">{show.price}</span>
                                </div>

                                {/* Show Timings */}
                                <div className="pt-2">
                                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                                    Select Showtime:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {show.timings.map((time, idx) => {
                                      const isSelected = selectedShow?.id === show.id && selectedTime === time;
                                      return (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => handleShowSelect(show, time)}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                            isSelected
                                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 border border-rose-400'
                                              : 'bg-slate-950 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                                          }`}
                                        >
                                          <Clock className="h-3 w-3 text-rose-400" />
                                          <span>{time}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Available Screens Breakdown */}
                  <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <Tv className="h-4 w-4 text-rose-500" />
                          <span>Available Screens & Auditoriums</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          High-resolution projection systems and spatial audio specifications.
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        Total: <strong className="text-white">{theatre.screens?.length || theatre.totalScreens}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {theatre.screens && theatre.screens.map((screen) => (
                        <div
                          key={screen.id}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {screen.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 text-[10px] font-semibold">
                              {screen.type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                            <span>Capacity: <strong className="text-gray-200">{screen.capacity} Seats</strong></span>
                            <span className="truncate max-w-[140px] text-gray-300">{screen.soundSystem}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 1 Column: Contact Info & Reservation Box */}
                <div className="space-y-6">
                  {/* Reservation Action Box */}
                  <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 space-y-5 shadow-xl">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-rose-500" />
                        <span>Reserve Tickets</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        
                     </p>
                  </div>

                    {/* Selected Summary */}
                    {selectedShow && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Movie:</span>
                          <span className="text-white font-bold truncate max-w-[150px]">{selectedShow.movieTitle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Showtime:</span>
                          <span className="text-rose-400 font-semibold">{selectedTime || 'Select time'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Auditorium:</span>
                          <span className="text-gray-300 truncate max-w-[150px]">{selectedShow.screen}</span>
                        </div>
                      </div>
                    )}

                    {/* Ticket Quantity Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Quantity of Seats
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTicketQuantity(num)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              ticketQuantity === num
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                                : 'bg-slate-950 border border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Calculation */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Price per ticket</span>
                        <span className="text-white font-semibold">
                          {selectedShow?.price || '$18.00'}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Total Seats</span>
                        <span className="text-white font-semibold">{ticketQuantity}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                        <span className="text-white">Estimated Total</span>
                        <span className="text-rose-400">
                          $
                          {(
                            ticketQuantity *
                            parseFloat((selectedShow?.price || '$18.00').replace(/[^0-9.]/g, '') || 18)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Booking Button */}
                    <button
                      type="button"
                      disabled={isBooking || !selectedShow || !selectedTime}
                      onClick={handleBookTickets}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Ticket className="h-4 w-4" />
                      <span>{isBooking ? 'Processing Reservation...' : 'Confirm Ticket Reservation'}</span>
                    </button>
                  </div>

                  {/* Contact Information Card */}
                  <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-4 shadow-xl">
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Phone className="h-4 w-4 text-rose-500" />
                        <span>Contact Information</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Helplines, manager desk, and customer support.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Phone */}
                      <a
                        href={`tel:${theatre.contact.phone}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                          <Phone className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Direct Desk</p>
                          <p className="font-semibold text-white truncate">{theatre.contact.phone}</p>
                        </div>
                      </a>

                      {/* Helpline */}
                      <a
                        href={`tel:${theatre.contact.helpline}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                          <Headphones className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Toll-Free Helpline</p>
                          <p className="font-semibold text-white truncate">{theatre.contact.helpline}</p>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${theatre.contact.email}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Support Email</p>
                          <p className="font-semibold text-white truncate">{theatre.contact.email}</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Safety & Compliance Badge */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-gray-400">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                    <p className="leading-tight">
                      Verified multiplex partner. 100% digital ticketing & contactless auditorium entry.
                    </p>
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

export default TheatreDetail;
