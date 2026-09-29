import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCards from '../components/dashboard/StatCards';
import RevenueSummary from '../components/dashboard/RevenueSummary';
import UpcomingMovies from '../components/dashboard/UpcomingMovies';
import AvailableShows from '../components/dashboard/AvailableShows';
import RecentBookings from '../components/dashboard/RecentBookings';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import { toast } from 'react-toastify';

import {
  DASHBOARD_STATS,
  REVENUE_SUMMARY,
  UPCOMING_MOVIES,
  RECENT_BOOKINGS,
  AVAILABLE_SHOWS,
} from '../data/dashboardData';

import { Film, MapPin, RotateCcw } from 'lucide-react';

const NOW_SHOWING_MOVIES = [
  {
    id: 1,
    title: 'Interstellar: The IMAX Re-release',
    genre: 'Sci-Fi / Adventure',
    duration: '2h 49m',
    rating: '8.7',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    hall: 'Hall 1 - Dolby Cinema',
    times: ['03:30 PM', '06:45 PM', '09:30 PM'],
  },
  {
    id: 2,
    title: 'Cyber City: 2099',
    genre: 'Action / Cyberpunk',
    duration: '2h 15m',
    rating: '8.4',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    hall: 'Hall 3 - IMAX 3D',
    times: ['04:00 PM', '07:15 PM', '10:00 PM'],
  },
  {
    id: 3,
    title: 'The Silent Symphony',
    genre: 'Drama / Mystery',
    duration: '1h 58m',
    rating: '8.1',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    hall: 'Hall 2 - VIP Lounge',
    times: ['02:15 PM', '05:30 PM', '08:45 PM'],
  },
];

