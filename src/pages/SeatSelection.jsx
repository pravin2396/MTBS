import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScreenCurvature from '../components/seats/ScreenCurvature';
import SeatLegend from '../components/seats/SeatLegend';
import SeatItem from '../components/seats/SeatItem';
import SeatSummaryCard from '../components/seats/SeatSummaryCard';
import BookingSuccessModal from '../components/seats/BookingSuccessModal';
import { MOCK_MOVIES } from '../data/mockMoviesData';
import { MOCK_THEATRES } from '../data/mockTheatresData';
import {
  generateAuditoriumLayout,
  MAX_SEATS_LIMIT,
  SEAT_TIERS,
} from '../data/mockSeatsData';
import {
  ArrowLeft,
  Clock,
  Film,
  Building2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const RECENT_BOOKINGS_KEY = 'mtbs_recent_bookings';

const SeatSelection = () => {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extract query parameters with smart fallbacks
  const paramMovieId = searchParams.get('movieId') || '1';
  const paramTheatreId = searchParams.get('theatreId') || 'th-1';
  const paramShowtime = searchParams.get('time') || '05:30 PM';
  const paramDate = searchParams.get('date') || 'Today';

  // Selected Movie and Theatre state
  const [selectedMovieId, setSelectedMovieId] = useState(paramMovieId);
  const [selectedTheatreId, setSelectedTheatreId] = useState(paramTheatreId);
  const [selectedShowtime, setSelectedShowtime] = useState(paramShowtime);
  const selectedDate = paramDate;

  // Resolve current active movie and theatre objects
  const currentMovie = useMemo(
    () => MOCK_MOVIES.find((m) => String(m.id) === String(selectedMovieId)) || MOCK_MOVIES[0],
    [selectedMovieId]
  );

  const currentTheatre = useMemo(
    () => MOCK_THEATRES.find((t) => String(t.id) === String(selectedTheatreId)) || MOCK_THEATRES[0],
    [selectedTheatreId]
  );

  // Auditorium seat grid layout
  const [seatGrid, setSeatGrid] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Initialize or re-generate seat layout on movie/theatre switch
  useEffect(() => {
    const layout = generateAuditoriumLayout(`${selectedMovieId}-${selectedTheatreId}`);
    setSeatGrid(layout);
    setSelectedSeats([]); // reset selected seats when changing show
  }, [selectedMovieId, selectedTheatreId, selectedShowtime]);

  // Handle seat click (Toggle selection)
  const handleToggleSeat = (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      // Deselect seat
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      // Check maximum seat selection limit
      if (selectedSeats.length >= MAX_SEATS_LIMIT) {
        toast.warn(
          `⚠️ Selection limit reached: You can select a maximum of ${MAX_SEATS_LIMIT} seats per booking.`
        );
        return;
      }
      // Add seat to selection
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  // Deselect specific seat from summary tag
  const handleDeselectSeat = (seat) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
  };

  // Clear all selections
  const handleClearAllSelections = () => {
    setSelectedSeats([]);
    toast.info('Seat selections cleared.');
  };

  // Confirm booking & replicate to KPI stats + Recent Bookings list
  const handleProceedBooking = () => {
    if (selectedSeats.length === 0) return;
    setIsProcessing(true);

    const count = selectedSeats.length;
    const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const convenience = count * 1.5;
    const totalAmount = subtotal + convenience;
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const seatNames = selectedSeats.map((s) => `${s.row}${s.col}`);

    try {
      // 1. Replicate to KPI stats in localStorage
      const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        stats.totalBookings.value += count;
        stats.todaysBookings.value += count;
        stats.totalBookings.subtext = `+${count} for ${currentMovie.title}`;
        stats.todaysBookings.subtext = `+${count} at ${currentTheatre.name}`;
        localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
      }

      // 2. Prepend to Recent Bookings list in localStorage
      const newBookingRecord = {
        id: bookingId,
        customerName: 'You (Current User)',
        customerEmail: 'user@cinetick.com',
        movie: currentMovie.title,
        theatre: `${currentTheatre.name} • Audi 1`,
        showtime: `${selectedDate}, ${selectedShowtime}`,
        seats: seatNames,
        seatCount: count,
        amount: `$${totalAmount.toFixed(2)}`,
        paymentMethod: 'Instant Pass',
        status: 'Confirmed',
        date: 'Just now',
      };

      const savedBookings = localStorage.getItem(RECENT_BOOKINGS_KEY);
      const existingList = savedBookings ? JSON.parse(savedBookings) : [];
      localStorage.setItem(
        RECENT_BOOKINGS_KEY,
        JSON.stringify([newBookingRecord, ...existingList])
      );

      // Prepare confirmation modal data
      setConfirmedBookingData({
        id: bookingId,
        movie: currentMovie.title,
        theatre: currentTheatre.name,
        showtime: `${selectedDate}, ${selectedShowtime}`,
        seats: seatNames,
        seatCount: count,
        amount: `$${totalAmount.toFixed(2)}`,
      });

      // Update seat statuses in local grid to booked
      setSeatGrid((prev) =>
        prev.map((s) =>
          selectedSeats.some((sel) => sel.id === s.id) ? { ...s, status: 'booked' } : s
        )
      );

      setSelectedSeats([]);
      setSuccessModalOpen(true);
      toast.success(
        `🎉 Successfully reserved ${count} seat(s) for "${currentMovie.title}"!`
      );
    } catch (e) {
      console.error(e);
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Top Navigation & Context Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Movies</span>
            </Link>

            {/* Quick Context Switchers */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Movie Switcher */}
              <div className="relative">
                <select
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none cursor-pointer text-xs appearance-none focus:border-rose-500"
                >
                  {MOCK_MOVIES.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900">
                      🎬 {m.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Theatre Switcher */}
              <div className="relative">
                <select
                  value={selectedTheatreId}
                  onChange={(e) => setSelectedTheatreId(e.target.value)}
                  className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none cursor-pointer text-xs appearance-none focus:border-rose-500"
                >
                  {MOCK_THEATRES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900">
                      🏛️ {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Showtime Switcher */}
              <div className="relative">
                <select
                  value={selectedShowtime}
                  onChange={(e) => setSelectedShowtime(e.target.value)}
                  className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none cursor-pointer text-xs appearance-none focus:border-rose-500"
                >
                  {['10:30 AM', '02:00 PM', '05:30 PM', '08:45 PM', '11:15 PM'].map((st) => (
                    <option key={st} value={st} className="bg-slate-900">
                      🕒 {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Select Your <span className="text-rose-500">Seats</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="font-semibold text-white">{currentMovie.title}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-rose-400" />
                  {currentTheatre.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-rose-400">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedShowtime}
                </span>
              </div>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </div>

          {/* Main Booking Workspace: Seat Grid (Left) & Summary Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Seat Layout Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Legend Bar */}
              <SeatLegend />

              {/* Auditorium Card Container */}
              <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-4 sm:p-8 shadow-2xl space-y-8 overflow-x-auto">
                {/* Curved Cinema Screen */}
                <ScreenCurvature />

                {/* Seats Grid */}
                <div className="space-y-3 min-w-[580px] max-w-2xl mx-auto">
                  {rowsList.map((rowObj, rowIdx) => {
                    return (
                      <React.Fragment key={rowObj.letter}>
                        {/* Tier Divider Labels */}
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

                        {/* Row of Seats */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {/* Left Row Identifier */}
                          <span className="w-5 text-center text-xs font-mono font-bold text-gray-400 select-none">
                            {rowObj.letter}
                          </span>

                          {/* Seat Buttons */}
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            {rowObj.seats.map((seat) => {
                              const isSelected = selectedSeats.some((s) => s.id === seat.id);

                              return (
                                <React.Fragment key={seat.id}>
                                  {/* Left Aisle Spacing */}
                                  {seat.isAisleLeft && (
                                    <div className="w-4 sm:w-6 pointer-events-none" />
                                  )}

                                  <SeatItem
                                    seat={seat}
                                    isSelected={isSelected}
                                    onToggle={handleToggleSeat}
                                  />

                                  {/* Right Aisle Spacing */}
                                  {seat.isAisleRight && (
                                    <div className="w-4 sm:w-6 pointer-events-none" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* Right Row Identifier */}
                          <span className="w-5 text-center text-xs font-mono font-bold text-gray-400 select-none">
                            {rowObj.letter}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Bottom Aisle & Exit Indicators */}
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-400 pt-6 border-t border-white/5 max-w-2xl mx-auto">
                  <span>← Exit Left</span>
                  <span className="text-gray-400">Auditorium 1 • Dolby Cinema</span>
                  <span>Exit Right →</span>
                </div>
              </div>

              {/* Reset Selection Button */}
              {selectedSeats.length > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearAllSelections}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear All Selected Seats ({selectedSeats.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right 1 Column: Sticky Seat Summary Card */}
            <div className="space-y-6">
              <SeatSummaryCard
                movie={currentMovie}
                theatre={currentTheatre}
                showtime={selectedShowtime}
                date={selectedDate}
                selectedSeats={selectedSeats}
                onDeselectSeat={handleDeselectSeat}
                onProceedBooking={handleProceedBooking}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Booking Confirmation / E-Ticket Modal */}
      <BookingSuccessModal
        isOpen={successModalOpen}
        bookingData={confirmedBookingData}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
};

export default SeatSelection;
