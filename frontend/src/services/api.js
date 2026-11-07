import { MOCK_EVENTS } from '../data/mockEvents.js';

/**
 * Festify API Client (Pure JavaScript)
 *
 * Compatible with Java 21 Spring Boot + MySQL backend.
 *
 * Spring Boot Endpoints:
 * - GET    /api/v1/events?search={s}&city={c}&category={cat}&featured={f}
 * - GET    /api/v1/events/{id}
 * - POST   /api/v1/bookings
 * - GET    /api/v1/bookings/my-tickets?email={email}
 * - POST   /api/v1/auth/login
 * - POST   /api/v1/auth/register
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const STORAGE_BOOKINGS_KEY = 'festify_bookings_store';

function formatBackendEvent(event) {
  const eventDate = event.eventDate
    ? new Date(event.eventDate)
    : null;

  return {
    ...event,
    id: String(event.id),
    date: eventDate
      ? eventDate.toISOString().split('T')[0]
      : '',
    displayDate: eventDate
      ? eventDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '',
    time: eventDate
      ? eventDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) + ' IST'
      : '',
    image: event.imageUrl || '',
    trending: false,
    artistOrHost: '',
    organizer: '',
    highlights: [],
    ticketCategories: [
      {
        id: `ticket-${event.id}`,
        name: 'General Admission',
        description: 'Standard event entry',
        price: event.startingPrice || 0,
        available: 100,
        perks: ['Event entry']
      }
    ]
  };
}

// Default initial demo booking
const INITIAL_DEMO_BOOKING = {
  bookingId: 'FST-2026-9821',
  eventId: 'ev-01',
  eventTitle: 'Acoustic & Arena: India Stadium Tour 2026',
  eventImage: '/src/assets/images/hero_festify_concert_1793963300033.jpg',
  category: 'Concerts',
  city: 'Mumbai',
  venue: 'DY Patil Stadium, Nerul',
  eventDate: 'Sat, 28 Nov 2026',
  eventTime: '06:00 PM IST',
  ticketCategoryName: 'Gold Ground Standing Zone',
  quantity: 2,
  unitPrice: 2999,
  subtotal: 5998,
  convenienceFee: 240,
  totalAmount: 6238,
  attendeeName: 'Aarav Sharma',
  attendeeEmail: 'aarav.sharma@example.com',
  attendeePhone: '+91 98765 43210',
  bookingDate: new Date().toISOString(),
  paymentMethod: 'UPI',
  status: 'CONFIRMED',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=FST-2026-9821-MUM-DYPATIL-CONFIRMED'
};

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify([INITIAL_DEMO_BOOKING]));
      return [INITIAL_DEMO_BOOKING];
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_DEMO_BOOKING];
  }
}

function saveStoredBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings in localStorage', e);
  }
}

export const eventService = {
  async getEvents(params) {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.city && params.city !== 'All Cities') query.append('city', params.city);
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.featured) query.append('featured', 'true');

      const res = await fetch(`${API_BASE_URL}/events?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
  const data = await res.json();
  return data.map(formatBackendEvent);
}
    } catch {
      // Spring Boot backend is offline; fallback to mock data
    }

    let events = [...MOCK_EVENTS];

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.artistOrHost.toLowerCase().includes(q)
      );
    }

    if (params?.city && params.city !== 'All Cities') {
      events = events.filter((e) => e.city.toLowerCase() === params.city?.toLowerCase());
    }

    if (params?.category && params.category !== 'All') {
      events = events.filter((e) => e.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.featured) {
      events = events.filter((e) => e.featured);
    }

    if (params?.sortBy === 'price_low') {
      events.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (params?.sortBy === 'price_high') {
      events.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (params?.sortBy === 'date') {
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return events;
  },

  async getEventById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`);
      if (res.ok) {
  const data = await res.json();
  return data ? formatBackendEvent(data) : null;
}
    } catch {
      // Fallback
    }
    return MOCK_EVENTS.find((e) => e.id === id || e.slug === id) || null;
  },

  async createBooking(req) {
    const event = MOCK_EVENTS.find((e) => e.id === req.eventId);
    if (!event) throw new Error('Event not found');

    const ticketCat = event.ticketCategories.find((tc) => tc.id === req.ticketCategoryId) || event.ticketCategories[0];
    const subtotal = ticketCat.price * req.quantity;
    const convenienceFee = Math.round(subtotal * 0.04);
    const totalAmount = subtotal + convenienceFee;
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `FST-${new Date().getFullYear()}-${randomHex}`;

    const newBooking = {
      bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      category: event.category,
      city: event.city,
      venue: event.venue,
      eventDate: event.displayDate,
      eventTime: event.time,
      ticketCategoryName: ticketCat.name,
      quantity: req.quantity,
      unitPrice: ticketCat.price,
      subtotal,
      convenienceFee,
      totalAmount,
      attendeeName: req.attendeeName,
      attendeeEmail: req.attendeeEmail,
      attendeePhone: req.attendeePhone,
      bookingDate: new Date().toISOString(),
      paymentMethod: req.paymentMethod,
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${bookingId}-${event.city}-${encodeURIComponent(event.title)}`
    };

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const data = await res.json();
        const existing = getStoredBookings();
        saveStoredBookings([data, ...existing]);
        return data;
      }
    } catch {
      // Spring Boot offline; fallback to localStorage
    }

    const current = getStoredBookings();
    saveStoredBookings([newBooking, ...current]);
    return newBooking;
  },

  async getMyBookings(email) {
    try {
      const url = email
        ? `${API_BASE_URL}/bookings/my-tickets?email=${encodeURIComponent(email)}`
        : `${API_BASE_URL}/bookings/my-tickets`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const all = getStoredBookings();
    if (email) {
      const filtered = all.filter((b) => b.attendeeEmail.toLowerCase() === email.toLowerCase());
      return filtered.length > 0 ? filtered : all;
    }
    return all;
  }
};
