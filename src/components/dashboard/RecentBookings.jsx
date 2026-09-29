import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Ticket,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  CreditCard,
  X,
  Printer,
  Calendar,
  MapPin,
  Film,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';

const RecentBookings = ({ bookings }) => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Lock scroll and listen for ESC key when modal is open
  React.useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedBooking(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedBooking]);

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status.toUpperCase() === filter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.movie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handlePrint = () => {
    toast.success('Ticket receipt generated for printing! 🖨️');
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md space-y-5">
      {/* Top Header & Search/Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <Ticket className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Recent Bookings
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Latest ticket transactions across all cinema locations
          </p>
        </div>

        {/* Search & Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, movie..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-rose-500 transition-colors w-48 sm:w-56"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-slate-950/80 border border-white/10 text-xs">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-2">Booking ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Movie & Theatre</th>
              <th className="pb-3">Showtime</th>
              <th className="pb-3">Seats</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-xs">
                  No bookings found matching your search or filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 pl-2 font-mono font-bold text-rose-400">
                    {b.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{b.customerName}</p>
                        <p className="text-[10px] text-gray-400">{b.customerEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* Movie & Theatre */}
                  <td className="py-3.5">
                    <p className="font-semibold text-white">{b.movie}</p>
                    <p className="text-[10px] text-gray-400">{b.theatre}</p>
                  </td>

                  {/* Showtime */}
                  <td className="py-3.5 text-gray-300">
                    {b.showtime}
                  </td>

                  {/* Seats */}
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {b.seats.map((seat, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono font-medium text-gray-300"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 font-bold text-white">
                    {b.amount}
                    <span className="block text-[10px] font-normal text-gray-400">
                      {b.paymentMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    {getStatusBadge(b.status)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-600/20 hover:text-rose-300 text-gray-400 text-[11px] font-medium transition-colors border border-white/5 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal mounted to body via Portal with Deep Whole-Page Blur */}
      {selectedBooking &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedBooking(null);
            }}
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn transition-all"
          >
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-1 ring-white/10 text-left overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Booking Details</span>
                      <span className="font-mono text-rose-400 text-sm font-semibold">
                        {selectedBooking.id}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Reservation recorded: {selectedBooking.date || 'Today'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedBooking.status)}
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Movie & Theatre */}
                <div className="rounded-xl bg-slate-950/80 border border-white/10 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                    Movie & Venue
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {selectedBooking.movie}
                  </h4>
                  <p className="text-xs text-gray-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>{selectedBooking.theatre}</span>
                  </p>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Showtime
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{selectedBooking.showtime}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Total Seats ({selectedBooking.seatCount || selectedBooking.seats.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedBooking.seats.map((seat, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Customer
                    </span>
                    <p className="font-bold text-white truncate">
                      {selectedBooking.customerName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Payment & Amount
                    </span>
                    <p className="font-black text-emerald-400 text-sm">
                      {selectedBooking.amount}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>{selectedBooking.paymentMethod}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Pinned Modal Actions Footer (Always Visible!) */}
              <div className="flex items-center justify-between p-4 px-5 border-t border-white/10 bg-slate-900/90 shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-lg shadow-rose-600/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default RecentBookings;
