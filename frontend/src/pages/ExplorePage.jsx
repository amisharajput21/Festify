import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Frown } from 'lucide-react';
import { EventCard } from '../components/EventCard.jsx';
import { eventService } from '../services/api.js';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockEvents.js';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const city = searchParams.get('city') || 'All Cities';
    const category = searchParams.get('category') || 'All';
    const sort = searchParams.get('sort') || 'featured';

    setSearchQuery(q);
    setSelectedCity(city);
    setSelectedCategory(category);
    setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const data = await eventService.getEvents({
          search: searchQuery,
          city: selectedCity,
          category: selectedCategory,
          sortBy,
        });
        setEvents(data);
      } catch (e) {
        console.error('Error fetching filtered events', e);
      } finally {
        setLoading(false);
      }
    }
    fetchFiltered();
  }, [searchQuery, selectedCity, selectedCategory, sortBy]);

  const updateFilters = (newQ, newCity, newCat, newSort) => {
    const params = new URLSearchParams();
    if (newQ) params.append('q', newQ);
    if (newCity && newCity !== 'All Cities') params.append('city', newCity);
    if (newCat && newCat !== 'All') params.append('category', newCat);
    if (newSort && newSort !== 'featured') params.append('sort', newSort);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedCategory('All');
    setSortBy('featured');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {/* Top Banner & Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Explore Live Events
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Discover experiences tailored to your city, music taste, and weekend plans
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#0d101d] p-4 sm:p-5 shadow-xl space-y-4">
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateFilters(e.target.value, selectedCity, selectedCategory, sortBy);
            }}
            placeholder="Search by event title, performer, stadium, or genre..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-hidden"
          />
        </div>

        {/* Row 2: Selectors & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          {/* City selector */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <MapPin className="h-4 w-4 text-pink-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                updateFilters(searchQuery, e.target.value, selectedCategory, sortBy);
              }}
              className="w-full bg-transparent text-xs font-medium text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="All Cities" className="bg-[#0d101d] text-white">
                All Cities
              </option>
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} className="bg-[#0d101d] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category selector */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Tag className="h-4 w-4 text-purple-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateFilters(searchQuery, selectedCity, e.target.value, sortBy);
              }}
              className="w-full bg-transparent text-xs font-medium text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="All" className="bg-[#0d101d] text-white">
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0d101d] text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <SlidersHorizontal className="h-4 w-4 text-purple-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value;
                setSortBy(val);
                updateFilters(searchQuery, selectedCity, selectedCategory, val);
              }}
              className="w-full bg-transparent text-xs font-medium text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="featured" className="bg-[#0d101d] text-white">
                Sort: Featured First
              </option>
              <option value="price_low" className="bg-[#0d101d] text-white">
                Price: Low to High
              </option>
              <option value="price_high" className="bg-[#0d101d] text-white">
                Price: High to Low
              </option>
              <option value="date" className="bg-[#0d101d] text-white">
                Event Date: Soonest
              </option>
            </select>
          </div>

          {/* Reset Action */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Result Count and Quick Filter Pills */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white tabular-nums">{events.length}</span> events
          {selectedCity !== 'All Cities' && (
            <span> in <strong className="text-purple-300">{selectedCity}</strong></span>
          )}
          {selectedCategory !== 'All' && (
            <span> under <strong className="text-pink-300">{selectedCategory}</strong></span>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#0d101d] p-12 text-center max-w-lg mx-auto my-12">
          <Frown className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-white">No Matching Events Found</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            We couldn’t find any events matching your filter combination. Try selecting a different city
            or clearing your search keyword.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
