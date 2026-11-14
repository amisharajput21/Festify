
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { POPULAR_CITIES } from '../data/mockEvents.js';

const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register
  } = useAuth();

  const navigate = useNavigate();

  const [tab, setTab] = useState(authModalTab || 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab || 'login');
      setError('');
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

 
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


  const cities = Array.isArray(POPULAR_CITIES)
    ? POPULAR_CITIES.map((item) =>
        typeof item === 'string' ? item : item.name
      ).filter(Boolean)
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500">
            <User className="h-7 w-7 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {tab === 'login'
              ? 'Login to continue your Festify experience.'
              : 'Join Festify and discover amazing events.'}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              tab === 'login'
                ? 'bg-white text-purple-700 shadow dark:bg-gray-700 dark:text-white'
                : 'text-gray-500'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              tab === 'register'
                ? 'bg-white text-purple-700 shadow dark:bg-gray-700 dark:text-white'
                : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {cities.length > 0 ? (
                    cities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="Mumbai">Mumbai</option>
                  )}
                </select>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password (minimum 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={tab === 'register' ? 8 : undefined}
              className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : tab === 'login'
                ? 'Login'
                : 'Create Account'}

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to Festify's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
