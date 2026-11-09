
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { bookingService } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const TicketContext = createContext(undefined);

export const TicketProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const loadBookings = useCallback(async () => {
    if (!user?.email) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await bookingService.getMyBookings(user.email);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const bookTickets = async (req) => {
    const booking = await bookingService.createBooking(req);

    await loadBookings();

    return booking;
  };

 const cancelTicket = async (bookingId) => {
  if (!user?.email) {
    throw new Error('Please login first.');
  }

  const result = await bookingService.cancelBooking(
    bookingId,
    user.email
  );

  await loadBookings();
  return result;
};

  return (
    <TicketContext.Provider
      value={{
        bookings,
        loading,
        bookTickets,
        cancelTicket,
        refreshBookings: loadBookings
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
