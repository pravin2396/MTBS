import { MOCK_MOVIES } from './mockMoviesData';
import { MOCK_THEATRES } from './mockTheatresData';

export const RECENT_BOOKINGS_STORAGE_KEY = 'mtbs_recent_bookings';

/**
 * Resolves a verified movie poster URL from MOCK_MOVIES by title or fallback.
 */
export const getPosterForMovie = (movieTitle = '') => {
  if (!movieTitle) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
  }
  const cleanTitle = movieTitle.toLowerCase().replace(/[:\-]/g, ' ');
  const found = MOCK_MOVIES.find((m) => {
    const mTitle = m.title.toLowerCase().replace(/[:\-]/g, ' ');
    return mTitle.includes(cleanTitle) || cleanTitle.includes(mTitle);
  });
  return found?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
};

/**
 * Initial curated set of diverse mock bookings covering All Statuses, Dates, and Movies
 */
export const INITIAL_MOCK_BOOKINGS = [
  {
    id: 'CT-9021',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Inside Out 2',
    movieId: '4',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    theatre: 'PVR ICON: Phoenix Palladium',
    screen: 'Audi 1 • Dolby Atmos 4K',
    city: 'Mumbai',
    showtime: '05:30 PM',
    showDate: 'Today',
    bookingDate: 'Today (Live)',
    dateCategory: 'Today',
    seats: ['G6', 'G7'],
    seatCount: 2,
    subtotal: 36.0,
    convenienceFee: 3.0,
    tax: 1.95,
    amount: '$40.95',
    paymentMethod: 'Visa (•••• 4821)',
    status: 'Confirmed',
    bookingTimestamp: 'Today, 10:45 AM',
    canCancel: true,
  },
  {
    id: 'CT-9020',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Interstellar',
    movieId: '1',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    theatre: 'INOX Megaplex: Inorbit Mall',
    screen: 'Audi 3 • IMAX 70mm Laser',
    city: 'Mumbai',
    showtime: '07:15 PM',
    showDate: 'Tomorrow',
    bookingDate: 'Tomorrow',
    dateCategory: 'Upcoming',
    seats: ['H8', 'H9', 'H10'],
    seatCount: 3,
    subtotal: 54.0,
    convenienceFee: 4.5,
    tax: 2.93,
    amount: '$61.43',
    paymentMethod: 'UPI (@okhdfcbank)',
    status: 'Confirmed',
    bookingTimestamp: 'Yesterday, 04:20 PM',
    canCancel: true,
  },
  {
    id: 'CT-9019',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Dune: Part Two',
    movieId: '5',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    theatre: 'Cinepolis: Viviana Mall',
    screen: 'Audi 2 • Dolby Cinema',
    city: 'Thane',
    showtime: '08:45 PM',
    showDate: 'Oct 12, 2026',
    bookingDate: 'Oct 12, 2026',
    dateCategory: 'Upcoming',
    seats: ['F4', 'F5'],
    seatCount: 2,
    subtotal: 36.0,
    convenienceFee: 3.0,
    tax: 1.95,
    amount: '$40.95',
    paymentMethod: 'Mastercard (•••• 9012)',
    status: 'Confirmed',
    bookingTimestamp: 'Oct 02, 2026 • 02:15 PM',
    canCancel: true,
  },
  {
    id: 'CT-9018',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Oppenheimer',
    movieId: '6',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    theatre: 'PVR Superplex: Mall of India',
    screen: 'Audi 1 • IMAX 70mm Special',
    city: 'Noida',
    showtime: '06:00 PM',
    showDate: 'Sep 28, 2026',
    bookingDate: 'Sep 28, 2026',
    dateCategory: 'Past',
    seats: ['D11', 'D12'],
    seatCount: 2,
    subtotal: 28.0,
    convenienceFee: 3.0,
    tax: 1.55,
    amount: '$32.55',
    paymentMethod: 'Paytm Wallet',
    status: 'Completed',
    bookingTimestamp: 'Sep 27, 2026 • 11:30 AM',
    canCancel: false,
  },
  {
    id: 'CT-9017',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Blade Runner 2049',
    movieId: '2',
    poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    theatre: 'Miraj Cinemas: IMAX Wadala',
    screen: 'Audi 4 • Dome Laser 3D',
    city: 'Mumbai',
    showtime: '09:30 PM',
    showDate: 'Sep 24, 2026',
    bookingDate: 'Sep 24, 2026',
    dateCategory: 'Past',
    seats: ['E8', 'E9'],
    seatCount: 2,
    subtotal: 36.0,
    convenienceFee: 3.0,
    tax: 1.95,
    amount: '$40.95',
    paymentMethod: 'Google Pay (@okicici)',
    status: 'Completed',
    bookingTimestamp: 'Sep 23, 2026 • 07:10 PM',
    canCancel: false,
  },
  {
    id: 'CT-9016',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'The Dark Knight',
    movieId: '8',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    theatre: 'PVR ICON: Phoenix Palladium',
    screen: 'Audi 1 • Recliner VIP Suite',
    city: 'Mumbai',
    showtime: '04:00 PM',
    showDate: 'Sep 18, 2026',
    bookingDate: 'Sep 18, 2026',
    dateCategory: 'Past',
    seats: ['I6', 'I7'],
    seatCount: 2,
    subtotal: 48.0,
    convenienceFee: 3.0,
    tax: 2.55,
    amount: '$53.55',
    paymentMethod: 'Visa (•••• 4821)',
    status: 'Cancelled',
    bookingTimestamp: 'Sep 17, 2026 • 01:25 PM',
    cancellationReason: 'Change of schedule / work meeting',
    cancelledAt: 'Sep 17, 2026 • 05:40 PM',
    canCancel: false,
  },
  {
    id: 'CT-9015',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Whiplash',
    movieId: '3',
    poster: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    theatre: 'INOX Megaplex: Inorbit Mall',
    screen: 'Audi 2 • Dolby 7.1 Surround',
    city: 'Mumbai',
    showtime: '02:15 PM',
    showDate: 'Sep 10, 2026',
    bookingDate: 'Sep 10, 2026',
    dateCategory: 'Past',
    seats: ['C5'],
    seatCount: 1,
    subtotal: 14.0,
    convenienceFee: 1.5,
    tax: 0.78,
    amount: '$16.28',
    paymentMethod: 'Amazon Pay Balance',
    status: 'Completed',
    bookingTimestamp: 'Sep 09, 2026 • 03:50 PM',
    canCancel: false,
  },
  {
    id: 'CT-9014',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@cinetick.com',
    movie: 'Spider-Man: Into the Spider-Verse',
    movieId: '7',
    poster: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    theatre: 'Cinepolis: Viviana Mall',
    screen: 'Audi 5 • 4DX RealD Experience',
    city: 'Thane',
    showtime: '03:45 PM',
    showDate: 'Aug 30, 2026',
    bookingDate: 'Aug 30, 2026',
    dateCategory: 'Past',
    seats: ['B7', 'B8', 'B9'],
    seatCount: 3,
    subtotal: 42.0,
    convenienceFee: 4.5,
    tax: 2.33,
    amount: '$48.83',
    paymentMethod: 'PhonePe Wallet',
    status: 'Cancelled',
    bookingTimestamp: 'Aug 29, 2026 • 10:15 AM',
    cancellationReason: 'Booked wrong theatre location',
    cancelledAt: 'Aug 29, 2026 • 11:00 AM',
    canCancel: false,
  },
];

