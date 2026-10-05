import React from 'react';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  Building2,
  MapPin,
  CreditCard,
  User,
  ShieldCheck,
  Printer,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

const TicketDetailsModal = ({ isOpen, booking, onClose, onViewETicket }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.id);
      setCopied(true);
      toast.info('Booking Reference ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed & Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed / Attended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled & Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="h-3.5 w-3.5" />
            {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-7 shadow-2xl space-y-6 text-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 pr-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Ticket Details
              </span>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-gray-300">{booking.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 hover:text-rose-400 text-gray-400 transition-colors"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
            <h2 className="text-xl font-black text-white">{booking.movie}</h2>
          </div>

          <div>{getStatusBadge(booking.status)}</div>
        </div>

        {/* Movie Artwork & Primary Venue Info */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-950 border border-white/5">
          <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
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

          <div className="flex-1 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Cinema & Hall
                </span>
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{booking.theatre}</span>
                </p>
                <p className="text-[11px] text-gray-400 pl-5">{booking.screen}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Date & Show Time
                </span>
                <p className="text-rose-300 font-semibold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>{booking.showDate}</span>
                </p>
                <p className="text-[11px] text-gray-400 pl-5 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span>{booking.showtime}</span>
                </p>
              </div>
            </div>

            {/* Reserved Seats */}
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                Reserved Seats ({booking.seatCount})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats?.map((seat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Payment Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-1.5">
            Payment Breakdown
          </span>

          <div className="flex justify-between text-gray-400">
            <span>Payment Method</span>
            <span className="text-white font-medium flex items-center gap-1.5">
              <CreditCard className="h-3 w-3 text-rose-400" />
              <span>{booking.paymentMethod}</span>
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Booked For</span>
            <span className="text-white font-medium flex items-center gap-1.5">
              <User className="h-3 w-3 text-gray-500" />
              <span>{booking.customerName} ({booking.customerEmail})</span>
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Booking Date / Timestamp</span>
            <span className="text-gray-300">{booking.bookingTimestamp}</span>
          </div>

          {booking.status?.toLowerCase() === 'cancelled' && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs space-y-0.5">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Cancelled on: {booking.cancelledAt || 'Recently'}</span>
              </p>
              {booking.cancellationReason && (
                <p className="text-[11px] opacity-80 pl-5">
                  Reason: {booking.cancellationReason}
                </p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold">
            <span className="text-white">Total Amount Paid</span>
            <span className="text-base text-rose-400 font-extrabold">{booking.amount}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {booking.status?.toLowerCase() !== 'cancelled' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewETicket(booking);
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <Ticket className="h-4 w-4" />
              <span>View Official E-Ticket Pass</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-rose-400" />
            <span>Print Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
