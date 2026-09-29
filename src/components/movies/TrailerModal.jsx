import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Film } from 'lucide-react';

const TrailerModal = ({ isOpen, movie, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scrolling when modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Play className="h-4 w-4 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {movie.title} <span className="text-xs font-normal text-gray-400">• Official Trailer</span>
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} • {movie.duration} • {movie.language}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0 ml-3"
            title="Close Trailer (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center">
          {movie.trailerUrl ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1&rel=0`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="text-center p-8 space-y-3">
              <Film className="h-12 w-12 text-rose-500 mx-auto opacity-70 animate-pulse" />
              <p className="text-sm font-semibold text-gray-300">Trailer preview is currently buffering...</p>
              <p className="text-xs text-gray-500">Official distributor stream loading.</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="text-gray-400 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 font-semibold border border-rose-500/20">
              ★ {movie.rating}
            </span>
            <span className="truncate">{movie.tagline || movie.description?.slice(0, 70) + '...'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TrailerModal;
