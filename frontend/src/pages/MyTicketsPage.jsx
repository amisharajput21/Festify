
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Share2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Printer,
  Clock,
  XCircle
} from 'lucide-react';

import { useTickets } from '../context/TicketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const MyTicketsPage = () => {
  const { bookings, loading, cancelTicket } = useTickets();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const displayedBookings = bookings.filter((booking) => {
    if (filterStatus === 'ALL') return true;
    return booking.status === filterStatus;
  });

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Event date not available';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Event date not available';
    }

    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareBooking = async (bookingId) => {
    try {
      const text = `My Festify booking reference: ${bookingId}`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedId(bookingId);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        setActionError('Clipboard is not available in this browser.');
      }
    } catch {
      setActionError('Booking reference copy nahi ho paya.');
    }
  };

  const handleCancel = async (bookingId) => {
    const ok = window.confirm(
      'Are you sure you want to cancel this unpaid booking? Available seats will be released.'
    );

    if (!ok) return;

    setActionError('');
    setCancellingId(bookingId);

    try {
      await cancelTicket(bookingId);
    } catch (error) {
      setActionError(
        error.message || 'Booking cancel nahi ho payi. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusDetails = (booking) => {
    const status = booking.status?.toUpperCase();
    const paymentStatus = booking.paymentStatus?.toUpperCase();

    if (status === 'CANCELLED') {
      return {
        label: 'Cancelled',
        description: 'This booking has been cancelled.',
        color: 'text-rose-400',
        icon: XCircle
      };
    }

    if (status === 'CONFIRMED' && paymentStatus === 'PAID') {
      return {
        label: 'Confirmed',
        description: 'Payment verified successfully.',
        color: 'text-emerald-400',
        icon: CheckCircle2
      };
    }

    if (status === 'PENDING') {
      return {
        label: 'Payment Pending',
        description: 'Your booking is not a confirmed ticket yet.',
        color: 'text-amber-400',
        icon: AlertCircle
      };
    }

    return {
      label: 'Awaiting Verification',
      description: 'Booking confirmation is awaiting payment verification.',
      color: 'text-amber-400',
      icon: Clock
    };
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
            {user ? `Welcome back, ${user.name}! ` : ''}
            Manage your event bookings and reservations.
          </p>
        </div>

        {/* Booking Filters */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10 self-start sm:self-auto">
          {[
            { value: 'ALL', label: 'All Bookings' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'CANCELLED', label: 'Cancelled' }
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setFilterStatus(filter.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === filter.value
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {actionError && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {actionError}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">
            Loading your bookings...
          </p>
        </div>
      ) : displayedBookings.length > 0 ? (
        <div className="space-y-6">
          {displayedBookings.map((booking) => {
            const statusDetails = getStatusDetails(booking);
            const StatusIcon = statusDetails.icon;

            const isPending =
              booking.status?.toUpperCase() === 'PENDING' &&
              booking.paymentStatus?.toUpperCase() === 'PENDING';

            const isPaid =
              booking.paymentStatus?.toUpperCase() === 'PAID';

            return (
              <div
                key={booking.bookingId}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d101d] transition-all hover:border-purple-500/40 shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

                  {/* Left Column */}
                  <div className="lg:col-span-4 relative min-h-[200px] overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Ticket className="h-32 w-32 text-purple-300" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d101d] via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-purple-300 border border-purple-500/30">
                        {booking.ticketCategoryName || 'Event Ticket'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        Booking ID
                      </span>
                      <p className="font-mono text-sm font-bold text-white tracking-widest break-all">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${statusDetails.color}`} />

                        <span className={`text-[11px] font-semibold ${statusDetails.color}`}>
                          {statusDetails.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mb-3">
                        {statusDetails.description}
                      </p>

                      <h2 className="font-heading text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        <Link to={`/event/${booking.eventId}`}>
                          {booking.eventTitle || 'Festify Event'}
                        </Link>
                      </h2>

                      <div className="mt-4 space-y-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                          <span>
                            Booking created: {formatDate(booking.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                          <span>
                            Event venue details will be available with event information.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">
                          Attendee
                        </span>
                        <span className="font-semibold text-white">
                          {booking.attendeeName || 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">
                          Quantity
                        </span>
                        <span className="font-semibold text-white tabular-nums">
                          {booking.quantity || 0} Pass(es)
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">
                          {isPaid ? 'Total Paid' : 'Amount Due'}
                        </span>
                        <span className="font-semibold text-white tabular-nums">
                          ₹{formatAmount(booking.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-3 p-6 flex flex-col items-center justify-between bg-white/[0.01]">
                    <div className="text-center w-full">
                      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <div>
                          <Ticket className="h-10 w-10 text-purple-400 mx-auto" />
                          <p className="mt-2 text-[10px] text-slate-400">
                            {isPaid
                              ? 'Payment received'
                              : 'Not an entry pass'}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        {isPaid
                          ? 'Ticket verification required'
                          : 'E-ticket available after verified payment'}
                      </p>
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/30 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print Booking Details</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleShareBooking(booking.bookingId)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Share2 className="h-3 w-3" />
                          <span>
                            {copiedId === booking.bookingId ? 'Copied' : 'Share'}
                          </span>
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            disabled={cancellingId === booking.bookingId}
                            onClick={() => handleCancel(booking.bookingId)}
                            className="flex-1 rounded-xl border border-rose-500/20 bg-rose-500/10 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === booking.bookingId
                              ? 'Cancelling...'
                              : 'Cancel'}
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

          <h2 className="font-heading text-xl font-bold text-white">
            No Bookings Found
          </h2>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            No bookings found in this category. Explore upcoming concerts,
            comedy specials, and music festivals.
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
