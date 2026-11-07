import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { CategoryFilter } from '../components/CategoryFilter.jsx';
import { eventService } from '../services/api.js';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockEvents.js';

export const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const events = await eventService.getEvents({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        });
        setFeaturedEvents(events);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background ambient mesh & glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] max-w-full rounded-full bg-gradient-to-tr from-purple-700/25 via-pink-600/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Subtle quiet kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            <span>India’s Leading Live Event & Festival Platform</span>
          </div>

          {/* Mandatory Hero Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] text-balance">
            Discover Events.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Create Memories.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Book passes for stadium concerts, stand-up comedy, music festivals,
            food carnivals, and late-night underground DJ gigs across 8 major Indian cities.
          </p>

          {/* Search Bar */}
          <div className="mt-10 w-full flex justify-center">
            <SearchBar variant="hero" />
          </div>

          {/* Quick Popular Cities Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-pink-400" />
              Popular Cities:
            </span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => navigate(`/explore?city=${city}`)}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white transition-all cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Trust / Metric Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border-y border-white/10 py-6 text-slate-300 text-xs sm:text-sm">
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl font-bold text-white tabular-nums">150+</span>
              <span className="text-slate-400 text-xs">Live Experiences</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl font-bold text-white tabular-nums">8 Cities</span>
              <span className="text-slate-400 text-xs">Across India</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl font-bold text-white tabular-nums">100%</span>
              <span className="text-slate-400 text-xs">Verified Passes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl font-bold text-white tabular-nums">Instant</span>
              <span className="text-slate-400 text-xs">QR Digital Tickets</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="py-12 md:py-16 bg-[#0a0c14] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Live Events
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Top-rated concerts, festivals and performances selling fast in India
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors shrink-0"
            >
              <span>View All Events</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="mb-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/10"
                />
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 6).map((event, idx) => (
                <EventCard key={event.id} event={event} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-slate-400 text-sm">No events found in this category.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-3 text-xs font-semibold text-purple-400 hover:underline"
              >
                Reset to All Events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CURATED CATEGORIES SHOWCASE */}
      <section className="py-16 md:py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400 mb-2">
              <Compass className="h-4 w-4" />
              <span>Explore By Mood</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-white tracking-tight">
              Curated Event Categories
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Whatever your vibe, find unforgettable live experiences curated for you
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/explore?category=${cat.id}`)}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 bg-[#0d101d] hover:border-purple-500/50 hover:bg-gradient-to-b hover:from-[#13172c] hover:to-[#171128] transition-all hover:-translate-y-1 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400 group-hover:bg-gradient-to-tr group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all mb-3 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-white group-hover:text-purple-300">
                  {cat.label}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">Explore</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CITY HIGHLIGHT BANNER */}
      <section className="py-12 border-t border-white/5 bg-gradient-to-r from-purple-950/40 via-[#0a0c14] to-pink-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-8 sm:p-10 backdrop-blur-md">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                Major Metropolitan Hubs
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                Live Entertainment in Every Corner of India
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Whether you’re in Mumbai catching a stadium tour, in Delhi for an open-air carnival,
                or enjoying rooftop nightlife in Bengaluru, Festify brings you verified tickets with zero hassle.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => navigate(`/explore?city=${c}`)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-pink-500 hover:text-white transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <ShieldCheck className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">Genuine Passes</h4>
                <p className="text-[11px] text-slate-400 mt-1">Direct from official event promoters</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <Zap className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">Instant QR Entry</h4>
                <p className="text-[11px] text-slate-400 mt-1">Tap-and-enter at venue turnstiles</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
