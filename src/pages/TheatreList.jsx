import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TheatreCard from '../components/theatres/TheatreCard';
import TheatreSkeleton from '../components/theatres/TheatreSkeleton';
import { getTheatres } from '../services/theatreApi';
import {
  Search,
  Building2,
  Film,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const TheatreList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Data states
  const [theatres, setTheatres] = useState([]);
  const [cities, setCities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch theatres from service
  const fetchTheatreData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTheatres({
        search: searchQuery,
        city: selectedCity,
        sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setTheatres(response.data);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
      if (response.cities) setCities(response.cities);
    } catch (err) {
      setError(err.message || 'Failed to fetch theatres list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCity, sortBy, currentPage]);

  useEffect(() => {
    fetchTheatreData();
  }, [fetchTheatreData]);

  // Reset pagination when search or filters change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSortBy('rating-desc');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
          {/* Header Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <Building2 className="h-3.5 w-3.5" />
                <span>Theatres & Multiplexes</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Find <span className="text-rose-500">Theatres</span> & Showtimes
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Discover world-class cinema halls, IMAX laser auditoriums, and reserve seats across all major metropolitan cities.
              </p>
            </div>

            {/* Film Reel decorative background icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* Search, Filter & Controls Bar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by theatre name, address, or movie playing..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900/80 border border-white/10 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs sm:text-sm text-white placeholder-gray-400 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-gray-300">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
                  >
                    <option value="rating-desc" className="bg-slate-900 text-white">Top Rated</option>
                    <option value="screens-desc" className="bg-slate-900 text-white">Most Screens</option>
                    <option value="name-asc" className="bg-slate-900 text-white">Name (A-Z)</option>
                    <option value="city-asc" className="bg-slate-900 text-white">City (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0 pl-1">
                <MapPin className="h-3 w-3 text-rose-400" />
                City:
              </span>

              <button
                type="button"
                onClick={() => handleCityChange('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCity === 'All'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-900/80 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                All Cities
              </button>

              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityChange(city)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCity === city
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900/80 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <p>
              Showing <span className="font-semibold text-white">{theatres.length}</span> of{' '}
              <span className="font-semibold text-white">{totalCount}</span> theatres
              {selectedCity !== 'All' && <span> in <strong className="text-rose-400">{selectedCity}</strong></span>}
            </p>

            {(searchQuery || selectedCity !== 'All' || sortBy !== 'rating-desc') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Theatre Grid / List Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TheatreSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-rose-950/20 border border-rose-500/30 p-12 text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Error Loading Theatres</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">{error}</p>
              <button
                type="button"
                onClick={fetchTheatreData}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : theatres.length === 0 ? (
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-12 text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-white">No Theatres Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No cinema halls matched your search for "{searchQuery}" in {selectedCity}. Try adjusting your keywords or city filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {theatres.map((theatre) => (
                <TheatreCard key={theatre.id} theatre={theatre} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
                <span className="font-semibold text-white">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                          : 'bg-slate-900 border border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TheatreList;
