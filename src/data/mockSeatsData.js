// Mock Seat Selection & Ticket Booking Helper for Module 5 & Module 6

export const SEAT_TIERS = {
  VIP: {
    name: 'VIP Recliner',
    price: 24.0,
    rows: ['I', 'J'],
    color: 'amber',
    description: 'Plush motorized recliners with personal armrests & gourmet service',
  },
  PREMIUM: {
    name: 'Prime / Gold',
    price: 18.0,
    rows: ['E', 'F', 'G', 'H'],
    color: 'rose',
    description: 'Optimal acoustic sweet spot with wide luxury executive seating',
  },
  STANDARD: {
    name: 'Classic / Silver',
    price: 14.0,
    rows: ['A', 'B', 'C', 'D'],
    color: 'slate',
    description: 'Standard comfortable cinema seating with crystal-clear view',
  },
};

export const MAX_SEATS_LIMIT = 6;
export const CONVENIENCE_FEE_PER_TICKET = 1.5;
export const TAX_PERCENTAGE = 0.05;

// Baseline initially booked seats
export const INITIAL_BOOKED_SEATS = [
  'J-6', 'J-7',
  'I-5', 'I-6', 'I-7', 'I-8',
  'H-7', 'H-8', 'H-9',
  'G-4', 'G-5', 'G-6', 'G-10', 'G-11',
  'F-5', 'F-6', 'F-7', 'F-8', 'F-9',
  'E-6', 'E-7', 'E-8',
  'D-3', 'D-4', 'D-11', 'D-12',
  'C-7', 'C-8',
  'B-5', 'B-6',
];

/**
 * Get all booked seats for a specific show (initial + dynamically booked in storage)
 * @param {string} showKey
 * @returns {Set<string>}
 */
export const getBookedSeatsForShow = (showKey = 'default') => {
  const bookedSet = new Set(INITIAL_BOOKED_SEATS);
  try {
    const stored = localStorage.getItem(`mtbs_booked_seats_${showKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((seatId) => bookedSet.add(seatId));
      }
    }
  } catch (err) {
    console.error('Error reading booked seats from storage:', err);
  }
  return bookedSet;
};

/**
 * Record new booked seats to prevent duplicate bookings across sessions
 * @param {string} showKey
 * @param {Array<string>} seatIds
 */
export const recordBookedSeatsForShow = (showKey = 'default', seatIds = []) => {
  try {
    const existing = getBookedSeatsForShow(showKey);
    seatIds.forEach((id) => existing.add(id));
    localStorage.setItem(`mtbs_booked_seats_${showKey}`, JSON.stringify(Array.from(existing)));
  } catch (err) {
    console.error('Error saving booked seats to storage:', err);
  }
};

/**
 * Checks if any of the provided seats are already booked for this show
 * @param {string} showKey
 * @param {Array<string>} seatIds
 * @returns {{ isDuplicate: boolean, conflictSeats: Array<string> }}
 */
export const checkDuplicateBooking = (showKey = 'default', seatIds = []) => {
  const currentBooked = getBookedSeatsForShow(showKey);
  const conflictSeats = seatIds.filter((id) => currentBooked.has(id));
  return {
    isDuplicate: conflictSeats.length > 0,
    conflictSeats,
  };
};

/**
 * Generates an auditorium seat grid.
 * 10 Rows (A to J), 14 Seats per row with aisles after seat 3 and seat 11.
 *
 * @param {string} [seedKey='default'] - Seed for deterministic booked seat generation
 * @returns {Array<Object>}
 */
export const generateAuditoriumLayout = (seedKey = 'default') => {
  const rows = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']; // J at back (VIP), A at front
  const totalCols = 14;

  const bookedSet = getBookedSeatsForShow(seedKey);
  const grid = [];

  rows.forEach((rowLetter) => {
    let tierKey = 'STANDARD';
    if (SEAT_TIERS.VIP.rows.includes(rowLetter)) {
      tierKey = 'VIP';
    } else if (SEAT_TIERS.PREMIUM.rows.includes(rowLetter)) {
      tierKey = 'PREMIUM';
    }

    const tierInfo = SEAT_TIERS[tierKey];

    for (let col = 1; col <= totalCols; col++) {
      const seatId = `${rowLetter}-${col}`;
      const isBooked = bookedSet.has(seatId);

      grid.push({
        id: seatId,
        row: rowLetter,
        col: col,
        number: col,
        tier: tierKey,
        tierName: tierInfo.name,
        price: tierInfo.price,
        status: isBooked ? 'booked' : 'available', // available | booked | selected
        isAisleLeft: col === 4,  // Aisle between 3 and 4
        isAisleRight: col === 11, // Aisle between 11 and 12
      });
    }
  });

  return grid;
};

/**
 * Generates a unique, formatted Booking ID
 * Example format: MTBS-2026-X8R4K
 */
export const generateUniqueBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestampSuffix = Date.now().toString().slice(-3);
  return `MTBS-${new Date().getFullYear()}-${randomPart}${timestampSuffix}`;
};