/**
 * Load all bookings by merging localStorage bookings with initial mock bookings.
 * Ensures user's live bookings from Module 6 & Module 7 are displayed at the very top.
 */
export const loadAllStoredBookings = () => {
  try {
    const rawStored = localStorage.getItem(RECENT_BOOKINGS_STORAGE_KEY);
    const storedList = rawStored ? JSON.parse(rawStored) : [];

    // Map stored bookings to uniform schema
    const formattedStored = storedList.map((item) => {
      const poster = item.poster || getPosterForMovie(item.movie);
      const isCancelled = item.status?.toLowerCase() === 'cancelled';
      const isCompleted = item.status?.toLowerCase() === 'completed';

      return {
        id: item.id || `CT-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: item.customerName || 'Alex Johnson',
        customerEmail: item.customerEmail || 'alex@cinetick.com',
        movie: item.movie || 'Selected Movie',
        poster,
        theatre: item.theatre || 'PVR ICON: Phoenix Palladium',
        screen: item.theatre?.includes('Audi') ? item.theatre.split('•')[1]?.trim() : 'Audi 1 • Dolby Cinema',
        city: 'Mumbai',
        showtime: item.showtime?.split(',')[1]?.trim() || item.showtime || '05:30 PM',
        showDate: item.showtime?.split(',')[0]?.trim() || item.date || 'Today',
        bookingDate: item.date || 'Today (Live)',
        dateCategory: item.showtime?.toLowerCase().includes('tomorrow')
          ? 'Upcoming'
          : item.date?.toLowerCase().includes('ago')
          ? 'Past'
          : 'Today',
        seats: Array.isArray(item.seats) ? item.seats : [item.seats || 'G6'],
        seatCount: item.seatCount || (Array.isArray(item.seats) ? item.seats.length : 1),
        amount: typeof item.amount === 'number' ? `$${item.amount.toFixed(2)}` : item.amount || '$36.00',
        paymentMethod: item.paymentMethod || 'Credit Card (•••• 4821)',
        status: item.status || 'Confirmed',
        bookingTimestamp: item.date || 'Just now',
        cancellationReason: item.cancellationReason || '',
        cancelledAt: item.cancelledAt || '',
        canCancel: !isCancelled && !isCompleted,
      };
    });

    // Merge with initial mocks, ensuring uniqueness by ID
    const seenIds = new Set(formattedStored.map((b) => b.id));
    const combined = [...formattedStored];

    INITIAL_MOCK_BOOKINGS.forEach((mock) => {
      if (!seenIds.has(mock.id)) {
        combined.push(mock);
        seenIds.add(mock.id);
      }
    });

    return combined;
  } catch (err) {
    console.error('Error loading stored bookings:', err);
    return INITIAL_MOCK_BOOKINGS;
  }
};

/**
 * Cancel a booking in localStorage and return updated bookings list.
 */
export const cancelBookingInStorage = (bookingId, reason = 'Customer requested cancellation') => {
  try {
    const rawStored = localStorage.getItem(RECENT_BOOKINGS_STORAGE_KEY);
    const storedList = rawStored ? JSON.parse(rawStored) : [];

    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let foundInStorage = false;
    const updatedStored = storedList.map((item) => {
      if (item.id === bookingId) {
        foundInStorage = true;
        return {
          ...item,
          status: 'Cancelled',
          cancellationReason: reason,
          cancelledAt: nowStr,
        };
      }
      return item;
    });

    // If booking was one of the initial mocks not yet saved in localStorage, add it with cancelled status
    if (!foundInStorage) {
      const mockItem = INITIAL_MOCK_BOOKINGS.find((m) => m.id === bookingId);
      if (mockItem) {
        updatedStored.unshift({
          ...mockItem,
          status: 'Cancelled',
          cancellationReason: reason,
          cancelledAt: nowStr,
        });
      }
    }

    localStorage.setItem(RECENT_BOOKINGS_STORAGE_KEY, JSON.stringify(updatedStored));
    return loadAllStoredBookings();
  } catch (err) {
    console.error('Failed to cancel booking in storage:', err);
    return loadAllStoredBookings();
  }
};
