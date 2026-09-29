import axios from 'axios';
import { MOCK_MOVIES } from '../data/mockMoviesData';

// Simulated delay helper to demonstrate loading skeletons
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Flag to simulate network failure for error handling demonstrations
let forceSimulatedError = false;

export const toggleSimulatedError = (shouldFail) => {
  forceSimulatedError = typeof shouldFail === 'boolean' ? shouldFail : !forceSimulatedError;
  return forceSimulatedError;
};

export const getSimulatedErrorState = () => forceSimulatedError;

/**
 * Axios instance configured for movie operations.
 * Demonstrates real Axios client usage with interceptors and mock service fallback.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.cinetick.mock/v1',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Fetch movies list with support for search, genre, language, rating, sort, and pagination.
 *
 * @param {Object} params
 * @param {string} [params.search=''] - Keyword search across title, description, cast, genre
 * @param {string} [params.genre='All'] - Genre filter
 * @param {string} [params.language='All'] - Language filter
 * @param {number|string} [params.minRating=0] - Minimum rating filter (e.g. 7.5, 8.0, 8.5)
 * @param {string} [params.sortBy='releaseDate-desc'] - Sort strategy (releaseDate-desc, releaseDate-asc, rating-desc, title-asc)
 * @param {number} [params.page=1] - 1-indexed page number
 * @param {number} [params.limit=6] - Items per page
 * @returns {Promise<{ data: Array, total: number, page: number, totalPages: number, limit: number, genres: Array, languages: Array }>}
 */
export const getMovies = async ({
  search = '',
  genre = 'All',
  language = 'All',
  minRating = 0,
  sortBy = 'releaseDate-desc',
  page = 1,
  limit = 6,
} = {}) => {
  // Simulate network roundtrip latency (450ms) so loading skeleton appears smoothly
  await delay(450);

  if (forceSimulatedError) {
    throw new Error('Network Error: Failed to fetch movies from mockApi service. Please verify your connection and try again.');
  }

  // Collect all unique genres and languages across the full dataset
  const allGenres = Array.from(new Set(MOCK_MOVIES.flatMap((m) => m.genre))).sort();
  const allLanguages = Array.from(new Set(MOCK_MOVIES.map((m) => m.language))).sort();

  let filtered = [...MOCK_MOVIES];

  // 1. Live Search (Title, Description, Director, Cast, Genre)
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (Array.isArray(m.cast) &&
          m.cast.some((c) => {
            if (typeof c === 'string') return c.toLowerCase().includes(q);
            if (typeof c === 'object' && c !== null) {
              return (
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.character && c.character.toLowerCase().includes(q))
              );
            }
            return false;
          })) ||
        (Array.isArray(m.genre) && m.genre.some((g) => g.toLowerCase().includes(q)))
    );
  }

  // 2. Filter by Genre
  if (genre && genre !== 'All') {
    filtered = filtered.filter((m) =>
      Array.isArray(m.genre)
        ? m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
        : m.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  // 3. Filter by Language
  if (language && language !== 'All') {
    filtered = filtered.filter(
      (m) => m.language.toLowerCase() === language.toLowerCase()
    );
  }

  // 4. Filter by Rating
  const numericRating = Number(minRating);
  if (!isNaN(numericRating) && numericRating > 0) {
    filtered = filtered.filter((m) => m.rating >= numericRating);
  }

  // 5. Sort by Release Date or other criteria
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'releaseDate-desc':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'releaseDate-asc':
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      case 'rating-desc':
        return b.rating - a.rating;
      case 'rating-asc':
        return a.rating - b.rating;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
  });

  // 6. Pagination
  const total = filtered.length;
  const parsedLimit = Math.max(1, Number(limit) || 6);
  const totalPages = Math.max(1, Math.ceil(total / parsedLimit));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);

  const startIndex = (currentPage - 1) * parsedLimit;
  const paginatedData = filtered.slice(startIndex, startIndex + parsedLimit);

  return {
    data: paginatedData,
    total,
    page: currentPage,
    totalPages,
    limit: parsedLimit,
    genres: allGenres,
    languages: allLanguages,
  };
};

/**
 * Fetch a single movie by ID.
 *
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const getMovieById = async (id) => {
  await delay(350);

  if (forceSimulatedError) {
    throw new Error('Network Error: Failed to retrieve movie details from server.');
  }

  const movie = MOCK_MOVIES.find((m) => String(m.id) === String(id));
  if (!movie) {
    const error = new Error(`Movie with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }

  return movie;
};

export default {
  getMovies,
  getMovieById,
  toggleSimulatedError,
  getSimulatedErrorState,
};
