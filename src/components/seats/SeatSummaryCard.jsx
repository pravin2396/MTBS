import React from 'react';
import {
  Ticket,
  Clock,
  MapPin,
  Calendar,
  X,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { MAX_SEATS_LIMIT, CONVENIENCE_FEE_PER_TICKET } from '../../data/mockSeatsData';

const SeatSummaryCard = ({
  movie,
  theatre,
  showtime,
  date,
  selectedSeats,
  onDeselectSeat,
  onProceedBooking,
  isProcessing,
}) => {
  const seatCount = selectedSeats.length;

  // Calculate ticket subtotal based on individual seat tier prices
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = seatCount * CONVENIENCE_FEE_PER_TICKET;
  const grandTotal = subtotal + convenienceFee;

  const isMaxReached = seatCount >= MAX_SEATS_LIMIT;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 sm:p-6 space-y-6 shadow-2xl backdrop-blur-xl">
      {/* Movie Details Header */}
      <div className="flex gap-4 items-start border-b border-white/10 pb-5">
        <img
          src={movie?.poster || 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'}
          alt={movie?.title || 'Selected Movie'}
          className="w-16 sm:w-20 aspect-[2/3] rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
        />

        <div className="flex-1 min-w-0 space-y-1">
          <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
            {movie?.genre?.[0] || 'Feature Film'}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {movie?.title || 'Cinema Premiere'}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
            <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
            <span>{theatre?.name || 'Grand Cinema Hall'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 pt-0.5">
            <span className="flex items-center gap-1 text-gray-300">
              <Calendar className="h-3 w-3 text-rose-400" />
              {date || 'Today'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-rose-400">
              <Clock className="h-3 w-3" />
              {showtime || '07:30 PM'}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Count & Limit Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300 flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-rose-400" />
            Selected Seats
          </span>
          <span
            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
              isMaxReached
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-white/10 text-gray-300'
            }`}
          >
            {seatCount} / {MAX_SEATS_LIMIT} max
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full transition-all duration-300 ${
              isMaxReached ? 'bg-amber-500' : 'bg-gradient-to-r from-rose-600 to-rose-400'
            }`}
            style={{ width: `${(seatCount / MAX_SEATS_LIMIT) * 100}%` }}
          />
        </div>

        {isMaxReached && (
          <p className="text-[11px] text-amber-400 flex items-center gap-1 pt-0.5 font-medium">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>Maximum booking limit reached ({MAX_SEATS_LIMIT} seats).</span>
          </p>
        )}
      </div>

      {/* Selected Seats Tag Cloud */}
      <div className="space-y-2">
        {seatCount === 0 ? (
          <div className="py-6 px-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-1">
            <p className="text-xs text-gray-400">No seats selected yet</p>
            <p className="text-[11px] text-gray-500">
              Click on available seats on the layout to begin booking.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-600/20 text-rose-200 border border-rose-500/40 text-xs font-bold"
              >
                <span>
                  {seat.row}{seat.col}
                </span>
                <span className="text-[10px] text-rose-400/80 font-normal">
                  (${seat.price.toFixed(0)})
                </span>
                <button
                  type="button"
                  onClick={() => onDeselectSeat(seat)}
                  className="hover:text-white transition-colors cursor-pointer ml-0.5"
                  title={`Deselect ${seat.row}${seat.col}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price Calculation Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5 text-xs">
        <div className="flex justify-between text-gray-400">
          <span>Tickets Subtotal ({seatCount} seats)</span>
          <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span className="flex items-center gap-1">
            <span>Convenience & Booking Fee</span>
            <span className="text-[10px] text-gray-500">(${CONVENIENCE_FEE_PER_TICKET}/seat)</span>
          </span>
          <span className="text-white font-semibold">
            {seatCount > 0 ? `$${convenienceFee.toFixed(2)}` : '$0.00'}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-2.5 border-t border-white/10 flex justify-between items-baseline font-bold">
          <span className="text-white text-sm">Total Payable</span>
          <span className="text-xl text-rose-400 font-extrabold tracking-tight">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={seatCount === 0 || isProcessing}
        onClick={onProceedBooking}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-950/50 hover:shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
      >
        <CreditCard className="h-4 w-4" />
        <span>
          {isProcessing
            ? 'Confirming Reservation...'
            : seatCount === 0
            ? 'Select Seats to Proceed'
            : `Confirm & Book ${seatCount} Ticket${seatCount > 1 ? 's' : ''} • $${grandTotal.toFixed(2)}`}
        </span>
      </button>

      {/* Safety & Guarantee Note */}
      <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>100% Guaranteed Seat Allocation • Instant E-Ticket</span>
      </div>
    </div>
  );
};

export default SeatSummaryCard;
