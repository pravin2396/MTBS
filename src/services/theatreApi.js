import { MOCK_THEATRES } from '../data/mockTheatresData';

// Simulated delay helper for realistic loading skeleton experience
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch theatres list with search, city filter, and pagination.
 *
 * @param {Object} params
 * @param {string} [params.search=''] - Keyword query (matches name, address, city, shows, amenities)
 * @param {string} [params.city='All'] - City filter
 * @param {string} [params.sortBy='name-asc'] - Sort strategy
 * @param {number} [params.page=1] - 1-indexed page number
 * @param {number} [params.limit=6] - Items per page
 * @returns {Promise<{ data: Array, total: number, page: number, totalPages: number, limit: number, cities: Array }>}
 */
export const getTheatres = async ({
  search = '',
  city = 'All',
  sortBy = 'rating-desc',
  page = 1,
  limit = 6,
} = {}) => {
  await delay(350);

  // Extract all unique cities
  const allCities = Array.from(new Set(MOCK_THEATRES.map((t) => t.city))).sort();

  let filtered = [...MOCK_THEATRES];

  // 1. Search Query
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        (Array.isArray(t.amenities) && t.amenities.some((a) => a.toLowerCase().includes(q))) ||
        (Array.isArray(t.shows) && t.shows.some((s) => s.movieTitle.toLowerCase().includes(q)))
    );
  }

  // 2. City Filter
  if (city && city !== 'All') {
    filtered = filtered.filter(
      (t) => t.city.toLowerCase() === city.toLowerCase()
    );
  }

  // 3. Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'rating-desc':
        return b.rating - a.rating;
      case 'screens-desc':
        return b.totalScreens - a.totalScreens;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'city-asc':
        return a.city.localeCompare(b.city);
      default:
        return b.rating - a.rating;
    }
  });

  // 4. Pagination
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
    cities: allCities,
  };
};

/**
 * Fetch a single theatre by ID.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getTheatreById = async (id) => {
  await delay(300);

  const theatre = MOCK_THEATRES.find((t) => String(t.id) === String(id));
  if (!theatre) {
    const error = new Error(`Theatre with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }

  return theatre;
};

export default {
  getTheatres,
  getTheatreById,
};
