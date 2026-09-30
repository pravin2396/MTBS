import React from 'react';

const TheatreSkeleton = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden animate-pulse flex flex-col">
      {/* Top Banner Skeleton */}
      <div className="h-44 sm:h-52 bg-slate-800 w-full" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-5 bg-slate-800 rounded w-3/4" />
          <div className="h-3.5 bg-slate-800/80 rounded w-full" />
          <div className="h-3.5 bg-slate-800/80 rounded w-2/3" />
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="h-3 bg-slate-800 rounded w-1/3" />
          <div className="h-12 bg-slate-800/60 rounded-xl" />
        </div>

        <div className="pt-2 border-t border-white/5 flex gap-2">
          <div className="h-10 bg-slate-800 rounded-xl flex-1" />
          <div className="h-10 w-10 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TheatreSkeleton;
