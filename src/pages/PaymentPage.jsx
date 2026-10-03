import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MOCK_MOVIES } from '../data/mockMoviesData';
import { MOCK_THEATRES } from '../data/mockTheatresData';
import {
  generateUniqueBookingId,
  CONVENIENCE_FEE_PER_TICKET,
  TAX_PERCENTAGE,
  recordBookedSeatsForShow,
} from '../data/mockSeatsData';
import {
  CreditCard,
  QrCode,
  Wallet,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
  Printer,
  ShieldCheck,
  Lock,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check,
  Ticket,
  Film,
  Clock,
  Calendar,
  MapPin,
  Building2,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';
const RECENT_BOOKINGS_KEY = 'mtbs_recent_bookings';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extract booking payload from navigation state or fallback to default show
  const passedBooking = location.state || {};

  const movie = useMemo(() => {
    if (passedBooking.movie) return passedBooking.movie;
    return MOCK_MOVIES[3] || MOCK_MOVIES[0]; // Inside Out 2 or Interstellar
  }, [passedBooking.movie]);

  const theatre = useMemo(() => {
    if (passedBooking.theatre) return passedBooking.theatre;
    return MOCK_THEATRES[0]; // PVR ICON: Phoenix Palladium
  }, [passedBooking.theatre]);

  const showtime = passedBooking.showtime || '05:30 PM';
  const showDate = passedBooking.date || 'Today';

  const seats = useMemo(() => {
    if (passedBooking.selectedSeats && passedBooking.selectedSeats.length > 0) {
      return passedBooking.selectedSeats;
    }
    // Default mock seats for direct visitors
    return [
      { id: 'G-6', row: 'G', col: 6, tier: 'PREMIUM', tierName: 'Prime / Gold', price: 18.0 },
      { id: 'G-7', row: 'G', col: 7, tier: 'PREMIUM', tierName: 'Prime / Gold', price: 18.0 },
    ];
  }, [passedBooking.selectedSeats]);

  // Pricing breakdown
  const seatsSubtotal = useMemo(() => {
    return seats.reduce((sum, s) => sum + s.price, 0);
  }, [seats]);

  const convenienceFee = useMemo(() => {
    return seats.length * CONVENIENCE_FEE_PER_TICKET;
  }, [seats.length]);

  const taxAmount = useMemo(() => {
    return (seatsSubtotal + convenienceFee) * TAX_PERCENTAGE;
  }, [seatsSubtotal, convenienceFee]);

  const totalAmount = useMemo(() => {
    if (passedBooking.totalAmount) return passedBooking.totalAmount;
    return seatsSubtotal + convenienceFee + taxAmount;
  }, [passedBooking.totalAmount, seatsSubtotal, convenienceFee, taxAmount]);

  // Active payment method tab: 'card' | 'upi' | 'wallet'
  const [activeMethod, setActiveMethod] = useState('card');

  // Payment Status screen state: 'idle' | 'processing' | 'success' | 'failure'
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [failureReason, setFailureReason] = useState('Card authorization timed out by issuing bank.');

  // Test simulation toggle (allows user to test failure flow vs success flow)
  const [simulateOutcome, setSimulateOutcome] = useState('success'); // 'success' | 'failure'

  // Confirmed booking payload
  const [confirmedData, setConfirmedData] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 1. Card Form State
  const [cardData, setCardData] = useState({
    name: user?.name || 'Alex Johnson',
    number: '4532 8920 1029 4821',
    expiry: '09/28',
    cvv: '842',
    saveCard: true,
  });

  // Card brand detection helper
  const cardBrand = useMemo(() => {
    const raw = cardData.number.replace(/\s+/g, '');
    if (raw.startsWith('4')) return 'Visa';
    if (raw.startsWith('5') || raw.startsWith('2')) return 'Mastercard';
    if (raw.startsWith('3')) return 'American Express';
    if (raw.startsWith('6')) return 'RuPay';
    return 'Credit / Debit Card';
  }, [cardData.number]);

  // 2. UPI Form State
  const [upiMode, setUpiMode] = useState('qr'); // 'qr' | 'vpa'
  const [vpaId, setVpaId] = useState(`${(user?.name || 'alex').toLowerCase().replace(/\s+/g, '')}@okhdfcbank`);
  const [vpaVerified, setVpaVerified] = useState(true);

  // 3. Wallet State
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const walletsList = [
    { id: 'paytm', name: 'Paytm Wallet', balance: 145.5, icon: '📱', color: 'from-blue-600 to-cyan-600' },
    { id: 'amazon', name: 'Amazon Pay Balance', balance: 88.0, icon: '🛒', color: 'from-amber-600 to-yellow-600' },
    { id: 'phonepe', name: 'PhonePe Wallet', balance: 65.2, icon: '🟣', color: 'from-purple-600 to-indigo-600' },
    { id: 'mobikwik', name: 'MobiKwik ZIP', balance: 120.0, icon: '⚡', color: 'from-rose-600 to-pink-600' },
  ];

  // Format Card Number input with 4-digit spacing
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData((prev) => ({ ...prev, number: formatted }));
  };

  // Format Expiry input MM/YY
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardData((prev) => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCardData((prev) => ({ ...prev, expiry: raw }));
    }
  };

  // Format CVV input (max 3-4 digits)
  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData((prev) => ({ ...prev, cvv: raw }));
  };

  // Process Payment Trigger
  const handlePayNow = () => {
    setPaymentStatus('processing');

    setTimeout(() => {
      if (simulateOutcome === 'failure') {
        // Trigger Payment Failure Screen
        setPaymentStatus('failure');
        setFailureReason(
          activeMethod === 'card'
            ? 'Card authorization declined by issuing bank (Error Code: ERR_DECLINE_54).'
            : activeMethod === 'upi'
            ? 'UPI payment request timed out. Bank server did not respond.'
            : 'Insufficient wallet balance or linked session expired.'
        );
        toast.error('❌ Transaction Failed. Please try another payment method.');
      } else {
        // Trigger Payment Success Screen
        const bookingId = generateUniqueBookingId();
        const seatNames = seats.map((s) => `${s.row}${s.col}`);
        const showKey = `${movie.id}-${theatre.id || 'th-1'}-${showDate}-${showtime}`.replace(/\s+/g, '_');

        try {
          // Persist booked seats to prevent duplicate bookings
          recordBookedSeatsForShow(showKey, seats.map((s) => s.id));

          // Replicate to KPI stats in localStorage
          const savedStats = localStorage.getItem(KPI_STORAGE_KEY);
          if (savedStats) {
            const stats = JSON.parse(savedStats);
            stats.totalBookings.value += seats.length;
            stats.todaysBookings.value += seats.length;
            stats.totalBookings.subtext = `+${seats.length} for ${movie.title}`;
            stats.todaysBookings.subtext = `+${seats.length} at ${theatre.name}`;
            localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(stats));
          }

          // Prepend to Recent Bookings list
          const newBooking = {
            id: bookingId,
            customerName: user?.name || 'Alex Johnson',
            customerEmail: user?.email || 'alex.johnson@cinetick.com',
            movie: movie.title,
            theatre: `${theatre.name} • Audi 1`,
            showtime: `${showDate}, ${showtime}`,
            seats: seatNames,
            seatCount: seats.length,
            amount: `$${totalAmount.toFixed(2)}`,
            paymentMethod:
              activeMethod === 'card'
                ? `${cardBrand} (•••• ${cardData.number.slice(-4)})`
                : activeMethod === 'upi'
                ? `UPI (${vpaId})`
                : `${walletsList.find((w) => w.id === selectedWallet)?.name || 'Digital Wallet'}`,
            status: 'Confirmed',
            date: 'Just now',
          };

          const savedBookings = localStorage.getItem(RECENT_BOOKINGS_KEY);
          const existingList = savedBookings ? JSON.parse(savedBookings) : [];
          localStorage.setItem(
            RECENT_BOOKINGS_KEY,
            JSON.stringify([newBooking, ...existingList])
          );

          setConfirmedData(newBooking);
          setPaymentStatus('success');
          toast.success(`🎉 Payment Successful! Booking Reference: ${bookingId}`);
        } catch (err) {
          console.error(err);
          setPaymentStatus('failure');
          setFailureReason('Storage or network synchronisation error.');
        }
      }
    }, 1400);
  };

  // Download Ticket Action (UI Only)
  const handleDownloadTicket = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success('🎟️ E-Ticket downloaded successfully! (CineTick-Pass.pdf)');
    }, 900);
  };

  // Copy Booking ID
  const handleCopyBookingId = () => {
    if (confirmedData?.id && navigator.clipboard) {
      navigator.clipboard.writeText(confirmedData.id);
      setCopiedId(true);
      toast.info('Booking Reference ID copied to clipboard!');
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  // Retry from Failure screen
  const handleRetryPayment = () => {
    setPaymentStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Top Quick Breadcrumbs & Simulation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Ticket Booking</span>
            </Link>

            {/* Test Mode Simulation Switcher (Lets evaluator test Success vs Failure states easily) */}
            <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-rose-400" />
                Simulate Outcome:
              </span>
              <button
                type="button"
                onClick={() => setSimulateOutcome('success')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  simulateOutcome === 'success'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Success ✓
              </button>
              <button
                type="button"
                onClick={() => setSimulateOutcome('failure')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  simulateOutcome === 'failure'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Failure ✕
              </button>
            </div>
          </div>

          {/* Header Banner with Signature Film Reel Background */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Secure <span className="text-rose-500">Payment</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Choose your preferred payment method—Credit/Debit Card, UPI QR scan, or digital wallets—to instantly confirm your seats.
              </p>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* MAIN CONDITIONAL VIEW CONTAINER: Idle / Processing / Success / Failure */}
          {paymentStatus === 'success' ? (
            /* ============================================================== */
            /* 1. PAYMENT SUCCESS SCREEN                                      */
            /* ============================================================== */
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Animated checkmark */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/50">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                    Payment Authorized • Tickets Confirmed
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Booking Successful!
                  </h2>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Your reservation has been confirmed and registered with the cinema auditorium. Your e-ticket is ready below.
                  </p>
                </div>

                {/* Cinema E-Ticket Pass Card */}
                <div className="rounded-2xl bg-slate-950 border border-white/10 text-left overflow-hidden shadow-xl">
                  {/* Ticket Header */}
                  <div className="p-4 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-rose-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Official Cinema E-Pass
                      </span>
                    </div>

                    {/* Booking ID with Copy Action */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-rose-300 bg-rose-600/20 px-2.5 py-1 rounded-lg border border-rose-500/30">
                        {confirmedData?.id || 'MTBS-2026-X8R4K'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyBookingId}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy Reference"
                      >
                        {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="p-5 space-y-4 text-xs">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Movie</p>
                        <h3 className="text-base sm:text-lg font-bold text-white">{confirmedData?.movie || movie.title}</h3>
                        <p className="text-[11px] text-rose-400">{movie.duration || '1h 36m'} • {movie.language || 'English'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Amount Paid</p>
                        <p className="text-base sm:text-lg font-black text-emerald-400">{confirmedData?.amount || `$${totalAmount.toFixed(2)}`}</p>
                        <span className="text-[10px] text-gray-400">{confirmedData?.paymentMethod || 'Paid Online'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Cinema & Hall</p>
                        <p className="text-gray-200 font-semibold truncate">{theatre.name}</p>
                        <p className="text-[10px] text-gray-400">{theatre.city} • Audi 1</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Date & Showtime</p>
                        <p className="text-rose-400 font-semibold">{showDate}, {showtime}</p>
                        <p className="text-[10px] text-gray-400">Gate opens 15 mins prior</p>
                      </div>
                    </div>

                    {/* Seats Pills */}
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                        Allocated Seats ({seats.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {seats.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono"
                          >
                            {s.row}{s.col} • {s.tierName || 'Standard'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* QR Code Entry Simulation */}
                    <div className="pt-4 border-t border-dashed border-white/15 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block">
                          Contactless Turnstile Entry
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Scan barcode at cinema entry gate
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                        <QrCode className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* DOWNLOAD TICKET BUTTON */}
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={handleDownloadTicket}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? 'Downloading PDF...' : 'Download Ticket'}</span>
                    </button>

                    {/* Print Button */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                    >
                      <Printer className="h-4 w-4 text-rose-400" />
                      <span>Print Ticket Pass</span>
                    </button>
                  </div>

                  {/* Return to Dashboard */}
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Updated Dashboard & Booking History →
                  </button>
                </div>
              </div>
            </div>
          ) : paymentStatus === 'failure' ? (
            /* ============================================================== */
            /* 2. PAYMENT FAILURE SCREEN                                      */
            /* ============================================================== */
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="rounded-3xl bg-slate-900 border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Error Alert Icon */}
                <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/50">
                  <XCircle className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
                    Transaction Unsuccessful
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Payment Failed
                  </h2>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    We could not process your transaction. No funds were deducted from your account.
                  </p>
                </div>

                {/* Failure Diagnostic Box */}
                <div className="rounded-2xl bg-slate-950 border border-rose-500/20 p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Decline Reason</span>
                  </div>
                  <p className="text-gray-300 font-mono text-[11px] pl-6">
                    {failureReason}
                  </p>
                </div>

                {/* Intact Booking Preservation Notice */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-gray-300 space-y-1">
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span>{movie.title}</span>
                    <span className="text-rose-400 font-bold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Your seats ({seats.map((s) => `${s.row}${s.col}`).join(', ')}) at {theatre.name} are safely held for you.
                  </p>
                </div>

                {/* Retry Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRetryPayment}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry Payment with Another Method</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/booking')}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      Change Seats
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      Cancel & Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* 3. DEFAULT PAYMENT INTERFACE (Summary + Payment Methods)       */
            /* ============================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT 2 COLUMNS: PAYMENT METHOD INTERFACES */}
              <div className="lg:col-span-2 space-y-6">
                {/* Method Selector Tabs */}
                <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-2 sm:p-3 shadow-xl flex items-center gap-2 overflow-x-auto">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Visa, Master, RuPay' },
                    { id: 'upi', label: 'UPI & QR Code', icon: QrCode, subtitle: 'GPay, PhonePe, Paytm' },
                    { id: 'wallet', label: 'Digital Wallets', icon: Wallet, subtitle: 'Amazon Pay, Paytm' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = activeMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMethod(m.id)}
                        className={`flex-1 min-w-[140px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-950/50 border-rose-500 shadow-lg shadow-rose-950/30'
                            : 'bg-slate-950/60 border-white/5 text-gray-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-rose-400' : 'text-gray-400'}`} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {m.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block truncate">{m.subtitle}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: CARD PAYMENT FORM */}
                {activeMethod === 'card' && (
                  <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-7 shadow-xl space-y-6">
                    <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-rose-500" />
                          <span>Card Payment</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Enter your card details for instant authorization.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 text-rose-300 border border-white/10">
                        {cardBrand}
                      </span>
                    </div>

                    {/* Interactive Animated Card Preview */}
                    <div className="relative w-full max-w-sm mx-auto aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-slate-950 via-rose-950 to-slate-900 border border-white/15 p-5 shadow-2xl flex flex-col justify-between text-white overflow-hidden group">
                      <div className="absolute right-0 top-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300/40 shadow-inner" />
                        <span className="text-xs font-black tracking-wider uppercase opacity-80">
                          {cardBrand}
                        </span>
                      </div>

                      <div className="space-y-1 relative z-10">
                        <p className="text-base sm:text-lg font-mono tracking-widest font-bold">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] relative z-10">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Cardholder</span>
                          <span className="font-semibold uppercase tracking-wide truncate max-w-[150px] block">
                            {cardData.name || 'YOUR NAME'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Expires</span>
                          <span className="font-mono font-semibold">{cardData.expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Form Inputs */}
                    <div className="space-y-4">
                      {/* Name on Card */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Name as on card"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs sm:text-sm text-white placeholder-gray-500 font-mono outline-none"
                          />
                          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                        </div>
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Valid Thru (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs sm:text-sm text-white placeholder-gray-500 font-mono outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs sm:text-sm text-white placeholder-gray-500 font-mono outline-none"
                          />
                        </div>
                      </div>

                      {/* Save Card Checkbox */}
                      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={cardData.saveCard}
                          onChange={(e) => setCardData((prev) => ({ ...prev, saveCard: e.target.checked }))}
                          className="h-3.5 w-3.5 rounded bg-slate-950 border-white/20 text-rose-600 focus:ring-0 cursor-pointer"
                        />
                        <span>Save this card for secure 1-click checkout in future</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* TAB 2: UPI PAYMENT UI */}
                {activeMethod === 'upi' && (
                  <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-7 shadow-xl space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-rose-500" />
                        <span>UPI Payment</span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Instant payment via Google Pay, PhonePe, Paytm, or any UPI application.
                      </p>
                    </div>

                    {/* UPI Sub-Tabs: QR Code vs Enter VPA */}
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-white/5">
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          upiMode === 'qr'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Scan QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('vpa')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          upiMode === 'vpa'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Enter UPI ID
                      </button>
                    </div>

                    {upiMode === 'qr' ? (
                      /* QR Scan UI */
                      <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-2xl bg-white text-slate-950 shadow-xl relative group">
                          <QrCode className="h-40 w-40 text-slate-950" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-black text-white">CINETICK PAY</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">
                            Scan with any UPI App to pay <span className="text-rose-400">${totalAmount.toFixed(2)}</span>
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Accepts Google Pay, PhonePe, Paytm, BHIM & Cred UPI
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          <span>QR code active for 04:59</span>
                        </div>
                      </div>
                    ) : (
                      /* Enter VPA UI */
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Virtual Payment Address (VPA) / UPI ID
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vpaId}
                              onChange={(e) => {
                                setVpaId(e.target.value);
                                setVpaVerified(false);
                              }}
                              placeholder="username@bank"
                              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setVpaVerified(true);
                                toast.success('✓ UPI ID Verified!');
                              }}
                              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
                            >
                              {vpaVerified ? 'Verified ✓' : 'Verify'}
                            </button>
                          </div>
                        </div>

                        {/* Quick Handle Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['@okhdfcbank', '@okaxis', '@ybl', '@paytm'].map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => {
                                const base = vpaId.split('@')[0] || 'alex';
                                setVpaId(`${base}${h}`);
                                setVpaVerified(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: WALLET PAYMENT UI */}
                {activeMethod === 'wallet' && (
                  <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 sm:p-7 shadow-xl space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-rose-500" />
                        <span>Digital Wallets</span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Link and pay using your favorite digital wallet balance.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {walletsList.map((w) => {
                        const isSelected = selectedWallet === w.id;
                        return (
                          <div
                            key={w.id}
                            onClick={() => setSelectedWallet(w.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500'
                                : 'bg-slate-950 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{w.icon}</span>
                              <div>
                                <h4 className="text-xs font-bold text-white">{w.name}</h4>
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  ${w.balance.toFixed(2)} Available
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-rose-600 flex items-center justify-center text-white">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Payment Security Footer Badge */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>PCI-DSS Level 1 Certified • 100% Refundable within 2 hrs</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500">ID: SEC-TX99</span>
                </div>
              </div>

              {/* RIGHT 1 COLUMN: BOOKING SUMMARY & CTA */}
              <div className="space-y-6">
                <div className="sticky top-20 rounded-3xl bg-slate-900/90 border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
                  {/* Summary Header */}
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-rose-500" />
                      <span>Booking Summary</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Review order before final authorization.
                    </p>
                  </div>

                  {/* Movie Card Snippet */}
                  <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-950 border border-white/5">
                    <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={movie.poster || movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                      <p className="text-[11px] text-rose-400 font-medium">
                        {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'Feature Film'}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-gray-500 shrink-0" />
                        <span>{theatre.name}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500 shrink-0" />
                        <span>{showDate}, {showtime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Allocated Seats Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-300">Reserved Seats ({seats.length}):</span>
                      <span className="text-[10px] font-mono text-rose-400">Audi 1</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {seats.map((seat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono"
                        >
                          {seat.row}{seat.col} (${seat.price})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Price Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-1.5">
                      Price Calculation
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Seats Subtotal ({seats.length} tickets)</span>
                      <span className="text-white font-medium">${seatsSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Convenience Fee (${CONVENIENCE_FEE_PER_TICKET}/seat)</span>
                      <span className="text-white font-medium">${convenienceFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Cinema Tax & GST (5%)</span>
                      <span className="text-white font-medium">${taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold text-sm">
                      <span className="text-white">Total Amount</span>
                      <span className="text-lg text-rose-400 tracking-tight">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Pay Now Button */}
                  <button
                    type="button"
                    disabled={paymentStatus === 'processing'}
                    onClick={handlePayNow}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      {paymentStatus === 'processing'
                        ? 'Authorizing Payment...'
                        : `Pay $${totalAmount.toFixed(2)} Now`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PaymentPage;
