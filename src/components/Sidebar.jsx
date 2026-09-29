import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out. See you soon! 🍿');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-white/10 flex flex-col justify-between backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Top Header */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
                  CINE<span className="text-rose-500">TICK</span>
                </span>
                <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">
                  Management Portal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links - ONLY Dashboard */}
          <div className="px-3 py-6 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Navigation
            </p>

            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/30 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-white" />
                <span>Dashboard</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white">
                Live
              </span>
            </NavLink>

            <NavLink
              to="/movies"
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/30 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Film className="h-4 w-4" />
                <span>Movies</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Catalog
              </span>
            </NavLink>
          </div>
        </div>

        {/* Bottom Profile Name & Sign Out Button */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="h-8 w-8 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left text-xs leading-tight">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-rose-400 truncate">{user.role || 'Cinema Member'}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
