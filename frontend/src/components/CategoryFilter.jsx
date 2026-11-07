import React from 'react';
import { Music, Mic2, Sparkles, Smile, Trophy, BookOpen, Moon, Compass } from 'lucide-react';
import { CATEGORIES } from '../data/mockEvents.js';

const ICON_MAP = {
  All: <Compass className="h-4 w-4" />,
  Music: <Music className="h-4 w-4" />,
  Concerts: <Mic2 className="h-4 w-4" />,
  Festivals: <Sparkles className="h-4 w-4" />,
  Comedy: <Smile className="h-4 w-4" />,
  Sports: <Trophy className="h-4 w-4" />,
  Workshops: <BookOpen className="h-4 w-4" />,
  Nightlife: <Moon className="h-4 w-4" />,
};

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'All' || !selectedCategory
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          {ICON_MAP.All}
          <span>All Events</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {ICON_MAP[cat.id] || <Sparkles className="h-4 w-4" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
