import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TicketDetailsModal from '../components/history/TicketDetailsModal';
import ViewETicketModal from '../components/history/ViewETicketModal';
import CancelBookingModal from '../components/history/CancelBookingModal';
import {
  loadAllStoredBookings,
  cancelBookingInStorage,
} from '../data/mockBookingHistoryData';
import {
  History,
  Search,
  Filter,
  Calendar,
  Film,
  Building2,
  Clock,
  Ticket,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Ban,
  ArrowLeft,
  Sparkles,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookingHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All'); // 'All' | 'Today' | 'Upcoming' | 'Past'
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // 'All' | 'Confirmed' | 'Completed' | 'Cancelled'

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  // Load bookings on mount and whenever window refocuses
  useEffect(() => {
    const list = loadAllStoredBookings();
    setBookings(list);
  }, []);

  // Copy Booking Reference ID
  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.info(`Reference ID ${id} copied!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Distinct list of unique movies from all bookings
  const uniqueMoviesList = useMemo(() => {
    const names = new Set(bookings.map((b) => b.movie).filter(Boolean));
    return ['All', ...Array.from(names).sort()];
  }, [bookings]);

  // Status counters
  const statusCounters = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status?.toLowerCase() === 'confirmed').length;
    const completed = bookings.filter((b) => b.status?.toLowerCase() === 'completed').length;
    const cancelled = bookings.filter((b) => b.status?.toLowerCase() === 'cancelled').length;
    return { total, confirmed, completed, cancelled };
  }, [bookings]);

  // Filtered Bookings calculation
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // 1. Search Query (ID, Movie, Theatre, Customer, Seats)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const idMatch = booking.id?.toLowerCase().includes(q);
        const movieMatch = booking.movie?.toLowerCase().includes(q);
        const theatreMatch = booking.theatre?.toLowerCase().includes(q);
        const customerMatch = booking.customerName?.toLowerCase().includes(q);
        const seatMatch = Array.isArray(booking.seats)
          ? booking.seats.some((s) => s.toLowerCase().includes(q))
          : false;

        if (!idMatch && !movieMatch && !theatreMatch && !customerMatch && !seatMatch) {
          return false;
        }
      }

      // 2. Filter by Movie
      if (selectedMovie !== 'All' && booking.movie !== selectedMovie) {
        return false;
      }

      // 3. Filter by Booking Date Category
      if (selectedDateFilter !== 'All') {
        const cat = booking.dateCategory || 'Today';
        if (selectedDateFilter === 'Today') {
          const isToday =
            cat === 'Today' ||
            booking.showDate?.toLowerCase().includes('today') ||
            booking.bookingDate?.toLowerCase().includes('today');
          if (!isToday) return false;
        } else if (selectedDateFilter === 'Upcoming') {
          const isUpcoming =
            cat === 'Upcoming' ||
            booking.showDate?.toLowerCase().includes('tomorrow') ||
            booking.bookingDate?.toLowerCase().includes('tomorrow');
          if (!isUpcoming) return false;
        } else if (selectedDateFilter === 'Past') {
          const isPast =
            cat === 'Past' ||
            booking.bookingTimestamp?.toLowerCase().includes('ago') ||
            booking.bookingTimestamp?.toLowerCase().includes('sep') ||
            booking.bookingTimestamp?.toLowerCase().includes('aug');
          if (!isPast) return false;
        }
      }

      // 4. Filter by Booking Status
      if (selectedStatusFilter !== 'All') {
        if (booking.status?.toLowerCase() !== selectedStatusFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, searchQuery, selectedMovie, selectedDateFilter, selectedStatusFilter]);

  // Handle Cancel Booking confirmation
  const handleConfirmCancellation = (bookingId, reason) => {
    const updatedList = cancelBookingInStorage(bookingId, reason);
    setBookings(updatedList);
    toast.success(`✅ Booking ${bookingId} has been successfully cancelled. Full refund initiated.`);
  };

  // Helper for Status Badge
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="h-3 w-3" />
            <span>{status || 'Pending'}</span>
          </span>
        );
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMovie('All');
    setSelectedDateFilter('All');
    setSelectedStatusFilter('All');
    toast.info('All search and filter criteria have been reset.');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedMovie !== 'All' ||
    selectedDateFilter !== 'All' ||
    selectedStatusFilter !== 'All';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content View with desktop offset for sidebar */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Top Quick Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-semibold text-rose-400">Booking History</span>
              <span>•</span>
              <span>All Reservations</span>
            </div>
          </div>

          {/* Header Banner with Signature Film Reel Background */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-6 sm:p-8 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <History className="h-3.5 w-3.5" />
                <span>Ticket Management & History</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Booking <span className="text-rose-500">History</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                Review your reservations, inspect itemized ticket details, download official cinema passes, or manage instant cancellations with refund processing.
              </p>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* Quick Status KPI Summary Counters */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div
              onClick={() => setSelectedStatusFilter('All')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedStatusFilter === 'All'
                  ? 'bg-slate-900 border-rose-500/50 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Total Bookings</span>
                <Ticket className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-white mt-2">{statusCounters.total}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">All recorded passes</p>
            </div>

            <div
              onClick={() => setSelectedStatusFilter('Confirmed')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedStatusFilter === 'Confirmed'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Active / Confirmed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-300 mt-2">{statusCounters.confirmed}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Ready for auditorium entry</p>
            </div>

            <div
              onClick={() => setSelectedStatusFilter('Completed')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedStatusFilter === 'Completed'
                  ? 'bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-950/30'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">Completed / Attended</span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-blue-300 mt-2">{statusCounters.completed}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Past cinema screenings</p>
            </div>

            <div
              onClick={() => setSelectedStatusFilter('Cancelled')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedStatusFilter === 'Cancelled'
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">Cancelled / Refunded</span>
                <XCircle className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-rose-300 mt-2">{statusCounters.cancelled}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Seats released back</p>
            </div>
          </section>

          {/* Filter & Search Control Panel */}
          <section className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Search Bookings Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, movie, theatre, seats..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* 2. Filter by Movie */}
              <div className="relative">
                <Film className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400 pointer-events-none" />
                <select
                  value={selectedMovie}
                  onChange={(e) => setSelectedMovie(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer appearance-none transition-colors"
                >
                  <option value="All">All Movies ({uniqueMoviesList.length - 1})</option>
                  {uniqueMoviesList.slice(1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* 3. Filter by Booking Date */}
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400 pointer-events-none" />
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer appearance-none transition-colors"
                >
                  <option value="All">All Booking Dates</option>
                  <option value="Today">Today (Live Screenings)</option>
                  <option value="Upcoming">Upcoming Shows</option>
                  <option value="Past">Past Shows</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* 4. Filter by Booking Status */}
              <div className="relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400 pointer-events-none" />
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer appearance-none transition-colors"
                >
                  <option value="All">All Booking Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters Bar & Reset Action */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Filtered by:</span>
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">
                      "{searchQuery}"
                    </span>
                  )}
                  {selectedMovie !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 border border-rose-500/30">
                      Movie: {selectedMovie}
                    </span>
                  )}
                  {selectedDateFilter !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-200">
                      Date: {selectedDateFilter}
                    </span>
                  )}
                  {selectedStatusFilter !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-200">
                      Status: {selectedStatusFilter}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </section>

          {/* Booking History List / Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Bookings Archive</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">
                  {filteredBookings.length} of {bookings.length}
                </span>
              </h2>

              <Link
                to="/booking"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Book New Tickets &rarr;</span>
              </Link>
            </div>

            {filteredBookings.length === 0 ? (
              /* Empty Search / Filter State */
              <div className="py-16 px-4 rounded-3xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
                  <Ticket className="h-7 w-7 opacity-60" />
                </div>
                <h3 className="text-base font-bold text-white">No Matching Bookings Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  We couldn't find any tickets matching your search query or selected filters. Try broadening your filter parameters.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            ) : (
              /* Table View for Medium & Large Screens, Card Stack for Mobile */
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden shadow-2xl">
                {/* Desktop & Tablet Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/80 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                        <th className="py-4 px-4 sm:px-6">Booking Pass / Movie</th>
                        <th className="py-4 px-4">Cinema & Screen</th>
                        <th className="py-4 px-4">Date & Time</th>
                        <th className="py-4 px-4">Seats</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.map((b) => {
                        const isConfirmed = b.status?.toLowerCase() === 'confirmed';
                        const isCancelled = b.status?.toLowerCase() === 'cancelled';

                        return (
                          <tr
                            key={b.id}
                            className="hover:bg-white/[0.02] transition-colors group"
                          >
                            {/* Booking ID & Movie */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-11 aspect-[2/3] rounded-lg overflow-hidden bg-slate-800 shrink-0 shadow-sm border border-white/5">
                                  <img
                                    src={b.poster}
                                    alt={b.movie}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                                    }}
                                  />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-rose-300 text-[11px]">
                                      {b.id}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyId(b.id)}
                                      className="p-0.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                                      title="Copy ID"
                                    >
                                      {copiedId === b.id ? (
                                        <Check className="h-3 w-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                  <h3 className="font-bold text-white text-xs truncate max-w-[180px]">
                                    {b.movie}
                                  </h3>
                                  <span className="text-[10px] text-gray-500 block truncate">
                                    {b.bookingTimestamp}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Cinema & Screen */}
                            <td className="py-4 px-4">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-gray-200 truncate max-w-[180px]">
                                  {b.theatre}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
                                  {b.screen || 'Audi 1 • Dolby Cinema'}
                                </p>
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-white">{b.showDate}</p>
                                <p className="text-[11px] text-rose-400 font-medium">
                                  {b.showtime}
                                </p>
                              </div>
                            </td>

                            {/* Seats */}
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-1 max-w-[140px]">
                                  {b.seats?.slice(0, 3).map((seat, idx) => (
                                    <span
                                      key={idx}
                                      className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono font-bold"
                                    >
                                      {seat}
                                    </span>
                                  ))}
                                  {b.seats?.length > 3 && (
                                    <span className="text-[10px] text-gray-500 self-center">
                                      +{b.seats.length - 3} more
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-500 block">
                                  {b.seatCount} Seat{b.seatCount > 1 ? 's' : ''}
                                </span>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="font-extrabold text-white text-xs">
                                  {b.amount}
                                </span>
                                <span className="text-[10px] text-gray-500 block truncate max-w-[120px]">
                                  {b.paymentMethod}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {renderStatusBadge(b.status)}
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1. View Details Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveBooking(b);
                                    setDetailsModalOpen(true);
                                  }}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                                  title="View Ticket Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                {/* 2. View E-Ticket Pass Button */}
                                {!isCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveBooking(b);
                                      setTicketModalOpen(true);
                                    }}
                                    className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
                                    title="View E-Ticket & QR"
                                  >
                                    <Ticket className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                {/* 3. Cancel Booking Button (UI) */}
                                {isConfirmed ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveBooking(b);
                                      setCancelModalOpen(true);
                                    }}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 transition-colors cursor-pointer"
                                    title="Cancel Booking"
                                  >
                                    <Ban className="h-3.5 w-3.5" />
                                  </button>
                                ) : (
                                  <span
                                    className="p-2 opacity-30 text-gray-600 cursor-not-allowed"
                                    title={
                                      isCancelled
                                        ? 'Already Cancelled'
                                        : 'Screening Completed'
                                    }
                                  >
                                    <Ban className="h-3.5 w-3.5" />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* 1. Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={detailsModalOpen}
        booking={activeBooking}
        onClose={() => setDetailsModalOpen(false)}
        onViewETicket={(b) => {
          setActiveBooking(b);
          setTicketModalOpen(true);
        }}
      />

      {/* 2. View E-Ticket Modal */}
      <ViewETicketModal
        isOpen={ticketModalOpen}
        booking={activeBooking}
        onClose={() => setTicketModalOpen(false)}
      />

      {/* 3. Cancel Booking Confirmation Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        booking={activeBooking}
        onClose={() => setCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancellation}
      />
    </div>
  );
};

export default BookingHistory;