const KPI_STORAGE_KEY = 'mtbs_kpi_stats';

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize KPI stats from localStorage or defaults
  const [kpiStats, setKpiStats] = useState(() => {
    try {
      const saved = localStorage.getItem(KPI_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading KPI stats from storage:', e);
    }
    return DASHBOARD_STATS;
  });

  const [lastUpdatedKey, setLastUpdatedKey] = useState(null);
  const [bookingsList, setBookingsList] = useState(RECENT_BOOKINGS);
  const [showsList, setShowsList] = useState(AVAILABLE_SHOWS);

  // Save to localStorage whenever KPI stats change
  useEffect(() => {
    try {
      localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(kpiStats));
    } catch (e) {
      console.error('Failed to save KPI stats:', e);
    }
  }, [kpiStats]);

  // Handle Quick Action executions and replicate directly to KPI cards
  const handleQuickAction = (actionId, payload) => {
    if (actionId === 'book') {
      const count = Number(payload.ticketCount) || 1;
      const newTotal = kpiStats.totalBookings.value + count;
      const newToday = kpiStats.todaysBookings.value + count;

      setKpiStats((prev) => ({
        ...prev,
        totalBookings: {
          ...prev.totalBookings,
          value: newTotal,
          subtext: `+${count} new reservation(s)`,
        },
        todaysBookings: {
          ...prev.todaysBookings,
          value: newToday,
          subtext: `${newToday} booked today`,
        },
      }));

      // Prepend to Recent Bookings list
      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: payload.customerName || user?.name || 'Walk-in Guest',
        customerEmail: user?.email || 'guest@cinema.com',
        movie: payload.movie || 'Interstellar: IMAX',
        theatre: payload.theatre || 'Hall 1 - Dolby Cinema',
        showtime: 'Today, Just Now',
        seats: Array.from({ length: count }, (_, i) => `Seat-${i + 1}`),
        seatCount: count,
        amount: `$${(count * 17).toFixed(2)}`,
        paymentMethod: 'Instant Booking',
        status: 'Confirmed',
        date: 'Just now',
      };
      setBookingsList((prev) => [newBooking, ...prev]);

      setLastUpdatedKey('totalBookings');
      toast.success(
        `🎟️ Booked ${count} ticket(s)! Total Bookings increased to ${newTotal.toLocaleString()} & Today's Bookings to ${newToday}.`
      );
    } else if (actionId === 'add-movie') {
      const newTotal = kpiStats.totalMovies.value + 1;
      setKpiStats((prev) => ({
        ...prev,
        totalMovies: {
          ...prev.totalMovies,
          value: newTotal,
          subtext: `Added "${payload.title}"`,
        },
      }));

      setLastUpdatedKey('totalMovies');
      toast.success(
        `🎬 Added "${payload.title}"! Total Movies KPI increased to ${newTotal}.`
      );
    } else if (actionId === 'add-theatre') {
      const newTotal = kpiStats.totalTheatres.value + 1;
      setKpiStats((prev) => ({
        ...prev,
        totalTheatres: {
          ...prev.totalTheatres,
          value: newTotal,
          subtext: `Added "${payload.theatreName}"`,
        },
      }));

      setLastUpdatedKey('totalTheatres');
      toast.success(
        `🏛️ Added "${payload.theatreName}"! Total Theatres KPI increased to ${newTotal}.`
      );
    } else if (actionId === 'schedule') {
      const newTotal = kpiStats.availableShows.value + 1;
      setKpiStats((prev) => ({
        ...prev,
        availableShows: {
          ...prev.availableShows,
          value: newTotal,
          subtext: `New show at ${payload.time || '11:15 PM'}`,
        },
      }));

      // Prepend to Available Shows list
      const newShow = {
        id: `show-${Date.now()}`,
        movie: payload.movie || 'Scheduled Premiere',
        theatre: payload.theatre || 'Hall 3 (IMAX 3D)',
        time: payload.time || '11:15 PM',
        price: '$18.00',
        totalSeats: 120,
        availableSeats: 120,
        format: payload.format || 'IMAX 3D',
      };
      setShowsList((prev) => [newShow, ...prev]);

      setLastUpdatedKey('availableShows');
      toast.success(
        `⏱️ Show scheduled for "${payload.movie}"! Available Shows KPI increased to ${newTotal}.`
      );
    } else if (actionId === 'concessions') {
      const newToday = kpiStats.todaysBookings.value + 1;
      setKpiStats((prev) => ({
        ...prev,
        todaysBookings: {
          ...prev.todaysBookings,
          value: newToday,
          subtext: `Snack order: ${payload.combo || 'Combo'}`,
        },
      }));

      setLastUpdatedKey('todaysBookings');
      toast.success(
        `🍿 Concession order recorded! Today's Bookings & Orders KPI increased to ${newToday}.`
      );
    }

    // Clear highlight animation after 3.5 seconds
    setTimeout(() => {
      setLastUpdatedKey(null);
    }, 3500);
  };

  const handleBookShow = (show) => {
    if (show.availableSeats <= 0) {
      toast.error('Sorry, this show is completely sold out!');
      return;
    }

    const newTotal = kpiStats.totalBookings.value + 1;
    const newToday = kpiStats.todaysBookings.value + 1;

    setKpiStats((prev) => ({
      ...prev,
      totalBookings: {
        ...prev.totalBookings,
        value: newTotal,
        subtext: '+1 show reservation',
      },
      todaysBookings: {
        ...prev.todaysBookings,
        value: newToday,
        subtext: `${newToday} booked today`,
      },
    }));

    // Decrement available seats in that show
    setShowsList((prev) =>
      prev.map((s) =>
        s.id === show.id ? { ...s, availableSeats: Math.max(0, s.availableSeats - 1) } : s
      )
    );

    // Prepend new booking record to Recent Bookings list
    const seatNumber = `S-${show.totalSeats - show.availableSeats + 1}`;
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: user?.name || 'Walk-in Guest',
      customerEmail: user?.email || 'guest@cinema.com',
      movie: show.movie,
      theatre: show.theatre,
      showtime: `Today, ${show.time}`,
      seats: [seatNumber],
      seatCount: 1,
      amount: show.price,
      paymentMethod: 'Instant Booking',
      status: 'Confirmed',
      date: 'Just now',
    };
    setBookingsList((prev) => [newBooking, ...prev]);

    setLastUpdatedKey('totalBookings');
    setTimeout(() => {
      setLastUpdatedKey(null);
    }, 3500);

    toast.success(
      `🎟️ Booked 1 ticket for "${show.movie}" (${show.time})! Total Bookings is now ${newTotal.toLocaleString()}.`
    );
  };

  const handleResetKpi = () => {
    localStorage.removeItem(KPI_STORAGE_KEY);
    setKpiStats(DASHBOARD_STATS);
    setBookingsList(RECENT_BOOKINGS);
    setShowsList(AVAILABLE_SHOWS);
    setLastUpdatedKey(null);
    toast.info('KPI stats reset to default benchmark values.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar with active Dashboard navigation button */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content View with desktop offset for sidebar */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-6 sm:p-10 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome to CINETICK, <span className="text-rose-400">{user?.name || 'Guest'}</span>!
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                Live cinema operations, ticket bookings, revenue summaries, and upcoming premieres overview.
              </p>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-96 w-96 text-white" />
            </div>
          </section>

          {/* 1. Stat Cards (Replicates real-time count increments with glowing animation) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-300">
                Key Performance Indicators
              </span>
              <button
                type="button"
                onClick={handleResetKpi}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                title="Reset KPI numbers to default"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Counts</span>
              </button>
            </div>
            <StatCards stats={kpiStats} lastUpdatedKey={lastUpdatedKey} />
          </section>

          {/* 2. Quick Action Cards (Directly updates KPI counts) */}
          <section>
            <QuickActionCards onActionExecute={handleQuickAction} />
          </section>

          {/* 3. Revenue Summary (Dummy Data) */}
          <section id="revenue-section">
            <RevenueSummary revenueData={REVENUE_SUMMARY} />
          </section>

          {/* 4. Available Shows Today */}
          <section id="shows-section">
            <AvailableShows shows={showsList} onBookTicket={handleBookShow} />
          </section>

          {/* 5. Recent Bookings Table */}
          <section id="bookings-section">
            <RecentBookings bookings={bookingsList} />
          </section>

          {/* 6. Upcoming Movies */}
          <section id="upcoming-section">
            <UpcomingMovies movies={UPCOMING_MOVIES} />
          </section>

          {/* 7. Now Showing Catalog */}
          <section id="movies-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-rose-500" />
                <h2 className="text-lg font-bold text-white tracking-wide">Now Showing in Theatres</h2>
              </div>
              <Link
                to="/movies"
                className="text-xs text-rose-400 hover:text-rose-300 font-medium hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Explore Full Catalog</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {NOW_SHOWING_MOVIES.map((movie) => (
                <div
                  key={movie.id}
                  className="group rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden hover:border-rose-500/40 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                      ★ {movie.rating}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{movie.genre} • {movie.duration}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                        <MapPin className="h-3.5 w-3.5 text-rose-400" />
                        {movie.hall}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Available Showtimes:</p>
                      <div className="flex flex-wrap gap-2">
                        {movie.times.map((time, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-600/20 hover:text-rose-300 text-xs font-medium text-gray-300 border border-white/10 transition-colors cursor-pointer"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
