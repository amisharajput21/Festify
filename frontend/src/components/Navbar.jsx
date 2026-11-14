
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ticket,
  Menu,
  X,
  Sparkles,
  MapPin,
  LogOut
} from 'lucide-react';

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

  const activeTicketsCount = bookings.filter(
    (b) => b.status === 'CONFIRMED'
  ).length;

  const isActive = (path) => location.pathname === path;

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCityDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07080d]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/"
            onClick={closeMenus}
            className="group flex items-center gap-2 text-xl font-extrabold tracking-tight text-white whitespace-nowrap"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shadow-purple-600/30 group-hover:opacity-95 transition-opacity">
              <Sparkles className="h-4 w-4 text-white" />
            </span>

            <span className="font-heading text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FESTIFY
            </span>
          </Link>

          {/* Desktop City Selector */}
          {onSelectCity && (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
              >
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>{selectedCity || 'All India'}</span>
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 max-h-72 w-52 overflow-y-auto rounded-xl border border-white/10 bg-[#11131d] p-2 shadow-xl">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
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
            className={`flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white ${
              isActive('/my-tickets') ? 'text-purple-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>My Tickets</span>

            {activeTicketsCount > 0 && (
              <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">
                {activeTicketsCount}
              </span>
            )}
          </Link>

          {/* Apply as Organizer */}
          {isAuthenticated && user?.role === 'ROLE_USER' && (
            <Link
              to="/apply-organizer"
              className={`whitespace-nowrap transition-colors hover:text-white ${
                isActive('/apply-organizer')
                  ? 'text-purple-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Become an Organizer
            </Link>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <span>{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#11131d] p-2 shadow-xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{user.email}</p>
                    {user.city && (
                      <p className="mt-1 text-xs text-slate-400">{user.city}</p>
                    )}
                  </div>

                  <Link
                    to="/my-tickets"
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <Ticket className="h-4 w-4" />
                    <span>My Booked Tickets</span>
                  </Link>

                  {user?.role === 'ROLE_USER' && (
                    <Link
                      to="/apply-organizer"
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2.5 text-sm text-purple-300 hover:bg-white/10 hover:text-purple-200"
                    >
                      Become an Organizer
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0c0d14] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenus}
              className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/explore"
              onClick={closeMenus}
              className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Explore Events
            </Link>

            <Link
              to="/my-tickets"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Ticket className="h-4 w-4" />
              My Tickets

              {activeTicketsCount > 0 && (
                <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">
                  {activeTicketsCount}
                </span>
              )}
            </Link>

            {/* Mobile Apply as Organizer */}
            {isAuthenticated && user?.role === 'ROLE_USER' && (
              <Link
                to="/apply-organizer"
                onClick={closeMenus}
                className="rounded-lg px-4 py-3 font-medium text-purple-300 hover:bg-white/5 hover:text-purple-200"
              >
                Become an Organizer
              </Link>
            )}

            {isAuthenticated && user ? (
              <>
                <div className="my-2 border-t border-white/10 pt-3">
                  <p className="px-4 text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="px-4 text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/5"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
