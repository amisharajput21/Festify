import React from 'react';
import { MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockEvents.js';

export const CityFilter = ({ selectedCity, onSelectCity }) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        <button
          type="button"
          onClick={() => onSelectCity('All Cities')}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCity === 'All Cities' || !selectedCity
              ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <MapPin className="h-3.5 w-3.5 text-purple-400" />
          <span>All India</span>
        </button>

        {POPULAR_CITIES.map((city) => {
          const isActive = selectedCity === city;
          return (
            <button
              key={city}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'border-pink-500 bg-pink-500/20 text-white font-semibold shadow-sm'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
};
