import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  CreditCard,
  User,
  Mail,
  Phone,
  Ticket,
  ArrowLeft,
  Share2,
  ChevronRight,
  Info,
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
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Form fields for checkout
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await eventService.getEventById(id);
        if (data) {
          setEvent(data);
          if (data.ticketCategories.length > 0) {
            setSelectedTicketId(data.ticketCategories[0].id);
          }
        }
      } catch (e) {
        console.error('Error fetching event details', e);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!attendeeName) setAttendeeName(user.name);
      if (!attendeeEmail) setAttendeeEmail(user.email);
      if (!attendeePhone) setAttendeePhone(user.phone);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="mt-3 text-xs text-slate-400">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-white">Event Not Found</h2>
        <p className="mt-2 text-xs text-slate-400">The event you are looking for does not exist or has expired.</p>
        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const selectedCategory =
    event.ticketCategories.find((tc) => tc.id === selectedTicketId) ||
    event.ticketCategories[0];

  const subtotal = selectedCategory ? selectedCategory.price * quantity : 0;
  const bookingFee = Math.round(subtotal * 0.04);
  const totalAmount = subtotal + bookingFee;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!attendeeName || !attendeeEmail || !attendeePhone) {
      alert('Please fill in your contact details');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await bookTickets({
        eventId: event.id,
        ticketCategoryId: selectedCategory.id,
        quantity,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        paymentMethod,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setBookingConfirmed(booking);
      setIsCheckingOut(false);
    } catch (err) {
      console.error('Booking failed', err);
      alert('Booking could not be processed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <Link to="/explore" className="hover:text-white transition-colors">
          Explore
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-purple-300 truncate max-w-[200px]">{event.title}</span>
      </div>

      {/* Grid: Main Event Details (Left 7 cols) & Contiguous Purchase Module (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media & Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Hero Media Card */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0e1220] shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
                {event.category}
              </span>
              <span className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-pink-300 border border-pink-500/30">
                {event.city}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-slate-200 border border-white/10 hover:text-white hover:border-purple-500/50 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Event Header & Metadata */}
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-purple-400">
              By {event.artistOrHost} · Organized by {event.organizer}
            </p>

            {/* Event Key Info Strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-white/10 py-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Date</span>
                  <span className="font-semibold text-white">{event.displayDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4 text-pink-400 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Time & Duration</span>
                  <span className="font-semibold text-white">{event.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Info className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Age Policy</span>
                  <span className="font-semibold text-white">{event.ageRestriction}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="h-4 w-4 text-pink-400 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Language</span>
                  <span className="font-semibold text-white">{event.language}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Venue & Location Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0d101d] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                  Venue & Address
                </span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">
                  {event.venue}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {event.address}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* About The Event */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-white tracking-tight">
              About The Experience
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Event Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0d101d] p-6 space-y-3">
              <h3 className="font-heading text-base font-bold text-white">
                Event Highlights
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {event.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="text-xs text-slate-500 space-y-1.5 pt-4 border-t border-white/10">
            <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Important Terms & Guidelines
            </h4>
            <p>· Tickets are 100% verified and non-transferable once scanned at entry gate.</p>
            <p>· Government photo ID (Aadhaar, Passport, Voter ID, Driving License) is mandatory.</p>
            <p>· Outside food, beverages, and professional recording cameras are strictly prohibited.</p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0d101d] p-6 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Select Your Ticket Category
              </span>
              <h3 className="font-heading text-xl font-bold text-white mt-1">
                Tickets & Passes
              </h3>
            </div>

            {/* Ticket Categories List */}
            <div className="space-y-3">
              {event.ticketCategories.map((cat) => {
                const isSelected = cat.id === selectedTicketId;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedTicketId(cat.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-950/50'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500 text-white'
                              : 'border-slate-500 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-white tabular-nums">
                          ₹{cat.price.toLocaleString('en-IN')}
                        </span>
                        {cat.originalPrice && (
                          <span className="block text-[11px] text-slate-500 line-through tabular-nums">
                            ₹{cat.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Perks */}
                    {isSelected && cat.perks && (
                      <div className="mt-3 pt-3 border-t border-purple-500/20 space-y-1">
                        {cat.perks.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-purple-300">
                            <Check className="h-3 w-3 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div>
                <span className="block text-xs font-semibold text-white">Number of Tickets</span>
                <span className="text-[11px] text-slate-400">Max 10 passes per checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-white tabular-nums text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= 10}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>
                  Ticket Price ({quantity}x ₹{selectedCategory.price.toLocaleString('en-IN')})
                </span>
                <span className="text-white font-medium tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Convenience & Booking Fee (4% GST incl.)</span>
                <span className="text-white font-medium tabular-nums">
                  ₹{bookingFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-lg font-extrabold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsCheckingOut(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all cursor-pointer"
            >
              <Ticket className="h-4 w-4" />
              <span>Proceed to Book ({quantity} Tickets)</span>
            </button>

            {/* Trust markers */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Official ticketing partner · Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#0d101d] p-6 sm:p-8 shadow-2xl">
            <h2 className="font-heading text-xl font-bold text-white">Complete Ticket Booking</h2>
            <p className="text-xs text-slate-400 mt-1">
              {event.title} · {selectedCategory.name} ({quantity}x)
            </p>

            <form onSubmit={handleConfirmBooking} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Attendee Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                  <User className="h-4 w-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="Enter full legal name as per Govt ID"
                    className="w-full bg-transparent text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email for Tickets
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <Mail className="h-4 w-4 text-pink-400" />
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-transparent text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile Number (+91)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <Phone className="h-4 w-4 text-purple-400" />
                    <input
                      type="tel"
                      required
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    UPI (GPay / PhonePe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs flex justify-between items-center">
                <span className="text-slate-300">Total Payable Amount:</span>
                <span className="font-extrabold text-white text-base tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Ticket...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} & Confirm`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING CONFIRMATION POPUP */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-500/30 bg-[#0d101d] p-6 sm:p-8 shadow-2xl text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 mb-4">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-white">Booking Confirmed!</h2>
            <p className="mt-1 text-xs text-slate-300">
              Your tickets for <strong className="text-purple-300">{event.title}</strong> have been secured.
            </p>

            <div className="my-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Booking Reference</span>
                <span className="font-mono font-bold text-pink-400">{bookingConfirmed.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category & Qty</span>
                <span className="text-white font-medium">
                  {bookingConfirmed.ticketCategoryName} ({bookingConfirmed.quantity}x)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue & City</span>
                <span className="text-white font-medium">{event.venue}, {event.city}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                <span className="text-slate-300">Total Paid</span>
                <span className="text-white tabular-nums">₹{bookingConfirmed.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/my-tickets')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Ticket className="h-4 w-4" />
                <span>View Digital Pass in My Tickets</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingConfirmed(null)}
                className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Close & Browse More Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
