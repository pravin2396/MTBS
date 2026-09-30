import React from 'react';
import { Crown, Sparkles, Check, X } from 'lucide-react';
import { SEAT_TIERS } from '../../data/mockSeatsData';

const SeatLegend = () => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-xs">
      {/* Available Seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-950 border border-white/20 shadow-sm" />
        <span className="text-gray-300 font-medium">Available</span>
      </div>

      {/* Selected Seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-rose-600 border border-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-600/40">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
        <span className="text-white font-bold">Selected</span>
      </div>

      {/* Booked Seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 cursor-not-allowed">
          <X className="h-3.5 w-3.5" />
        </div>
        <span className="text-gray-500 font-medium">Booked / Sold Out</span>
      </div>

      {/* VIP Recliner */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-950 border border-amber-400/50 flex items-center justify-center text-amber-400">
          <Crown className="h-3.5 w-3.5 fill-amber-400/20" />
        </div>
        <span className="text-amber-300 font-semibold">
          VIP Recliner (${SEAT_TIERS.VIP.price.toFixed(2)})
        </span>
      </div>
    </div>
  );
};

export default SeatLegend;
