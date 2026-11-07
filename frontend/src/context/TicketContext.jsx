import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const TicketContext = createContext(undefined);

export const TicketProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventService.getMyBookings(user?.email);
      setBookings(data);
    } catch (e) {
      console.error('Failed to load tickets', e);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const bookTickets = async (req) => {
    const booking = await eventService.createBooking(req);
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const cancelTicket = async (bookingId) => {
    const updated = bookings.map((b) =>
      b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
    );
    setBookings(updated);
    try {
      localStorage.setItem('festify_bookings_store', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  return (
    <TicketContext.Provider
      value={{
        bookings,
        loading,
        bookTickets,
        cancelTicket,
        refreshBookings: loadBookings,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
