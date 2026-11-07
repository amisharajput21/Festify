import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

export const EventCard = ({ event, priority = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d101d] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/40">
      {/* Event Image Container (65% visual weight) */}
      <Link to={`/event/${event.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-[#151928]">
        {!imageError ? (
          <img
            src={event.image}
            alt={event.title}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#12162a] via-[#1a1130] to-[#251025] p-6 text-center">
            <Sparkles className="h-8 w-8 text-purple-400 mb-2 opacity-80" />
            <span className="text-xs font-semibold text-slate-300">{event.category}</span>
          </div>
        )}

        {/* Ambient Dark Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d101d] via-[#0d101d]/20 to-transparent opacity-80" />

        {/* Quiet Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-purple-500/30">
            {event.category}
          </span>
          {event.featured && (
            <span className="text-[11px] font-medium text-pink-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-pink-500/30">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Metadata line: City · Date (Zero-Pill discipline: unboxed clean text) */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-pink-400 shrink-0" />
              <span>{event.city}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>{event.displayDate}</span>
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
            <Link to={`/event/${event.id}`}>
              {event.title}
            </Link>
          </h3>

          {/* Venue & Artist */}
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-1">
            {event.venue}
          </p>
        </div>

        {/* Footer: Price baseline and Book action */}
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              Starts From
            </span>
            <span className="text-base font-extrabold text-white tabular-nums">
              ₹{event.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to={`/event/${event.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:shadow-md hover:shadow-purple-600/30 transition-all"
          >
            <span>Book Tickets</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
