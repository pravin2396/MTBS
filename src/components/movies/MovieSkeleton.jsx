import React from 'react';

const MovieSkeleton = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden flex flex-col sm:flex-row animate-pulse">
      {/* Left Thumbnail Skeleton */}
      <div className="relative w-full sm:w-44 md:w-48 h-56 sm:h-auto aspect-[2/3] shrink-0 bg-slate-800/80" />

      {/* Right Content Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="h-5 bg-slate-700/70 rounded-md w-1/2" />
          <div className="flex items-center gap-2">
            <div className="h-3.5 bg-slate-800 rounded w-16" />
            <div className="h-3.5 bg-slate-800 rounded w-20" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-4 bg-slate-800 rounded-md w-14" />
            <div className="h-4 bg-slate-800 rounded-md w-14" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-slate-800/60 rounded w-full" />
            <div className="h-3 bg-slate-800/60 rounded w-4/5" />
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
          <div className="h-7 bg-slate-800 rounded-xl w-24" />
          <div className="h-7 bg-slate-800 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const MovieSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
};

export default MovieSkeleton;
