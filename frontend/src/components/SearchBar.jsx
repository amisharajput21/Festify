import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, ArrowRight } from 'lucide-react';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockEvents.js';

export const SearchBar = ({
  initialSearch = '',
  initialCity = '',
  initialCategory = '',
  onSearchSubmit,
  variant = 'hero',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(search, city, category);
    } else {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (city && city !== 'All Cities') params.append('city', city);
      if (category && category !== 'All Categories') params.append('category', category);
      navigate(`/explore?${params.toString()}`);
    }
  };

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-white/10 bg-[#0e1220]/90 p-2 shadow-xl backdrop-blur-md"
      >
        <div className="flex flex-1 items-center gap-2 px-3 py-1.5 w-full">
          <Search className="h-4 w-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
          <MapPin className="h-4 w-4 text-pink-400 shrink-0" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="" className="bg-[#0e1220] text-slate-200">
              All Cities
            </option>
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c} className="bg-[#0e1220] text-slate-200">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
          <Tag className="h-4 w-4 text-purple-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="" className="bg-[#0e1220] text-slate-200">
              All Categories
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0e1220] text-slate-200">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:opacity-95 transition-all"
        >
          <span>Search</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    );
  }

  // Hero Variant
  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0e1322]/95 p-3 shadow-2xl backdrop-blur-xl transition-all focus-within:border-purple-500/50"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Keyword Search */}
        <div className="md:col-span-5 flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04]">
          <Search className="h-5 w-5 text-purple-400 shrink-0" />
          <div className="flex-1 text-left">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              What are you looking for?
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Artist, concert, festival, comedy..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-hidden font-medium"
            />
          </div>
        </div>

        {/* City Filter */}
        <div className="md:col-span-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04]">
          <MapPin className="h-5 w-5 text-pink-400 shrink-0" />
          <div className="flex-1 text-left">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Location
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="" className="bg-[#0e1322] text-slate-200">
                All India (8 Cities)
              </option>
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} className="bg-[#0e1322] text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04]">
          <Tag className="h-5 w-5 text-purple-400 shrink-0" />
          <div className="flex-1 text-left">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="" className="bg-[#0e1322] text-slate-200">
                All
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0e1322] text-slate-200">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 hover:shadow-purple-600/50 transition-all cursor-pointer"
          >
            <span>Find Events</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
