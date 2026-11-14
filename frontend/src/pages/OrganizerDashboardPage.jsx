
import React, { useEffect, useState } from 'react';
import { organizerEventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  title: '',
  description: '',
  category: 'Music',
  city: '',
  venue: '',
  eventDate: '',
  startingPrice: '',
  imageUrl: '',
  featured: false
};

const OrganizerDashboardPage = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await organizerEventService.getMyEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Events load nahi ho paaye.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || '',
      description: event.description || '',
      category: event.category || 'Music',
      city: event.city || '',
      venue: event.venue || '',
      eventDate: event.date ? event.date.slice(0, 16) : '',
      startingPrice: event.price ?? '',
      imageUrl: event.image || '',
      featured: event.isFeatured || false
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.city.trim() ||
        !form.venue.trim() || !form.eventDate ||
        form.startingPrice === '') {
      setError('Please saari required details fill karo.');
      return;
    }

    const price = Number(form.startingPrice);

    if (!Number.isFinite(price) || price < 0) {
      setError('Valid ticket price enter karo.');
      return;
    }

    const eventData = {
      ...form,
      title: form.title.trim(),
      city: form.city.trim(),
      venue: form.venue.trim(),
      startingPrice: price,
      eventDate: form.eventDate.length === 16
        ? `${form.eventDate}:00`
        : form.eventDate
    };

    try {
      setSaving(true);

      if (editingId) {
        await organizerEventService.updateEvent(editingId, eventData);
      } else {
        await organizerEventService.createEvent(eventData);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await loadEvents();
    } catch (err) {
      setError(err.message || 'Event save nahi ho paaya.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
              Organizer Workspace
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome, {user?.name || 'Organizer'}!
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your events and create memorable experiences.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
          >
            + Create Event
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Total Events</p>
            <p className="mt-2 text-3xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Organizer Account</p>
            <p className="mt-2 break-all text-lg font-semibold">
              {user?.email}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-10 rounded-2xl border border-purple-500/30 bg-slate-900 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">
                {editingId ? 'Edit Event' : 'Create New Event'}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="text-slate-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                >
                  {['Music', 'Technology', 'Comedy', 'Sports', 'Arts', 'Business', 'Other'].map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  City *
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Venue *
                </label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="Venue name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Starting Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="startingPrice"
                  value={form.startingPrice}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="499"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Event Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="https://example.com/event-image.jpg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured" className="text-sm text-slate-300">
                  Mark as featured
                </label>
              </div>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-purple-600 px-7 py-3 font-semibold hover:bg-purple-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-white/20 px-7 py-3 text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Events</h2>

          <button
            onClick={loadEvents}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="py-12 text-center text-slate-400">
            Loading your events...
          </p>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 py-16 text-center">
            <h3 className="text-xl font-semibold">No events yet</h3>
            <p className="mt-2 text-slate-400">
              Create your first event to get started.
            </p>
            <button
              onClick={openCreateForm}
              className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <div
                key={event.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-purple-900 to-slate-800 text-4xl">
                    🎟️
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    {event.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    📍 {event.location}, {event.city}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    📅 {event.date ? new Date(event.date).toLocaleString() : 'Date not set'}
                  </p>

                  <p className="mt-3 font-semibold">
                    Starting at ₹{event.price}
                  </p>

                  <button
                    onClick={() => openEditForm(event)}
                    className="mt-5 w-full rounded-xl border border-purple-500/50 px-4 py-2.5 font-semibold text-purple-300 hover:bg-purple-500/10"
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
