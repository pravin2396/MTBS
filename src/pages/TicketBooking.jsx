import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScreenCurvature from '../components/seats/ScreenCurvature';
import SeatLegend from '../components/seats/SeatLegend';
import SeatItem from '../components/seats/SeatItem';
import BookingSuccessModal from '../components/seats/BookingSuccessModal';
import { MOCK_MOVIES } from '../data/mockMoviesData';
import { MOCK_THEATRES } from '../data/mockTheatresData';
import {
  generateAuditoriumLayout,
  MAX_SEATS_LIMIT,
  SEAT_TIERS,
  CONVENIENCE_FEE_PER_TICKET,
  TAX_PERCENTAGE,
  checkDuplicateBooking,
  recordBookedSeatsForShow,
  generateUniqueBookingId,
} from '../data/mockSeatsData';
import {
  Film,
  Building2,
  Clock,
  Calendar,
  Ticket,
  CheckCircle2,
  ArrowLeft,
  Search,
  MapPin,
  Star,
  X,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const RECENT_BOOKINGS_KEY = 'mtbs_recent_bookings';

const AVAILABLE_TIMES = [
  { time: '10:30 AM', screen: 'Audi 1 • Dolby 7.1', tag: 'Morning' },
  { time: '02:00 PM', screen: 'Audi 2 • IMAX Laser', tag: 'Matinee' },
  { time: '05:30 PM', screen: 'Audi 1 • Dolby Atmos', tag: 'Evening' },
  { time: '08:45 PM', screen: 'Audi 3 • 4DX Experience', tag: 'Prime' },
  { time: '11:15 PM', screen: 'Audi 2 • Night Special', tag: 'Late Night' },
];

const AVAILABLE_DATES = [
  { id: 'Today', label: 'Today (Live)' },
  { id: 'Tomorrow', label: 'Tomorrow' },
  { id: 'Weekend', label: 'Weekend Special' },
];

const TicketBooking = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active step in the ticket booking workflow (1: Movie, 2: Theatre, 3: Showtime, 4: Seats)
  const [activeStep, setActiveStep] = useState(1);

  // Search & Filter state
  const [movieSearch, setMovieSearch] = useState('');
  const [theatreCityFilter, setTheatreCityFilter] = useState('All');

  // Selected Entities
  const paramMovieId = searchParams.get('movieId');
  const paramTheatreId = searchParams.get('theatreId');
  const paramTime = searchParams.get('time');
  const paramDate = searchParams.get('date');

  const [selectedMovieId, setSelectedMovieId] = useState(
    paramMovieId || MOCK_MOVIES[0]?.id || '1'
  );
  const [selectedTheatreId, setSelectedTheatreId] = useState(
    paramTheatreId || MOCK_THEATRES[0]?.id || 'th-1'
  );
  const [selectedDate, setSelectedDate] = useState(paramDate || 'Today');
  const [selectedTime, setSelectedTime] = useState(paramTime || '05:30 PM');

  // Active movie and theatre models
  const selectedMovie = useMemo(
    () => MOCK_MOVIES.find((m) => String(m.id) === String(selectedMovieId)) || MOCK_MOVIES[0],
    [selectedMovieId]
  );

  const selectedTheatre = useMemo(
    () => MOCK_THEATRES.find((t) => String(t.id) === String(selectedTheatreId)) || MOCK_THEATRES[0],
    [selectedTheatreId]
  );

  // Show unique seed key for seat layout & duplicate prevention
  const showKey = useMemo(() => {
    return `${selectedMovieId}-${selectedTheatreId}-${selectedDate}-${selectedTime}`.replace(/\s+/g, '_');
  }, [selectedMovieId, selectedTheatreId, selectedDate, selectedTime]);

  // Seat layout & selection initialized synchronously
  const [seatGrid, setSeatGrid] = useState(() =>
    generateAuditoriumLayout(
      `${paramMovieId || MOCK_MOVIES[0]?.id || '1'}-${paramTheatreId || MOCK_THEATRES[0]?.id || 'th-1'}-${paramDate || 'Today'}-${paramTime || '05:30 PM'}`.replace(/\s+/g, '_')
    )
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Confirmation Modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Load / Refresh auditorium layout when show parameters change
  useEffect(() => {
    const layout = generateAuditoriumLayout(showKey);
    setSeatGrid(layout);
    setSelectedSeats([]); // Reset selected seats on show context switch
  }, [showKey]);

  // Handle seat click
  const handleToggleSeat = (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      // 1. Enforce Maximum 6 seats selection limit
      if (selectedSeats.length >= MAX_SEATS_LIMIT) {
        toast.warn(
          `⚠️ Selection limit reached: You can select a maximum of ${MAX_SEATS_LIMIT} seats per booking.`
        );
        return;
      }

      // 2. Prevent selecting an already booked seat (Duplicate Booking Prevention)
      const { isDuplicate } = checkDuplicateBooking(showKey, [seat.id]);
      if (isDuplicate || seat.status === 'booked') {
        toast.error(
          `❌ Duplicate Booking Prevented: Seat ${seat.row}${seat.col} is already booked for this show.`
        );
        return;
      }

      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  // Remove seat tag
  const handleDeselectSeat = (seat) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
  };

  // Clear selections
  const handleClearAll = () => {
    setSelectedSeats([]);
    toast.info('Seat selections cleared.');
  };

  // Pricing calculations
  const seatSubtotal = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const convenienceFee = useMemo(() => {
    return selectedSeats.length * CONVENIENCE_FEE_PER_TICKET;
  }, [selectedSeats.length]);

  const taxAmount = useMemo(() => {
    return (seatSubtotal + convenienceFee) * TAX_PERCENTAGE;
  }, [seatSubtotal, convenienceFee]);

  const totalAmount = useMemo(() => {
    return seatSubtotal + convenienceFee + taxAmount;
  }, [seatSubtotal, convenienceFee, taxAmount]);

  // Group seats by tier for summary breakdown
  const tierSummary = useMemo(() => {
    const counts = { VIP: 0, PREMIUM: 0, STANDARD: 0 };
    selectedSeats.forEach((s) => {
      if (counts[s.tier] !== undefined) counts[s.tier]++;
    });
    return counts;
  }, [selectedSeats]);

  // Final Booking Confirmation with Duplicate Booking Prevention
  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      toast.warn('Please select at least 1 seat to proceed with ticket booking.');
      return;
    }

    setIsProcessing(true);

    const selectedSeatIds = selectedSeats.map((s) => s.id);

    // 1. Prevent Duplicate Booking Check
    const { isDuplicate, conflictSeats } = checkDuplicateBooking(showKey, selectedSeatIds);
    if (isDuplicate) {
      setIsProcessing(false);
      toast.error(
        `❌ Duplicate Booking Blocked: Seat(s) ${conflictSeats.join(', ')} were already booked by another user. Please pick different seats.`
      );
      // Refresh seat layout to mark conflict seats as booked
      setSeatGrid(generateAuditoriumLayout(showKey));
      setSelectedSeats((prev) => prev.filter((s) => !conflictSeats.includes(s.id)));
      return;
    }

    // 2. Generate Unique Booking ID
    const bookingId = generateUniqueBookingId();
    const count = selectedSeats.length;
    const seatNames = selectedSeats.map((s) => `${s.row}${s.col}`);

    try {
      // 3. Persist booked seats for this show to prevent future duplicate booking
      recordBookedSeatsForShow(showKey, selectedSeatIds);

      // 4. Update KPI stats in localStorage for live dashboard replication
      const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        stats.totalBookings.value += count;
        stats.todaysBookings.value += count;
        stats.totalBookings.subtext = `+${count} for ${selectedMovie.title}`;
        stats.todaysBookings.subtext = `+${count} at ${selectedTheatre.name}`;
        localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
      }

      // 5. Prepend new booking record to Recent Bookings list
      const newBookingRecord = {
        id: bookingId,
        customerName: user?.name || 'Walk-in Guest',
        customerEmail: user?.email || 'guest@cinetick.com',
        movie: selectedMovie.title,
        theatre: `${selectedTheatre.name} • Audi 1`,
        showtime: `${selectedDate}, ${selectedTime}`,
        seats: seatNames,
        seatCount: count,
        amount: `$${totalAmount.toFixed(2)}`,
        paymentMethod: 'Instant Booking Pass',
        status: 'Confirmed',
        date: 'Just now',
      };

      const savedBookings = localStorage.getItem(RECENT_BOOKINGS_KEY);
      const existingList = savedBookings ? JSON.parse(savedBookings) : [];
      localStorage.setItem(
        RECENT_BOOKINGS_KEY,
        JSON.stringify([newBookingRecord, ...existingList])
      );

      // 6. Set confirmation modal payload
      setConfirmedBookingData({
        id: bookingId,
        movie: selectedMovie.title,
        theatre: selectedTheatre.name,
        showtime: `${selectedDate}, ${selectedTime}`,
        seats: seatNames,
        seatCount: count,
        amount: `$${totalAmount.toFixed(2)}`,
      });

      // 7. Update local seat grid status to booked
      setSeatGrid((prev) =>
        prev.map((s) =>
          selectedSeatIds.includes(s.id) ? { ...s, status: 'booked' } : s
        )
      );

      setSelectedSeats([]);
      setSuccessModalOpen(true);
      toast.success(`🎉 Booking Confirmed! Reference ID: ${bookingId}`);
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered movies & theatres
  const filteredMovies = useMemo(() => {
    const q = (movieSearch || '').trim().toLowerCase();
    if (!q) return MOCK_MOVIES;
    return MOCK_MOVIES.filter((m) => {
      const titleMatch = m.title?.toLowerCase().includes(q);
      const genreMatch = Array.isArray(m.genre)
        ? m.genre.some((g) => g?.toLowerCase().includes(q))
        : typeof m.genre === 'string' && m.genre.toLowerCase().includes(q);
      return Boolean(titleMatch || genreMatch);
    });
  }, [movieSearch]);

  const filteredTheatres = useMemo(() => {
    if (theatreCityFilter === 'All') return MOCK_THEATRES;
    return MOCK_THEATRES.filter((t) => t.city?.toLowerCase() === theatreCityFilter.toLowerCase());
  }, [theatreCityFilter]);

  const uniqueCities = useMemo(() => {
    return ['All', ...new Set(MOCK_THEATRES.map((t) => t.city).filter(Boolean))];
  }, []);

  // Group seats by row for structured rendering
  const rowsList = useMemo(() => {
    const rows = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    return rows.map((rowLetter) => ({
      letter: rowLetter,
      tier: SEAT_TIERS.VIP.rows.includes(rowLetter)
        ? 'VIP'
        : SEAT_TIERS.PREMIUM.rows.includes(rowLetter)
        ? 'PREMIUM'
        : 'STANDARD',
      seats: seatGrid.filter((s) => s.row === rowLetter),
    }));
  }, [seatGrid]);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
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
              <span className="font-semibold text-rose-400">Ticket Booking</span>
              <span>•</span>
              <span>Instant Pass</span>
            </div>
          </div>

          {/* Header Banner with Signature Film Reel Background */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <Ticket className="h-3.5 w-3.5" />
                <span>Ticket Booking & Seat Reservation</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Book Your <span className="text-rose-500">Tickets</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Seamlessly select your preferred movie, multiplex theatre, showtime, and auditorium seats with live price calculation and duplicate booking prevention.
              </p>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* Booking Progress Step Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              { step: 1, label: '1. Select Movie', desc: selectedMovie.title },
              { step: 2, label: '2. Select Theatre', desc: selectedTheatre.name },
              { step: 3, label: '3. Select Show Time', desc: `${selectedDate} • ${selectedTime}` },
              { step: 4, label: '4. Select Seats', desc: `${selectedSeats.length} seat(s) chosen` },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeStep === s.step
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      activeStep === s.step ? 'text-rose-400' : 'text-gray-300'
                    }`}
                  >
                    {s.label}
                  </span>
                  {activeStep === s.step && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 truncate mt-1">{s.desc}</p>
              </button>
            ))}
          </div>

          {/* Main 2-Column Booking Layout: Step Controls (Left 2 cols) & Booking Summary (Right 1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Multi-step interactive flow */}
            <div className="lg:col-span-2 space-y-6">
              {/* STEP 1: SELECT MOVIE */}
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Select Movie</span>
                        <span className="text-xs text-rose-400 font-normal">
                          ({selectedMovie.title})
                        </span>
                      </h2>
                      <p className="text-[11px] text-gray-400">
                        Choose the movie you want to experience on the big screen.
                      </p>
                    </div>
                  </div>

                  {/* Search Movie Input */}
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={movieSearch}
                      onChange={(e) => setMovieSearch(e.target.value)}
                      placeholder="Search movie..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>

                {/* Movie Cards Carousel / Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
                  {filteredMovies.map((movie) => {
                    const isSelected = String(movie.id) === String(selectedMovieId);
                    return (
                      <div
                        key={movie.id}
                        onClick={() => {
                          setSelectedMovieId(movie.id);
                          if (activeStep === 1) setActiveStep(2);
                        }}
                        className={`group relative rounded-2xl overflow-hidden border p-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                            : 'bg-slate-950/80 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* Poster */}
                        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 relative">
                          <img
                            src={movie.poster || movie.image}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-md">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-amber-400 font-bold">
                            <Star className="h-3 w-3 fill-amber-400" />
                            <span>{movie.rating || '8.8'}</span>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="pt-2 text-left space-y-0.5">
                          <h3 className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                            {movie.title}
                          </h3>
                          <p className="text-[10px] text-gray-400 truncate">
                            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'Action'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: SELECT THEATRE */}
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Select Theatre</span>
                        <span className="text-xs text-rose-400 font-normal">
                          ({selectedTheatre.name})
                        </span>
                      </h2>
                      <p className="text-[11px] text-gray-400">
                        Pick your favorite cinema venue and premium auditorium.
                      </p>
                    </div>
                  </div>

                  {/* Filter by City */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {uniqueCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setTheatreCityFilter(city)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                          theatreCityFilter === city
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-950 border border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theatres List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                  {filteredTheatres.map((theatre) => {
                    const isSelected = String(theatre.id) === String(selectedTheatreId);
                    return (
                      <div
                        key={theatre.id}
                        onClick={() => {
                          setSelectedTheatreId(theatre.id);
                          if (activeStep === 2) setActiveStep(3);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500'
                            : 'bg-slate-950/80 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{theatre.name}</span>
                          </h4>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500 shrink-0" />
                            <span className="truncate">{theatre.city} • {theatre.address}</span>
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-[10px]">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium">
                              {theatre.totalScreens || (Array.isArray(theatre.screens) ? theatre.screens.length : 6)} Screens
                            </span>
                            <span className="text-emerald-400 font-semibold">IMAX Laser Available</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: SELECT SHOW TIME & DATE */}
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Select Show Time</span>
                      <span className="text-xs text-rose-400 font-normal">
                        ({selectedDate}, {selectedTime})
                      </span>
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Choose day schedule and preferred showtime slot.
                    </p>
                  </div>
                </div>

                {/* Date Selection Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-rose-400" />
                    <span>Select Date</span>
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {AVAILABLE_DATES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDate(d.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedDate === d.id
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                            : 'bg-slate-950 border border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-rose-400" />
                    <span>Available Showtimes Today</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {AVAILABLE_TIMES.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot.time);
                            if (activeStep === 3) setActiveStep(4);
                          }}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 ring-1 ring-rose-400'
                              : 'bg-slate-950 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <span className="block text-xs font-bold tracking-tight">{slot.time}</span>
                          <span
                            className={`block text-[10px] mt-0.5 truncate ${
                              isSelected ? 'text-rose-100' : 'text-gray-400'
                            }`}
                          >
                            {slot.screen}
                          </span>
                          <span
                            className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {slot.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP 4: SELECT SEATS (INTERACTIVE AUDITORIUM LAYOUT) */}
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
                      4
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Select Seats</span>
                        <span className="text-xs text-rose-400 font-normal">
                          ({selectedSeats.length} / {MAX_SEATS_LIMIT} seats)
                        </span>
                      </h2>
                      <p className="text-[11px] text-gray-400">
                        Interactive seating grid with real-time duplicate booking prevention.
                      </p>
                    </div>
                  </div>

                  {selectedSeats.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {/* Legend Bar */}
                <SeatLegend />

                {/* Auditorium Container with Horizontal Scroll */}
                <div className="rounded-2xl bg-slate-950 p-4 sm:p-6 border border-white/10 space-y-6 overflow-x-auto">
                  {/* Curved Screen */}
                  <ScreenCurvature />

                  {/* Seat Grid */}
                  <div className="space-y-3 min-w-[580px] max-w-2xl mx-auto">
                    {rowsList.map((rowObj, rowIdx) => (
                      <React.Fragment key={rowObj.letter}>
                        {/* Section Divider Labels */}
                        {rowIdx === 0 && (
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400 pb-1 border-b border-amber-500/20">
                            <span>VIP Recliner Section (${SEAT_TIERS.VIP.price.toFixed(2)})</span>
                            <span className="text-[10px] text-gray-400 font-normal">Rows I - J</span>
                          </div>
                        )}
                        {rowIdx === 2 && (
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-rose-400 pt-3 pb-1 border-b border-rose-500/20">
                            <span>Prime / Gold Section (${SEAT_TIERS.PREMIUM.price.toFixed(2)})</span>
                            <span className="text-[10px] text-gray-400 font-normal">Rows E - H</span>
                          </div>
                        )}
                        {rowIdx === 6 && (
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-300 pt-3 pb-1 border-b border-white/10">
                            <span>Classic / Silver Section (${SEAT_TIERS.STANDARD.price.toFixed(2)})</span>
                            <span className="text-[10px] text-gray-400 font-normal">Rows A - D</span>
                          </div>
                        )}

                        {/* Row */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <span className="w-5 text-center text-xs font-mono font-bold text-gray-400 select-none">
                            {rowObj.letter}
                          </span>

                          <div className="flex items-center gap-1 sm:gap-1.5">
                            {rowObj.seats.map((seat) => {
                              const isSelected = selectedSeats.some((s) => s.id === seat.id);
                              return (
                                <React.Fragment key={seat.id}>
                                  {seat.isAisleLeft && (
                                    <div className="w-4 sm:w-6 pointer-events-none" />
                                  )}
                                  <SeatItem
                                    seat={seat}
                                    isSelected={isSelected}
                                    onToggle={handleToggleSeat}
                                  />
                                  {seat.isAisleRight && (
                                    <div className="w-4 sm:w-6 pointer-events-none" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          <span className="w-5 text-center text-xs font-mono font-bold text-gray-400 select-none">
                            {rowObj.letter}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Exits */}
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 pt-4 border-t border-white/5 max-w-2xl mx-auto">
                    <span>← Exit Left</span>
                    <span>Auditorium 1 • Dolby Cinema</span>
                    <span>Exit Right →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Column: Sticky Comprehensive Booking Summary Card & Ticket Price Calculation */}
            <div className="space-y-6">
              <div className="sticky top-20 rounded-3xl bg-slate-900/90 border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-rose-500" />
                    <span>Booking Summary</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Live review of selections & itemized price breakdown.
                  </p>
                </div>

                {/* Selected Movie Snippet */}
                <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-950 border border-white/5">
                  <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={selectedMovie.poster || selectedMovie.image}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-white truncate">{selectedMovie.title}</h4>
                    <p className="text-[11px] text-rose-400 font-medium">
                      {Array.isArray(selectedMovie.genre) ? selectedMovie.genre[0] : 'Action'} • {selectedMovie.duration || '2h 15m'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-gray-500 shrink-0" />
                      <span>{selectedTheatre.name}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500 shrink-0" />
                      <span>{selectedDate}, {selectedTime}</span>
                    </p>
                  </div>
                </div>

                {/* Selected Seats Tags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-300">
                      Selected Seats ({selectedSeats.length}/{MAX_SEATS_LIMIT}):
                    </span>
                    {selectedSeats.length >= MAX_SEATS_LIMIT && (
                      <span className="text-[10px] text-amber-400 font-bold">Max Limit Reached</span>
                    )}
                  </div>

                  {selectedSeats.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-dashed border-white/10 text-center text-xs text-gray-400">
                      No seats selected yet. Click seats in the layout above.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono"
                        >
                          <span>{seat.row}{seat.col}</span>
                          <span className="text-[9px] opacity-70">(${seat.price})</span>
                          <button
                            type="button"
                            onClick={() => handleDeselectSeat(seat)}
                            className="hover:text-white p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ticket Price Calculation Itemized Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2.5 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-1.5 flex items-center justify-between">
                    <span>Price Calculation</span>
                    <CreditCard className="h-3.5 w-3.5 text-rose-400" />
                  </div>

                  {/* Tier Sub-Breakdown */}
                  {tierSummary.VIP > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>VIP Recliner ({tierSummary.VIP} × ${SEAT_TIERS.VIP.price})</span>
                      <span className="text-white font-medium">
                        ${(tierSummary.VIP * SEAT_TIERS.VIP.price).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {tierSummary.PREMIUM > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Prime / Gold ({tierSummary.PREMIUM} × ${SEAT_TIERS.PREMIUM.price})</span>
                      <span className="text-white font-medium">
                        ${(tierSummary.PREMIUM * SEAT_TIERS.PREMIUM.price).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {tierSummary.STANDARD > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Classic / Silver ({tierSummary.STANDARD} × ${SEAT_TIERS.STANDARD.price})</span>
                      <span className="text-white font-medium">
                        ${(tierSummary.STANDARD * SEAT_TIERS.STANDARD.price).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400 pt-1 border-t border-white/5">
                    <span>Seats Subtotal</span>
                    <span className="text-white font-semibold">${seatSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Convenience Fee (${CONVENIENCE_FEE_PER_TICKET}/seat)</span>
                    <span className="text-white font-medium">${convenienceFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Cinema Tax & GST (5%)</span>
                    <span className="text-white font-medium">${taxAmount.toFixed(2)}</span>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold text-sm">
                    <span className="text-white">Total Ticket Price</span>
                    <span className="text-lg text-rose-400 tracking-tight">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Duplicate Booking Prevention Notice */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-[11px] text-gray-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-gray-200">Duplicate Booking Protection:</strong> Seats are locked in real-time. Concurrent double-booking of identical seats is blocked.
                  </p>
                </div>

                {/* Booking Confirmation Action Button */}
                <button
                  type="button"
                  disabled={selectedSeats.length === 0 || isProcessing}
                  onClick={handleConfirmBooking}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Sparkles className="h-4 w-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>
                    {isProcessing
                      ? 'Validating & Reserving...'
                      : `Confirm Booking • $${totalAmount.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Confirmation Modal / E-Ticket Pass */}
      <BookingSuccessModal
        isOpen={successModalOpen}
        bookingData={confirmedBookingData}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
};

export default TicketBooking;
