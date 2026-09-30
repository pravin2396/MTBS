import React from 'react';
import { Eye } from 'lucide-react';

const ScreenCurvature = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col items-center">
      {/* Curved Screen Line */}
      <div className="relative w-full h-12 flex items-center justify-center">
        {/* Luminous Glow Effect */}
        <div className="absolute inset-x-8 top-0 h-6 bg-gradient-to-b from-rose-500/25 via-rose-500/5 to-transparent blur-md rounded-t-[100px] pointer-events-none" />

        {/* Curved White Arc */}
        <svg
          viewBox="0 0 600 60"
          className="w-full h-10 overflow-visible text-rose-500"
          preserveAspectRatio="none"
        >
          <path
            d="M 20 45 Q 300 5 580 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]"
          />
        </svg>
      </div>

      {/* Screen Direction Caption */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[11px] font-semibold uppercase tracking-widest text-gray-400 shadow-sm -mt-2">
        <Eye className="h-3 w-3 text-rose-400" />
        <span>All Eyes This Way • Cinema Screen</span>
      </div>
    </div>
  );
};

export default ScreenCurvature;
