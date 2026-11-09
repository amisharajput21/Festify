
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Sparkles, ShieldCheck, Check,
  Plus, Minus, User, Mail, Phone, Ticket, ArrowLeft,
  Share2, ChevronRight, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { eventService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookTickets } = useTickets();

  const [event, setEvent] = useState(null);
  const [ticketCategories, setTicketCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '');

  useEffect(() => {
    let active = true;

    async function fetchEvent() {
      setLoading(true);
      setError('');

      try {
        const eventData = await eventService.getEventById(id);

        if (!eventData) {
          throw new Error('Event not found.');
        }

        const categories = await eventService.getTicketCategories(id);

        if (!active) return;

        setEvent(eventData);
        setTicketCategories(
          Array.isArray(categories) ? categories : []
        );

        if (categories.length > 0) {
          setSelectedTicketId(categories[0].id);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);

        if (active) {
          setError(err.message || 'Unable to load event details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchEvent();
    }

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.name || '');
      setAttendeeEmail(user.email || '');
      setAttendeePhone(user.phone || '');
    }
  }, [user]);

  const selectedCategory =
    ticketCategories.find(
      (category) => String(category.id) === String(selectedTicketId)
    ) || ticketCategories[0] || null;

  const unitPrice = Number(selectedCategory?.price || 0);
  const subtotal = unitPrice * quantity;

  // Backend calculates the final 4% booking fee.
  const bookingFee = Math.round(subtotal * 0.04 * 100) / 100;
  const totalAmount = subtotal + bookingFee;

  const availableSeats = Number(
    selectedCategory?.availableSeats || 0
  );

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  const formatEventDate = (date) => {
    if (!date) return 'Date to be announced';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      alert('Unable to copy link. Please copy the URL manually.');
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login before booking tickets.');
      setIsCheckingOut(false);
      return;
    }

    if (!selectedCategory) {
      alert('No ticket category is available for this event.');
      return;
    }

    if (quantity > availableSeats) {
      alert(`Only ${availableSeats} tickets are available.`);
      return;
    }

    if (!attendeeName.trim() || !attendeeEmail.trim() || !attendeePhone.trim()) {
      alert('Please fill in your contact details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await bookTickets({
        eventId: Number(event.id),
        ticketCategoryId: Number(selectedCategory.id),
        quantity,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        attendeePhone: attendeePhone.trim(),
        paymentMethod: 'NOT_REQUIRED'
      });

      setBookingConfirmed(booking);
      setIsCheckingOut(false);

      // Refresh available seats after successful booking.
      const updatedCategories =
        await eventService.getTicketCategories(id);

      setTicketCategories(updatedCategories);

      const updatedSelectedCategory = updatedCategories.find(
        (category) =>
          String(category.id) === String(selectedCategory.id)
      );

      if (updatedSelectedCategory) {
        setSelectedTicketId(updatedSelectedCategory.id);
      }

      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.message || 'Booking could not be processed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="mt-3 text-xs text-slate-400">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">
          Event Not Available
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {error || 'The event could not be found.'}
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>
      </div>
    );
  }

  const eventDate = formatEventDate(event.eventDate || event.date);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">

      <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/explore" className="hover:text-white">Explore</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[200px] truncate text-purple-300">
          {event.title}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

        {/* Event information */}
        <div className="space-y-8 lg:col-span-7">

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0e1220] shadow-2xl">

            {event.image || event.imageUrl ? (
              <img
                src={event.image || event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                <div className="text-center">
                  <Ticket className="mx-auto mb-2 h-12 w-12" />
                  <p className="text-sm">Event image not available</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d]/70 to-transparent pointer-events-none" />

            <div className="absolute left-4 top-4 flex gap-2">
              <span className="rounded-lg border border-purple-500/30 bg-black/60 px-3 py-1 text-xs font-semibold text-purple-300">
                {event.category || 'Event'}
              </span>
              <span className="rounded-lg border border-pink-500/30 bg-black/60 px-3 py-1 text-xs font-semibold text-pink-300">
                {event.city || 'India'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-2 text-sm font-semibold text-purple-400">
              {event.artistOrHost || event.category || 'Festify Event'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs sm:grid-cols-4">

              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Date</span>
                  <span className="font-semibold text-white">{eventDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4 shrink-0 text-pink-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Time</span>
                  <span className="font-semibold text-white">
                    {event.time || 'To be announced'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Info className="h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Age Policy</span>
                  <span className="font-semibold text-white">
                    {event.ageRestriction || 'Check event rules'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="h-4 w-4 shrink-0 text-pink-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Language</span>
                  <span className="font-semibold text-white">
                    {event.language || 'As per event'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d101d] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                  Venue & Address
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">
                  {event.venue || 'Venue to be announced'}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {event.address || event.city || ''}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              About The Event
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {event.description || 'Event details will be updated soon.'}
            </p>
          </div>

          {Array.isArray(event.highlights) && event.highlights.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0d101d] p-6">
              <h3 className="text-base font-bold text-white">
                Event Highlights
              </h3>
              {event.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  {highlight}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-500">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Important Terms & Guidelines
            </h4>
            <p>· Carry a valid government photo ID for entry.</p>
            <p>· Entry is subject to the event organiser's rules.</p>
            <p>· Booking remains pending until the payment process is introduced.</p>
          </div>
        </div>

        {/* Ticket booking panel */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[#0d101d] p-6 shadow-2xl">

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Select Your Ticket Category
              </span>
              <h3 className="mt-1 text-xl font-bold text-white">
                Tickets & Passes
              </h3>
            </div>

            {ticketCategories.length === 0 ? (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                Ticket categories are not available for this event yet.
              </div>
            ) : (
              <div className="space-y-3">
                {ticketCategories.map((category) => {
                  const isSelected =
                    String(category.id) === String(selectedTicketId);

                  return (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => {
                        setSelectedTicketId(category.id);
                        setQuantity(1);
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500 text-white'
                              : 'border-slate-500'
                          }`}>
                            {isSelected && <Check className="h-2.5 w-2.5" />}
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {category.name}
                            </h4>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {category.description || 'Event entry ticket'}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {category.availableSeats} seats available
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-base font-extrabold text-white">
                          ₹{formatAmount(category.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedCategory && (
              <>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <span className="block text-xs font-semibold text-white">
                      Number of Tickets
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Maximum 10 tickets per booking
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-6 text-center text-sm font-bold text-white">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={quantity >= Math.min(10, availableSeats)}
                      onClick={() => setQuantity((q) => Math.min(10, availableSeats, q + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Ticket Price ({quantity} × ₹{formatAmount(unitPrice)})</span>
                    <span className="font-medium text-white">
                      ₹{formatAmount(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Booking Fee (4%)</span>
                    <span className="font-medium text-white">
                      ₹{formatAmount(bookingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                    <span>Estimated Total</span>
                    <span className="text-lg">
                      ₹{formatAmount(totalAmount)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              disabled={!selectedCategory || availableSeats < 1}
              onClick={() => {
                if (!user) {
                  alert('Please login before booking tickets.');
                  return;
                }
                setIsCheckingOut(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Ticket className="h-4 w-4" />
              {availableSeats < 1 && selectedCategory
                ? 'Sold Out'
                : `Proceed to Book (${quantity} Tickets)`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Booking now · Payment not required yet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {isCheckingOut && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
          <div className="my-auto w-full max-w-lg rounded-3xl border border-white/15 bg-[#0d101d] p-6 shadow-2xl sm:p-8">

            <h2 className="text-xl font-bold text-white">
              Complete Your Booking
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {event.title} · {selectedCategory.name} ({quantity}x)
            </p>

            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-200">
              No payment will be collected now. Your booking will be saved with PENDING status.
            </div>

            <form onSubmit={handleConfirmBooking} className="mt-6 space-y-4">

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Attendee Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Mail className="h-4 w-4 text-pink-400" />
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <input
                    type="tel"
                    required
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Category</span>
                  <span className="text-white">{selectedCategory.name}</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-400">
                  <span>Quantity</span>
                  <span className="text-white">{quantity}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold text-white">
                  <span>Estimated Total (not paid)</span>
                  <span>₹{formatAmount(totalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-slate-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || quantity > availableSeats}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking result */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md">
          <div className="my-auto w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#0d101d] p-6 text-center shadow-2xl sm:p-8">

            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-400">
              <Check className="h-7 w-7" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Booking Created!
            </h2>

            <p className="mt-2 text-xs text-slate-300">
              Your booking request for{' '}
              <strong className="text-purple-300">{event.title}</strong>{' '}
              has been saved.
            </p>

            <div className="my-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs">

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Booking Reference</span>
                <span className="font-mono font-bold text-pink-400">
                  {bookingConfirmed.bookingId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Category & Quantity</span>
                <span className="font-medium text-white">
                  {bookingConfirmed.ticketCategoryName} ({bookingConfirmed.quantity}x)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Venue & City</span>
                <span className="text-right font-medium text-white">
                  {event.venue || 'TBA'}, {event.city || ''}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Booking Status</span>
                <span className="font-bold text-yellow-400">
                  {bookingConfirmed.status || 'PENDING'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status</span>
                <span className="font-bold text-yellow-400">
                  {bookingConfirmed.paymentStatus || 'PENDING'}
                </span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                <span className="text-slate-300">Amount Due</span>
                <span className="text-white">
                  ₹{formatAmount(bookingConfirmed.totalAmount)}
                </span>
              </div>
            </div>

            <p className="mb-4 text-xs text-yellow-300">
              Payment has not been collected. This booking is pending.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/my-tickets')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white"
              >
                <Ticket className="h-4 w-4" />
                View My Tickets
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingConfirmed(null);
                  navigate('/explore');
                }}
                className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-medium text-slate-400 hover:text-white"
              >
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
