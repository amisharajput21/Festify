import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  organizerApplicationService,
  adminEventService
} from '../services/api.js';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Organizer Applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState({});
  const [processingId, setProcessingId] = useState(null);

  // All Events
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // Pending Event Approval
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingEventsLoading, setPendingEventsLoading] = useState(true);
  const [pendingEventsError, setPendingEventsError] = useState('');
  const [eventReviewMessage, setEventReviewMessage] = useState('');
  const [eventProcessingId, setEventProcessingId] = useState(null);

  // Load Organizer Applications
  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data =
        await organizerApplicationService.getPendingApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Applications load nahi ho payi.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load All Events
  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError('');

    try {
      const data = await adminEventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setEventsError(err.message || 'Events load nahi ho paaye.');
    } finally {
      setEventsLoading(false);
    }
  }, []);

  // Load Pending Events
  const loadPendingEvents = useCallback(async () => {
    setPendingEventsLoading(true);
    setPendingEventsError('');

    try {
      const data = await adminEventService.getPendingEvents();
      setPendingEvents(data);
    } catch (err) {
      setPendingEventsError(
        err.message || 'Pending events load nahi ho paaye.'
      );
    } finally {
      setPendingEventsLoading(false);
    }
  }, []);

  // Load all dashboard data
  useEffect(() => {
    loadApplications();
    loadEvents();
    loadPendingEvents();
  }, [loadApplications, loadEvents, loadPendingEvents]);

  // Review Organizer Application
  const handleReview = async (applicationId, decision) => {
    const action = decision === 'APPROVED' ? 'approve' : 'reject';

    if (!window.confirm(`Kya aap application ${action} karna chahte hain?`)) {
      return;
    }

    setProcessingId(applicationId);
    setError('');
    setMessage('');

    try {
      await organizerApplicationService.reviewApplication(
        applicationId,
        decision,
        comments[applicationId] || ''
      );

      setApplications((previous) =>
        previous.filter((application) => application.id !== applicationId)
      );

      setMessage(
        decision === 'APPROVED'
          ? 'Application approved! User ab Organizer ban gaya hai.'
          : 'Application rejected successfully.'
      );
    } catch (err) {
      setError(err.message || 'Application review nahi ho paya.');
    } finally {
      setProcessingId(null);
    }
  };

  // Review Event
  const handleEventReview = async (eventId, decision) => {
    const action = decision === 'APPROVED' ? 'approve' : 'reject';

    if (!window.confirm(`Kya aap is event ko ${action} karna chahte hain?`)) {
      return;
    }

    setEventProcessingId(eventId);
    setPendingEventsError('');
    setEventReviewMessage('');

    try {
      if (decision === 'APPROVED') {
        await adminEventService.approveEvent(eventId);
        setEventReviewMessage('Event approved! Ab event public ho sakta hai.');
      } else {
        await adminEventService.rejectEvent(eventId);
        setEventReviewMessage('Event rejected successfully.');
      }

      // Remove reviewed event from pending list
      setPendingEvents((previous) =>
        previous.filter((event) => event.id !== eventId)
      );

      // Refresh events list
      await loadEvents();
    } catch (err) {
      setPendingEventsError(
        err.message || 'Event review nahi ho paya.'
      );
    } finally {
      setEventProcessingId(null);
    }
  };

  // Format Event Date
  const formatEventDate = (date) => {
    if (!date) return 'Not specified';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white p-6 md:p-8">

      {/* Dashboard Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Festify Admin Dashboard
          </h1>
          <p className="mt-3 text-slate-400">
            Welcome, {user?.name || 'Admin'}
          </p>
        </div>

        <button
          onClick={loadApplications}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
        >
          {loading ? 'Loading...' : 'Refresh Applications'}
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-slate-400 mt-2">
            Manage platform users
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Events</h2>
          <p className="text-3xl font-bold mt-3">{events.length}</p>
          <p className="text-slate-400 mt-2">Total events on Festify</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">
            Organizer Applications
          </h2>
          <p className="text-slate-400 mt-2">
            {applications.length} pending application(s)
          </p>
        </div>
      </div>

      {/* Pending Events Approval */}
      <section className="mt-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold">
              Pending Events Approval
            </h2>
            <p className="text-slate-400 mt-1">
              Review events submitted by organizers before publishing.
            </p>
          </div>

          <button
            onClick={loadPendingEvents}
            disabled={pendingEventsLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
          >
            {pendingEventsLoading ? 'Loading...' : 'Refresh Pending Events'}
          </button>
        </div>

        {eventReviewMessage && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 p-4 rounded-lg mb-5">
            {eventReviewMessage}
          </div>
        )}

        {pendingEventsError && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg mb-5">
            {pendingEventsError}
          </div>
        )}

        {pendingEventsLoading ? (
          <p className="text-slate-400">
            Pending events load ho rahe hain...
          </p>
        ) : pendingEvents.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-xl text-center">
            <h3 className="text-xl font-semibold">
              No Pending Events
            </h3>
            <p className="text-slate-400 mt-2">
              Abhi review ke liye koi event pending nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-slate-900 border border-yellow-700/40 p-6 rounded-xl"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="text-xl font-semibold">
                    {event.title || 'Untitled Event'}
                  </h3>

                  <span className="bg-yellow-900/40 text-yellow-300 px-3 py-1 rounded-full text-sm h-fit">
                    PENDING
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Event ID:</span>{' '}
                    {event.id}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Category:</span>{' '}
                    {event.category || 'Not specified'}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Location:</span>{' '}
                    {event.location || event.venue || event.city || 'Not specified'}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Date:</span>{' '}
                    {formatEventDate(event.date || event.eventDate)}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Starting Price:</span>{' '}
                    {event.price != null ? `₹${event.price}` : 'Not specified'}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Organizer:</span>{' '}
                    {event.organizer?.name || event.organizerName || 'Not available'}
                  </p>
                </div>

                {event.description && (
                  <p className="text-slate-400 mt-4 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => handleEventReview(event.id, 'APPROVED')}
                    disabled={eventProcessingId === event.id}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
                  >
                    {eventProcessingId === event.id
                      ? 'Processing...'
                      : 'Approve Event'}
                  </button>

                  <button
                    onClick={() => handleEventReview(event.id, 'REJECTED')}
                    disabled={eventProcessingId === event.id}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
                  >
                    Reject Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Events */}
      <section className="mt-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold">All Events</h2>
            <p className="text-slate-400 mt-1">
              Manage and review all events on Festify
            </p>
          </div>

          <button
            onClick={loadEvents}
            disabled={eventsLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
          >
            {eventsLoading ? 'Loading...' : 'Refresh Events'}
          </button>
        </div>

        {eventsError && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg mb-5">
            {eventsError}
          </div>
        )}

        {eventsLoading ? (
          <p className="text-slate-400">Events load ho rahe hain...</p>
        ) : events.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-xl text-center">
            <h3 className="text-xl font-semibold">No Events Found</h3>
            <p className="text-slate-400 mt-2">
              Abhi platform par koi event available nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="text-xl font-semibold">
                    {event.title || 'Untitled Event'}
                  </h3>

                  <span className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full text-sm h-fit">
                    {event.category || 'Event'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Event ID:</span> {event.id}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Location:</span>{' '}
                    {event.location || event.venue || event.city || 'Not specified'}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Date:</span>{' '}
                    {formatEventDate(event.date || event.eventDate)}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Price:</span>{' '}
                    {event.price != null ? `₹${event.price}` : 'Not specified'}
                  </p>

                  <p className="text-slate-300">
                    <span className="text-slate-400">Organizer:</span>{' '}
                    {event.organizer?.name || event.organizerName || 'Not available'}
                  </p>
                </div>

                {event.description && (
                  <p className="text-slate-400 mt-4 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="mt-5">
                  <a
                    href={`/event/${event.id}`}
                    className="inline-block bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    View Event
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Organizer Applications */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Pending Organizer Applications
        </h2>

        {message && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 p-4 rounded-lg mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-400">Applications load ho rahi hain...</p>
        ) : applications.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-xl text-center">
            <h3 className="text-xl font-semibold">
              No Pending Applications
            </h3>
            <p className="text-slate-400 mt-2">
              Abhi review ke liye koi organizer application nahi hai.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {application.userName}
                    </h3>
                    <p className="text-slate-400 mt-1">
                      {application.userEmail}
                    </p>
                  </div>

                  <span className="text-yellow-300 bg-yellow-900/30 px-3 py-1 rounded-full text-sm h-fit">
                    {application.status}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-slate-400 text-sm mb-2">
                    Application Reason
                  </p>
                  <p className="text-slate-200 whitespace-pre-wrap">
                    {application.reason}
                  </p>
                </div>

                <div className="mt-5">
                  <label className="block text-sm text-slate-400 mb-2">
                    Admin Comment (Optional)
                  </label>

                  <textarea
                    value={comments[application.id] || ''}
                    onChange={(event) =>
                      setComments((previous) => ({
                        ...previous,
                        [application.id]: event.target.value
                      }))
                    }
                    placeholder="Write a review comment..."
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() =>
                      handleReview(application.id, 'APPROVED')
                    }
                    disabled={processingId === application.id}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
                  >
                    {processingId === application.id
                      ? 'Processing...'
                      : 'Approve'}
                  </button>

                  <button
                    onClick={() =>
                      handleReview(application.id, 'REJECTED')
                    }
                    disabled={processingId === application.id}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}