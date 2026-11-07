import React, { useState, useEffect } from 'react';
import { X, Sparkles, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { POPULAR_CITIES } from '../data/mockEvents.js';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register } = useAuth();

  const [tab, setTab] = useState(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTab(authModalTab);
    setError('');
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        if (!email || !password) {
          setError('Please provide your email and password');
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name || !email || !phone || !password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        await register(name, email, phone, city, password);
      }
    } catch {
      setError('Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login('aarav.sharma@festify.in', 'password123');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d101d] p-6 sm:p-8 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shadow-purple-600/30 mb-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
            {tab === 'login' ? 'Welcome Back to Festify' : 'Join Festify India'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {tab === 'login'
              ? 'Access your tickets, festival passes, and personalized feeds'
              : 'Discover unforgettable live events across premier Indian cities'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-purple-500/50">
                  <User className="h-4 w-4 text-purple-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile (+91)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-purple-500/50">
                    <Phone className="h-4 w-4 text-pink-400 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Home City
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-purple-500/50">
                    <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-hidden text-xs cursor-pointer"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0d101d] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-purple-500/50">
              <Mail className="h-4 w-4 text-purple-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-purple-500/50">
              <Lock className="h-4 w-4 text-pink-400 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 px-4 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity disabled:opacity-50 mt-4 cursor-pointer"
          >
            <span>{loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Festify Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Demo Shortcut */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Want to test without registering?</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1-Click Demo User (Aarav Sharma)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
