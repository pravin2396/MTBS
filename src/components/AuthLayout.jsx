import React from 'react';
import { Film, Clapperboard, Sparkles } from 'lucide-react';
import authBgImage from '../assets/auth-bg.jpg';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black overflow-hidden font-sans">
      {/* Background Image Layer with Cinema Mood Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${authBgImage})` }}
      />
      
      {/* Cinema Atmospheric Gradient & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />

      {/* Subtle Red Ambient Glow accentuating the cinema seats */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Cinema Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-2xl mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/30 text-white">
              <Film className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
                CINE<span className="text-rose-500">TICK</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Movie Ticket Booking System
              </span>
            </div>
          </div>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Glassmorphic Form Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
          {children}
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CINETICK Booking System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
