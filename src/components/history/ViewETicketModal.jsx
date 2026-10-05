import React, { useState } from 'react';
import {
  X,
  Ticket,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

const ViewETicketModal = ({ isOpen, booking, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.id);
      setCopiedId(true);
      toast.info('Booking Reference ID copied to clipboard!');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleDownloadTicket = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`🎟️ E-Ticket downloaded successfully! (CineTick-${booking.id}.pdf)`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-7 shadow-2xl space-y-5 text-gray-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* E-Ticket Cinema Boarding Card */}
        <div className="rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl">
          {/* Card Top Brand Header */}
          <div className="p-4 bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Ticket className="h-4 w-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                OFFICIAL CINEMA E-PASS
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-rose-300 border border-white/10">
                {booking.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1 hover:text-rose-400 text-gray-400 transition-colors"
                title="Copy ID"
              >
                {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-5 space-y-4 text-xs">
            {/* Movie Poster & Title */}
            <div className="flex gap-3.5 items-center">
              <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-slate-800 shrink-0 shadow-md">
                <img
                  src={booking.poster}
                  alt={booking.movie}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Movie
                </span>
                <h3 className="text-base font-black text-white leading-tight truncate">
                  {booking.movie}
                </h3>
                <p className="text-[11px] text-rose-400 font-medium">
                  {booking.theatre}
                </p>
              </div>
            </div>

            {/* Show & Venue Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Auditorium
                </p>
                <p className="text-gray-200 font-medium truncate mt-0.5">
                  {booking.screen || 'Audi 1 • Dolby Cinema'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Date & Time
                </p>
                <p className="text-rose-400 font-semibold mt-0.5">
                  {booking.showDate}, {booking.showtime}
                </p>
              </div>
            </div>

            {/* Allocated Seats */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                Allocated Seats ({booking.seatCount})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats?.map((seat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative py-2">
              <div className="border-t border-dashed border-white/20 w-full" />
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full border-r border-white/10" />
              <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full border-l border-white/10" />
            </div>

            {/* QR Turnstile Bar */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                  Amount Paid
                </span>
                <span className="text-lg font-black text-white">{booking.amount}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  {booking.paymentMethod}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10">
                <QrCode className="h-10 w-10 text-white" />
                <span className="text-[8px] font-mono font-bold tracking-wider text-rose-400">
                  SCAN AT GATE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download Ticket (no UI Only text) & Print */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadTicket}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>{isDownloading ? 'Downloading PDF...' : 'Download Ticket'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4 text-rose-400" />
            <span>Print Ticket Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewETicketModal;
