import React from 'react';
import { Film, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out. See you soon! 🍿');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Toggle Sidebar & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer lg:hidden"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
                CINE<span className="text-rose-500">TICK</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Ticketing Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="h-7 w-7 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-rose-400">{user.role || 'Member'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
