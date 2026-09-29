import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MovieCard from '../components/movies/MovieCard';
import { MovieSkeletonGrid } from '../components/movies/MovieSkeleton';
import {
  getMovies,
  toggleSimulatedError,
  getSimulatedErrorState,
} from '../services/movieApi';
import {
  Search,
  Filter,
  Film,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RefreshCw,
  Bug,
} from 'lucide-react';
import { toast } from 'react-toastify';

const MovieList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('releaseDate-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // API Data states
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Async handling states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated error testing toggle
  const [isSimulatingError, setIsSimulatingError] = useState(getSimulatedErrorState());

  // Fetch movies from MockAPI service
  const fetchMoviesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMovies({
        search: searchQuery,
        genre: selectedGenre,
        language: selectedLanguage,
        minRating: Number(minRating),
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });

      setMovies(response.data);
      setTotalMovies(response.total);
      setTotalPages(response.totalPages);
      setAvailableGenres(response.genres);
      setAvailableLanguages(response.languages);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(
        err.message ||
          'Failed to load movies from the mockApi service. Please verify server connectivity.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    selectedGenre,
    selectedLanguage,
    minRating,
    sortBy,
    currentPage,
    itemsPerPage,
  ]);

  // Execute fetch on parameter changes
  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);

  // Reset to page 1 whenever filters or search criteria change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setMinRating('0');
    setSortBy('releaseDate-desc');
    setCurrentPage(1);
  };

  const handleToggleErrorSimulation = () => {
    const newState = toggleSimulatedError();
    setIsSimulatingError(newState);
    if (newState) {
      toast.warn('Simulated network error enabled. Click Retry to view the error state.');
    } else {
      toast.success('Simulated network error disabled.');
    }
    fetchMoviesData();
  };

  // Helper for pagination bounds
  const startItem = totalMovies === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMovies);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex font-sans selection:bg-rose-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
          {/* Header Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Explore <span className="text-rose-500">Movies</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Browse our live cinematic catalog powered by third-party MockAPI integration. Filter by genre, language, and rating, search your favorite titles, and watch high-definition trailers.
              </p>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block opacity-10 pointer-events-none">
              <Film className="h-64 w-64 text-white" />
            </div>
          </section>

          {/* Controls Bar: Search, Filters, Sort, and Error Simulator */}
          <section className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 space-y-3.5 backdrop-blur-md">
            {/* Top Row: Search Input & Error Simulation Toggle */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                  placeholder="Search by title, director, cast, or plot synopsis..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-white placeholder-gray-500 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleFilterChange(setSearchQuery, '')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Action buttons (Reset & Error Test) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>

                {/* Developer Error Simulation Button */}
                <button
                  type="button"
                  onClick={handleToggleErrorSimulation}
                  className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSimulatingError
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-gray-400 hover:text-gray-200 border-white/10'
                  }`}
                  title="Toggle simulated network error to evaluate error handling"
                >
                  <Bug className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {isSimulatingError ? 'Error Mode: ON' : 'Test Error State'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Filters (Genre, Language, Rating) & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
              {/* Filter by Genre */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-rose-400" />
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => handleFilterChange(setSelectedGenre, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="All">All Genres</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Language */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-rose-400" />
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleFilterChange(setSelectedLanguage, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="All">All Languages</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Rating */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-rose-400" />
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => handleFilterChange(setMinRating, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="0">All Ratings</option>
                  <option value="8.5">8.5+ ★ (Masterpieces)</option>
                  <option value="8.0">8.0+ ★ (Great)</option>
                  <option value="7.5">7.5+ ★ (Good)</option>
                </select>
              </div>

              {/* Sort by Release Date & Others */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3 w-3 text-rose-400" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 focus:border-rose-500 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="releaseDate-desc">Release Date: Newest First</option>
                  <option value="releaseDate-asc">Release Date: Oldest First</option>
                  <option value="rating-desc">Rating: Highest First</option>
                  <option value="title-asc">Movie Name: A to Z</option>
                </select>
              </div>
            </div>
          </section>

          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400 px-1">
            <div>
              Showing <span className="text-white font-semibold">{startItem}</span> -{' '}
              <span className="text-white font-semibold">{endItem}</span> of{' '}
              <span className="text-rose-400 font-bold">{totalMovies}</span> movies
              {selectedGenre !== 'All' && <span> • Genre: {selectedGenre}</span>}
              {selectedLanguage !== 'All' && <span> • Language: {selectedLanguage}</span>}
              {Number(minRating) > 0 && <span> • Rating: {minRating}+</span>}
            </div>

            {/* Items Per Page dropdown */}
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          {/* Movie Grid Section with Loading, Error, & Empty States */}
          <section className="space-y-6">
            {/* 1. Loading State */}
            {isLoading && <MovieSkeletonGrid count={itemsPerPage} />}

            {/* 2. Error State */}
            {!isLoading && error && (
              <div className="rounded-3xl bg-rose-950/20 border border-rose-500/30 p-8 sm:p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-white">Failed to Load Movies</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{error}</p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={fetchMoviesData}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                  {isSimulatingError && (
                    <button
                      onClick={handleToggleErrorSimulation}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Turn Off Error Simulation
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. Empty Results State */}
            {!isLoading && !error && movies.length === 0 && (
              <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
                  <Film className="h-8 w-8 text-rose-500 opacity-60" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-white">No Movies Found</h3>
                  <p className="text-xs text-gray-400">
                    We couldn't find any movie matching your current search or filter combinations. Try adjusting your query or resetting filters.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Populated Movie Cards List Layout */}
            {!isLoading && !error && movies.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          {/* Pagination Controls */}
          {!isLoading && !error && totalPages > 1 && (
            <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-400">
                Page <span className="text-white font-bold">{currentPage}</span> of{' '}
                <span className="text-white font-bold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-white/5 text-gray-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : 'bg-slate-900 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-white/5 text-gray-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MovieList;
