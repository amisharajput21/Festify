
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Automatically attach JWT token to authenticated requests.
const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('festify_token');

  return {
    Accept: 'application/json',
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

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

// Booking APIs
export const bookingService = {
  async createBooking(bookingData) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
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

  async getMyBookings(email) {
    if (!email) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/my?email=${encodeURIComponent(email)}`,
        {
          headers: getAuthHeaders()
        }
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
          headers: getAuthHeaders()
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

// Admin Event Management APIs
export const adminEventService = {
  // Fetch all public/approved events
  async getAllEvents() {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/events`, {
        headers: getAuthHeaders()
      });
    } catch {
      throw new Error('Backend se events fetch nahi ho pa rahe.');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to fetch events. HTTP ${response.status}`
      );
    }

    return Array.isArray(data)
      ? data.map(formatBackendEvent)
      : [];
  },

  // Fetch pending events awaiting admin approval
  async getPendingEvents() {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/admin/events/pending`, {
        headers: getAuthHeaders()
      });
    } catch {
      throw new Error('Pending events fetch nahi ho pa rahe.');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to fetch pending events. HTTP ${response.status}`
      );
    }

    return Array.isArray(data)
      ? data.map(formatBackendEvent)
      : [];
  },

  // Approve a pending event
  async approveEvent(eventId) {
    let response;

    try {
      response = await fetch(
        `${API_BASE_URL}/admin/events/${eventId}/approve`,
        {
          method: 'PUT',
          headers: getAuthHeaders()
        }
      );
    } catch {
      throw new Error(
        'Event approve karte waqt backend se connection fail hua.'
      );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Event approval failed. HTTP ${response.status}`
      );
    }

    return data ? formatBackendEvent(data) : null;
  },

  // Reject a pending event
  async rejectEvent(eventId) {
    let response;

    try {
      response = await fetch(
        `${API_BASE_URL}/admin/events/${eventId}/reject`,
        {
          method: 'PUT',
          headers: getAuthHeaders()
        }
      );
    } catch {
      throw new Error(
        'Event reject karte waqt backend se connection fail hua.'
      );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Event rejection failed. HTTP ${response.status}`
      );
    }

    return data ? formatBackendEvent(data) : null;
  }
};

// Admin Organizer Application APIs
export const organizerApplicationService = {
  async getPendingApplications() {
    const response = await fetch(
      `${API_BASE_URL}/organizer-applications/admin/pending`,
      {
        headers: getAuthHeaders()
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to fetch applications. HTTP ${response.status}`
      );
    }

    return Array.isArray(data) ? data : [];
  },

  async submitApplication(reason) {
    const response = await fetch(
      `${API_BASE_URL}/organizer-applications`,
      {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ reason })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Application submission failed. HTTP ${response.status}`
      );
    }

    return data;
  },

  async reviewApplication(applicationId, decision, adminComment = '') {
    const response = await fetch(
      `${API_BASE_URL}/organizer-applications/admin/${applicationId}/review`,
      {
        method: 'PUT',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          decision,
          adminComment
        })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Application review failed. HTTP ${response.status}`
      );
    }

    return data;
  }
};

// Organizer Event APIs
export const organizerEventService = {
  async getMyEvents() {
    const response = await fetch(`${API_BASE_URL}/organizer/events`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch organizer events. HTTP ${response.status}`
      );
    }

    const data = await response.json();

    return Array.isArray(data)
      ? data.map(formatBackendEvent)
      : [];
  },

  async createEvent(eventData) {
    const response = await fetch(`${API_BASE_URL}/organizer/events`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(eventData)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Event creation failed. HTTP ${response.status}`
      );
    }

    return formatBackendEvent(data);
  },

  async updateEvent(eventId, eventData) {
    const response = await fetch(
      `${API_BASE_URL}/organizer/events/${eventId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(eventData)
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || `Event update failed. HTTP ${response.status}`
      );
    }

    return formatBackendEvent(data);
  }
};

// Export all API services
const api = {
  authService,
  eventService,
  bookingService,
  organizerEventService,
  organizerApplicationService,
  adminEventService
};

export default api;
