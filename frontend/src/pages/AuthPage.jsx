import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import { POPULAR_CITIES } from '../data/mockEvents.js';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { login, register } = useAuth();

  const isRegisterInitial = location.pathname.includes('register');

  const [tab, setTab] = useState(isRegisterInitial ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setLoading(true);

  try {
    if (tab === 'login') {
      if (!email.trim() || !password) {
        throw new Error('Please enter your email and password.');
      }

      const loggedInUser = await login(email.trim(), password);

      console.log('LOGIN USER:', loggedInUser);
      console.log('LOGIN ROLE:', loggedInUser?.role);

      if (loggedInUser?.role === 'ROLE_ADMIN') {
        navigate('/admin', { replace: true });
      } else if (loggedInUser?.role === 'ROLE_ORGANIZER') {
        navigate('/organizer', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }

    } else {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        throw new Error('Please fill in all details.');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      await register(
        name.trim(),
        email.trim(),
        phone.trim(),
        city,
        password
      );

      navigate('/explore', { replace: true });
    }

  } catch (err) {
    setError(err.message || 'Authentication failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d101d] p-6 sm:p-8 shadow-2xl">

        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

        <div className="text-center mb-6">

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Festify Home</span>
          </Link>

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md shadow-purple-600/30 mb-3">
            <User className="h-6 w-6 text-white" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            {tab === 'login'
              ? 'Welcome Back'
              : 'Create Festify Account'}
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            {tab === 'login'
              ? 'Sign in to access your booked passes'
              : 'Join India’s live entertainment community'}
          </p>
        </div>

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
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                  <User className="h-4 w-4 text-purple-400 shrink-0" />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile (+91)
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <Phone className="h-4 w-4 text-pink-400 shrink-0" />

                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <MapPin className="h-4 w-4 text-purple-400 shrink-0" />

                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-hidden cursor-pointer"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          className="bg-[#0d101d] text-white"
                        >
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

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
              <Mail className="h-4 w-4 text-purple-400 shrink-0" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
              <Lock className="h-4 w-4 text-pink-400 shrink-0" />

              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-transparent text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity disabled:opacity-50 mt-4 cursor-pointer"
          >
            <span>
              {loading
                ? 'Processing...'
                : tab === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </span>

            <ArrowRight className="h-4 w-4" />
          </button>

        </form>
      </div>
    </div>
  );
};
