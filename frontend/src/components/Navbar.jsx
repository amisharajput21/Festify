import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Menu, X, Sparkles, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { POPULAR_CITIES } from '../data/mockEvents.js';

export const Navbar = ({ selectedCity, onSelectCity }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { bookings } = useTickets();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeTicketsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07080d]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/"
            className="group flex items-center gap-2 text-xl font-extrabold tracking-tight text-white whitespace-nowrap"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shadow-purple-600/30 group-hover:opacity-95 transition-opacity">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-heading text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FESTIFY
            </span>
          </Link>

          {/* Quick City Selector on Desktop */}
          {onSelectCity && (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-purple-500/40 hover:text-white transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-pink-400" />
                <span>{selectedCity || 'All India'}</span>
              </button>

              {cityDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#0d101d] py-1.5 shadow-2xl backdrop-blur-lg z-50"
                  onMouseLeave={() => setCityDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCity('All Cities');
                      setCityDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                  >
                    All Cities
                  </button>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        onSelectCity(c);
                        setCityDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`whitespace-nowrap transition-colors hover:text-white ${
              isActive('/') ? 'text-purple-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`whitespace-nowrap transition-colors hover:text-white ${
              isActive('/explore') ? 'text-purple-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/my-tickets"
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
              isActive('/my-tickets') ? 'text-purple-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>My Tickets</span>
            {activeTicketsCount > 0 && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                {activeTicketsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-2.5 pr-3 text-xs font-medium text-slate-200 hover:border-purple-500/40 hover:bg-white/10 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-[11px] font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#0d101d] p-2 shadow-2xl backdrop-blur-xl z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-purple-400 mt-0.5">{user.city || 'India'}</p>
                  </div>
                  <Link
                    to="/my-tickets"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                  >
                    <Ticket className="h-3.5 w-3.5 text-pink-400" />
                    <span>My Booked Tickets</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0b12] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              isActive('/') ? 'bg-purple-600/20 text-purple-300' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              isActive('/explore') ? 'bg-purple-600/20 text-purple-300' : 'text-slate-300'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/my-tickets"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
              isActive('/my-tickets') ? 'bg-purple-600/20 text-purple-300' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span>My Tickets</span>
            </span>
            {activeTicketsCount > 0 && (
              <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs font-bold text-white">
                {activeTicketsCount}
              </span>
            )}
          </Link>

          {!isAuthenticated && (
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="flex-1 rounded-lg border border-white/10 py-2 text-center text-xs font-medium text-slate-200"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-2 text-center text-xs font-semibold text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
