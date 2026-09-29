import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Ticket,
  Film,
  Building2,
  CalendarPlus,
  Popcorn,
  Sparkles,
  X,
  PlusCircle,
} from 'lucide-react';

const QuickActionCards = ({ onActionExecute }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveModal(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModal]);

  const actions = [
    {
      id: 'book',
      title: 'Book Tickets',
      description: 'Reserve seats and select cinema halls',
      icon: Ticket,
      gradient: 'from-amber-600/30 to-amber-700/10',
      borderColor: 'border-amber-500/30 hover:border-amber-500',
      iconColor: 'text-amber-400',
      buttonText: 'Book Tickets',
      buttonBg: 'bg-amber-600 hover:bg-amber-500',
    },
    {
      id: 'add-movie',
      title: 'Add New Movie',
      description: 'Upload movie details, posters & age ratings',
      icon: Film,
      gradient: 'from-rose-600/30 to-rose-700/10',
      borderColor: 'border-rose-500/30 hover:border-rose-500',
      iconColor: 'text-rose-400',
      buttonText: 'Add Movie',
      buttonBg: 'bg-rose-600 hover:bg-rose-500',
    },
    {
      id: 'add-theatre',
      title: 'Add Theatre',
      description: 'Register cinema halls, VIP screens & hubs',
      icon: Building2,
      gradient: 'from-indigo-600/30 to-indigo-700/10',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500',
      iconColor: 'text-indigo-400',
      buttonText: 'Add Theatre',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-500',
    },
    {
      id: 'schedule',
      title: 'Schedule Show',
      description: 'Assign movies to halls, IMAX & showtimes',
      icon: CalendarPlus,
      gradient: 'from-cyan-600/30 to-cyan-700/10',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500',
      iconColor: 'text-cyan-400',
      buttonText: 'Schedule Show',
      buttonBg: 'bg-cyan-600 hover:bg-cyan-500',
    },
    {
      id: 'concessions',
      title: 'Order Snacks',
      description: 'Order popcorn combos & gourmet beverages',
      icon: Popcorn,
      gradient: 'from-emerald-600/30 to-emerald-700/10',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500',
      iconColor: 'text-emerald-400',
      buttonText: 'Order Snacks',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500',
    },
  ];

  const handleOpenModal = (action) => {
    setActiveModal(action);
    if (action.id === 'book') {
      setFormData({
        movie: 'Interstellar: The IMAX Re-release',
        customerName: 'Guest Visitor',
        ticketCount: 1,
        theatre: 'Hall 1 - Dolby Cinema',
      });
    } else if (action.id === 'add-movie') {
      setFormData({
        title: 'Gladiator II',
        genre: 'Action / History',
        duration: '2h 28m',
      });
    } else if (action.id === 'add-theatre') {
      setFormData({
        theatreName: 'CineStar Multiplex - Downtown Hub',
        screens: 4,
        city: 'Metro City',
      });
    } else if (action.id === 'schedule') {
      setFormData({
        movie: 'Cyber City: 2099',
        theatre: 'Hall 3 - IMAX 3D',
        time: '11:15 PM',
        format: 'IMAX 3D Laser',
      });
    } else if (action.id === 'concessions') {
      setFormData({
        combo: 'Jumbo Popcorn + 2 Sodas Combo',
        quantity: 1,
      });
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (onActionExecute && activeModal) {
      onActionExecute(activeModal.id, formData);
    }
    setActiveModal(null);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold tracking-wide">Quick Actions</h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">Frequent Operations</span>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${act.gradient} bg-slate-900/80 p-5 backdrop-blur-md border ${act.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${act.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5 uppercase">
                    Quick
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleOpenModal(act)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white ${act.buttonBg} transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-1.5`}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{act.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Action Modal */}
      {activeModal &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModal(null);
            }}
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn transition-all"
          >
            <div className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-1 ring-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg bg-white/5 ${activeModal.iconColor}`}>
                    <activeModal.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{activeModal.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Dynamic Form depending on action */}
              <form onSubmit={handleModalSubmit} className="flex-1 flex flex-col overflow-hidden text-xs text-left">
                <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
                  {/* BOOK TICKETS */}
                  {activeModal.id === 'book' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.customerName || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Select Movie
                        </label>
                        <select
                          value={formData.movie || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, movie: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-amber-500"
                        >
                          <option value="Interstellar: The IMAX Re-release">
                            Interstellar: The IMAX Re-release
                          </option>
                          <option value="Cyber City: 2099">Cyber City: 2099</option>
                          <option value="The Silent Symphony">The Silent Symphony</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Tickets Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            required
                            value={formData.ticketCount || 1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ticketCount: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Cinema Hall
                          </label>
                          <input
                            type="text"
                            value={formData.theatre || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, theatre: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ADD MOVIE */}
                  {activeModal.id === 'add-movie' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Movie Title
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Genre
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.genre || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, genre: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Duration
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.duration || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, duration: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ADD THEATRE */}
                  {activeModal.id === 'add-theatre' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Theatre / Multiplex Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.theatreName || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, theatreName: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            City / Location
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Screens Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={formData.screens || 1}
                            onChange={(e) =>
                              setFormData({ ...formData, screens: parseInt(e.target.value) || 1 })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* SCHEDULE SHOW */}
                  {activeModal.id === 'schedule' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Movie
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.movie || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, movie: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Theatre Hall
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.theatre || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, theatre: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            Showtime
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.time || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, time: e.target.value })
                            }
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* CONCESSIONS */}
                  {activeModal.id === 'concessions' && (
                    <>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Snack Combo
                        </label>
                        <select
                          value={formData.combo || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, combo: e.target.value })
                          }
                          className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-white outline-none focus:border-emerald-500"
                        >
                          <option value="Jumbo Popcorn + 2 Sodas Combo">
                            Jumbo Popcorn + 2 Sodas Combo ($16.00)
                          </option>
                          <option value="Nachos Supreme + Dip">Nachos Supreme + Dip ($12.50)</option>
                          <option value="Gourmet Caramel Bucket">Gourmet Caramel Bucket ($9.00)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Pinned Action Buttons Footer */}
                <div className="p-4 px-5 flex items-center justify-end gap-2 border-t border-white/10 bg-slate-900/90 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-white font-semibold ${activeModal.buttonBg} transition-colors cursor-pointer shadow-lg`}
                  >
                    Confirm Action
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default QuickActionCards;
