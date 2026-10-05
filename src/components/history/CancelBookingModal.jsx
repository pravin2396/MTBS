import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Ticket,
} from 'lucide-react';

const CANCELLATION_REASONS = [
  'Change of plans / Schedule conflict',
  'Selected wrong showtime or date',
  'Booked wrong cinema / multiplex venue',
  'Medical or personal emergency',
  'Found better seats / Rebooking',
  'Other reason',
];

const CancelBookingModal = ({ isOpen, booking, onClose, onConfirmCancel }) => {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    const finalReason = selectedReason === 'Other reason' && customReason.trim()
      ? customReason.trim()
      : selectedReason;

    setTimeout(() => {
      onConfirmCancel(booking.id, finalReason);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 p-6 sm:p-7 shadow-2xl space-y-5 text-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/40">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Cancel Booking?</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Reference ID: <span className="font-mono font-bold text-rose-300">{booking.id}</span>
            </p>
          </div>
        </div>

        {/* Booking Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Movie</span>
            <span className="text-white font-bold">{booking.movie}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Venue & Screen</span>
            <span className="text-gray-200">{booking.theatre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Schedule</span>
            <span className="text-rose-400 font-semibold">{booking.showDate}, {booking.showtime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Seats ({booking.seatCount})</span>
            <span className="text-gray-200 font-mono font-bold">{booking.seats?.join(', ')}</span>
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-baseline font-bold">
            <span className="text-gray-400">Refund Amount</span>
            <span className="text-emerald-400 text-sm font-extrabold">{booking.amount} (100% Refund)</span>
          </div>
        </div>

        {/* Reason for Cancellation */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-gray-300 block">
            Reason for Cancellation:
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {CANCELLATION_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                  selectedReason === reason
                    ? 'bg-rose-950/30 border-rose-500/50 text-white font-medium'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="cancellationReason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-rose-500"
                />
                <span className="truncate">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Other reason' && (
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please specify reason..."
              className="w-full mt-2 p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-rose-500"
            />
          )}
        </div>

        {/* Refund Policy Notice */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-[11px] text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Your reserved seats will be released immediately. A full refund of{' '}
            <strong className="text-white">{booking.amount}</strong> will be processed to{' '}
            <strong className="text-rose-300">{booking.paymentMethod}</strong>.
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Processing Refund...' : 'Confirm Cancellation'}</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            Keep Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
