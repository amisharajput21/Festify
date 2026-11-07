import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { POPULAR_CITIES, CATEGORIES } from '../data/mockEvents.js';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#06070b] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md shadow-purple-600/30">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                FESTIFY
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India’s premier live event discovery and ticket booking platform.
              From high-octane stadium concerts to intimate acoustic nights,
              comedy specials, and vibrant food & cultural carnivals.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span>Frontend for Java 21 Spring Boot + MySQL API</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Event Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/explore?category=${cat.id}`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Top Cities
            </h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_CITIES.map((city) => (
                <li key={city}>
                  <Link
                    to={`/explore?city=${city}`}
                    className="hover:text-pink-400 transition-colors"
                  >
                    Events in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Festify Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  All Live Events
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="hover:text-white transition-colors">
                  View My Tickets
                </Link>
              </li>
              <li>
                <span className="text-slate-400">100% Verified QR Passes</span>
              </li>
              <li>
                <span className="text-slate-400">Zero Cancellation Fraud</span>
              </li>
              <li>
                <span className="text-slate-400">24x7 Festival Concierge</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FESTIFY India Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            <span>for live music & culture enthusiasts across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
