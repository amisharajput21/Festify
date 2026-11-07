import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Share2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { useTickets } from '../context/TicketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const MyTicketsPage = () => {
  const { bookings, loading, cancelTicket } = useTickets();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const displayedBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShareBooking = (bookingId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`My Festify Ticket Pass: Booking #${bookingId}`);
      setCopiedId(bookingId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleCancel = async (bookingId) => {
    const ok = window.confirm('Are you sure you want to cancel this booking? This will revoke the entry pass.');
    if (ok) {
      await cancelTicket(bookingId);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Ticket className="h-4 w-4" />
            <span>Passes & Reservations</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            My Tickets
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {user ? `Welcome back, ${user.name}! ` : ''}Manage your live event passes and QR entry codes
          </p>
        </div>

        {/* Filter segment */}
        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'ALL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Passes
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('CONFIRMED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'CONFIRMED'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('CANCELLED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'CANCELLED'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">Loading your passes...</p>
        </div>
      ) : displayedBookings.length > 0 ? (
        <div className="space-y-6">
          {displayedBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div
                key={booking.bookingId}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d101d] transition-all hover:border-purple-500/40 shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Left Column: Event Artwork & Quick Meta */}
                  <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto min-h-[200px] overflow-hidden bg-slate-900">
                    <img
                      src={booking.eventImage}
                      alt={booking.eventTitle}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d101d] via-black/40 to-transparent" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-purple-300 border border-purple-500/30">
                        {booking.category}
                      </span>
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-pink-300 border border-pink-500/30">
                        {booking.city}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        Booking ID
                      </span>
                      <p className="font-mono text-sm font-bold text-white tracking-widest">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Details, Venue & Schedule */}
                  <div className="lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Confirmed & Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Cancelled</span>
                          </span>
                        )}
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400 font-medium">
                          {booking.ticketCategoryName}
                        </span>
                      </div>

                      <h2 className="font-heading text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        <Link to={`/event/${booking.eventId}`}>{booking.eventTitle}</Link>
                      </h2>

                      <div className="mt-4 space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                          <span>{booking.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-pink-400 shrink-0" />
                          <span>{booking.eventTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                          <span className="line-clamp-1">{booking.venue}, {booking.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Attendee</span>
                        <span className="font-semibold text-white">{booking.attendeeName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Quantity</span>
                        <span className="font-semibold text-white tabular-nums">{booking.quantity} Pass(es)</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Total Paid</span>
                        <span className="font-semibold text-white tabular-nums">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: QR Gate Pass & Action buttons */}
                  <div className="lg:col-span-3 p-6 flex flex-col items-center justify-between bg-white/[0.01]">
                    <div className="text-center w-full">
                      <div className="relative mx-auto inline-block rounded-2xl bg-white p-2.5 shadow-md">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingId}-${booking.city}-FESTIFY`}
                          alt="Turnstile QR Pass"
                          className="h-28 w-28 object-contain"
                        />
                      </div>
                      <p className="mt-2 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        Scan at entry turnstile
                      </p>
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/30 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print Pass / PDF</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleShareBooking(booking.bookingId)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Share2 className="h-3 w-3" />
                          <span>{copiedId === booking.bookingId ? 'Copied' : 'Share'}</span>
                        </button>
                        {isConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking.bookingId)}
                            className="flex-1 rounded-xl border border-rose-500/20 bg-rose-500/10 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#0d101d] p-12 text-center max-w-md mx-auto my-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 mx-auto mb-4">
            <Ticket className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-xl font-bold text-white">No Tickets Found</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            You don’t have any event bookings yet. Discover upcoming concerts, comedy specials, and music festivals today!
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:opacity-95 transition-opacity"
          >
            <span>Explore Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
