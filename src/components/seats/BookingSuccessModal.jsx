import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Ticket,
  QrCode,
  Printer,
  ArrowRight,
  X,
  Share2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookingSuccessModal = ({ isOpen, bookingData, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !bookingData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🎟️ My CINETICK Reservation: ${bookingData.movie} at ${bookingData.theatre} on ${bookingData.showtime}! Seats: ${bookingData.seats.join(', ')}`
      );
      toast.info('Ticket details copied to clipboard!');
    } else {
      toast.info('Ticket shared successfully!');
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 text-gray-100 overflow-hidden">
        {/* Subtle Decorative Glow */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Your seats have been reserved and replicated into live KPI records.
          </p>
        </div>

        {/* Cinema Ticket Card */}
        <div className="rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-xl">
          {/* Top Banner */}
          <div className="p-4 bg-gradient-to-r from-rose-950/60 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-rose-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                E-Ticket Pass
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-rose-300 border border-white/10">
              {bookingData.id}
            </span>
          </div>

          {/* Ticket Details */}
          <div className="p-5 space-y-4 text-xs">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Movie</p>
              <h3 className="text-base font-bold text-white">{bookingData.movie}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Cinema / Hall</p>
                <p className="text-gray-200 font-medium truncate">{bookingData.theatre}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Date & Time</p>
                <p className="text-rose-400 font-semibold">{bookingData.showtime}</p>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                Reserved Seats ({bookingData.seatCount})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {bookingData.seats.map((seat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated QR Code Bar */}
            <div className="pt-3 border-t border-dashed border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Paid</p>
                <p className="text-base font-extrabold text-white">{bookingData.amount}</p>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <QrCode className="h-8 w-8 text-rose-400" />
                <div className="text-[9px] text-gray-400 leading-tight">
                  <span className="block font-bold text-gray-300">SCAN AT GATE</span>
                  <span>Contactless Entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
          >
            <span>View Updated Dashboard & KPIs</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-rose-400" />
              <span>Print Ticket</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Share Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
