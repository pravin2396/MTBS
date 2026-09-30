import React from 'react';
import { Check, X, Crown } from 'lucide-react';

const SeatItem = ({ seat, isSelected, onToggle }) => {
  const isBooked = seat.status === 'booked';
  const isVIP = seat.tier === 'VIP';

  const handleClick = () => {
    if (isBooked) return;
    onToggle(seat);
  };

  // Styling based on state
  let styleClasses = '';
  if (isBooked) {
    styleClasses = 'bg-slate-800/80 border-slate-700/80 text-slate-600 cursor-not-allowed opacity-60';
  } else if (isSelected) {
    styleClasses =
      'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/40 scale-105 cursor-pointer';
  } else if (isVIP) {
    styleClasses =
      'bg-slate-950 border-amber-400/40 text-amber-400 hover:border-amber-400 hover:bg-amber-500/15 hover:scale-105 cursor-pointer shadow-sm';
  } else if (seat.tier === 'PREMIUM') {
    styleClasses =
      'bg-slate-950 border-rose-500/30 text-gray-300 hover:border-rose-400 hover:bg-rose-600/15 hover:scale-105 cursor-pointer';
  } else {
    styleClasses =
      'bg-slate-950 border-white/15 text-gray-400 hover:border-white/40 hover:bg-white/10 hover:scale-105 cursor-pointer';
  }

  return (
    <button
      type="button"
      disabled={isBooked}
      onClick={handleClick}
      title={`${seat.row}${seat.col} • ${seat.tierName} ($${seat.price.toFixed(2)}) ${
        isBooked ? '• Sold Out' : isSelected ? '• Selected' : '• Available'
      }`}
      aria-label={`Seat ${seat.row}${seat.col} ${seat.tierName}`}
      className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg border text-[10px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center select-none ${styleClasses}`}
    >
      {/* Icon or Seat Number */}
      {isBooked ? (
        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
      ) : isSelected ? (
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      ) : isVIP ? (
        <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400/20" />
      ) : (
        <span>{seat.col}</span>
      )}

      {/* Top curved headrest simulation */}
      <span
        className={`absolute -top-1 inset-x-1.5 h-1 rounded-t-sm transition-colors ${
          isSelected
            ? 'bg-rose-400'
            : isBooked
            ? 'bg-slate-700'
            : isVIP
            ? 'bg-amber-400/50'
            : 'bg-white/20'
        }`}
      />
    </button>
  );
};

export default SeatItem;
