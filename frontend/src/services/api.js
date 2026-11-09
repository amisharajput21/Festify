
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Convert backend event data into frontend format
export const formatBackendEvent = (event) => ({
  ...event,
  date: event.eventDate,
  price: event.startingPrice,
  location: event.venue,
  image: event.imageUrl,
  isFeatured: event.featured
});

// Authentication APIs
export const authService = {
  async signup(userData) {
    return this.sendRequest('/auth/signup', userData, 'Signup');
  },

  async login(credentials) {
    return this.sendRequest('/auth/login', credentials, 'Login');
  },

  async sendRequest(endpoint, requestData, action) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(requestData)
      });
    } catch {
      throw new Error(
        'Backend se connection nahi ho pa raha. Check karo ki Spring Boot server running hai.'
      );
    }

    const responseText = await response.text();
    let data = null;

    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned an invalid response. HTTP ${response.status}`
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `${action} failed. HTTP ${response.status}`
      );
    }

    if (!data) {
      throw new Error(
        `${action} failed: Backend returned an empty response.`
      );
    }

    return data;
  }
};

// Events APIs
export const eventService = {
  async getEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      return Array.isArray(data)
        ? data.map(formatBackendEvent)
        : [];
    } catch (error) {
      console.error('Events API error:', error);
      return [];
    }
  },

  async getEventById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`);

      if (!response.ok) {
        throw new Error('Event not found');
      }

      const data = await response.json();

      return data ? formatBackendEvent(data) : null;
    } catch (error) {
      console.error('Event details API error:', error);
      return null;
    }
  },

  async getTicketCategories(eventId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/ticket-categories`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch ticket categories');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Ticket Categories API error:', error);
    throw error;
  }
},

  async getMyBookings(email) {
    return bookingService.getMyBookings(email);
  }
};

// Booking APIs - connected to Spring Boot backend
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
    } catch {
      throw new Error(
        'Booking server se connect nahi ho pa raha. Backend check karo.'
      );
    }

    const responseText = await response.text();
    let data = null;

    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Backend ne invalid response diya.');
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `Booking failed. HTTP ${response.status}`
      );
    }

    if (!data) {
      throw new Error('Backend ne empty booking response diya.');
    }

    return data;
  },

  // Get logged-in user's bookings
  async getMyBookings(email) {
    if (!email) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/my?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch bookings. HTTP ${response.status}`
        );
      }

      const data = await response.json();

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('My Bookings API error:', error);
      throw error;
    }
  },

  // Cancel pending booking
  async cancelBooking(bookingId, email) {
    if (!bookingId || !email) {
      throw new Error('Booking ID aur user email required hain.');
    }

    let response;

    try {
      response = await fetch(
        `${API_BASE_URL}/bookings/${encodeURIComponent(bookingId)}/cancel?email=${encodeURIComponent(email)}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json'
          }
        }
      );
    } catch {
      throw new Error(
        'Cancellation server se connect nahi ho pa raha.'
      );
    }

    const responseText = await response.text();
    let data = null;

    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Backend ne invalid response diya.');
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `Cancellation failed. HTTP ${response.status}`
      );
    }

    return data;
  }
};

// Default export
const api = {
  authService,
  eventService,
  bookingService
};

export default api;

