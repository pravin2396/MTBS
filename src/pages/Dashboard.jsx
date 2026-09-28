import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Film,
  Ticket,
  UserCheck,
  Shield,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  Popcorn,
  Database,
  RefreshCw,
  Check,
} from 'lucide-react';

const FEATURED_MOVIES = [
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

const Dashboard = () => {
  const { user } = useAuth();
  const [rawStorage, setRawStorage] = useState({});

  const refreshStorage = () => {
    setRawStorage({
      user: localStorage.getItem('user'),
      currentUser: localStorage.getItem('currentUser'),
      userInformation: localStorage.getItem('userInformation'),
      users: localStorage.getItem('users'),
      isLoggedIn: localStorage.getItem('isLoggedIn'),
      token: localStorage.getItem('token'),
    });
  };

  useEffect(() => {
    refreshStorage();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to CINETICK, <span className="text-rose-400">{user?.name}</span>!
            </h1>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
            <Film className="h-96 w-96 text-white" />
          </div>
        </section>

        {/* User LocalStorage Profile Card */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <UserCheck className="h-5 w-5" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                User Information
              </h2>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Full Name</span>
                <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Email Address</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Membership Tier</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                  {user?.role || 'Cinema Member'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Account ID</span>
                <span className="font-mono text-gray-300">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <Database className="h-5 w-5" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Storage Status
              </h2>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Storage Medium</span>
                <span className="font-semibold text-emerald-400">LocalStorage Active</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Session Token</span>
                <span className="font-mono text-gray-300 truncate max-w-[150px]">
                  {user?.token || 'active'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Protected Guard</span>
                <span className="text-emerald-400 font-semibold">Active & Secured</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Form Validator</span>
                <span className="text-white font-medium">React Hook Form</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Ticket className="h-5 w-5" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Quick Stats
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-black text-rose-400">0</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Booked Tickets</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-black text-amber-400">100</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Reward Points</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Ready for upcoming ticket booking and seat selection modules!
            </p>
          </div>
        </section>

        {/* Live LocalStorage Data Inspector */}
        <section className="rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-6 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div className="h-3 w-3 rounded-full bg-emerald-500 -ml-5" />
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>LocalStorage Active User Information</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Browser Storage
                </span>
              </h2>
            </div>
            <button
              onClick={refreshStorage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Storage View</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
            {/* Key: 'user' */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>localStorage.getItem('user')</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20">JSON Object</span>
              </div>
              <pre className="p-3 rounded-lg bg-black/60 text-gray-300 overflow-x-auto text-[11px] leading-relaxed border border-white/5">
                {rawStorage.user
                  ? JSON.stringify(JSON.parse(rawStorage.user), null, 2)
                  : '// No user stored yet'}
              </pre>
            </div>

            {/* Key: 'users' */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>localStorage.getItem('users')</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20">Registered Users</span>
              </div>
              <pre className="p-4 rounded-lg bg-black/60 text-gray-300 overflow-x-auto text-[11px] leading-relaxed border border-white/5 max-h-36">
                {rawStorage.users
                  ? JSON.stringify(JSON.parse(rawStorage.users), null, 2)
                  : '// Empty users array'}
              </pre>
            </div>
          </div>
        </section>

        {/* Featured Movies Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-rose-500" />
              <h2 className="text-xl font-bold text-white">Now Showing in Theatres</h2>
            </div>
            <span className="text-xs text-rose-400 font-medium">Showing Today</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_MOVIES.map((movie) => (
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
  );
};

export default Dashboard;
