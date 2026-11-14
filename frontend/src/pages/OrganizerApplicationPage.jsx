
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { organizerApplicationService } from '../services/api.js';

export default function OrganizerApplicationPage() {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (reason.trim().length < 20) {
      setError('Please kam se kam 20 characters ka reason likhein.');
      return;
    }

    setLoading(true);

    try {
      const result =
        await organizerApplicationService.submitApplication(reason.trim());

      setSuccess(result.message || 'Application submitted successfully!');
      setReason('');
    } catch (err) {
      setError(err.message || 'Application submit nahi ho payi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-purple-400 hover:text-purple-300">
          ← Back to Home
        </Link>

        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl font-bold">
            Become a Festify Organizer
          </h1>

          <p className="text-slate-400 mt-3">
            Tell us about yourself and the events you want to organize.
            Our admin team will review your application.
          </p>

          {success && (
            <div className="mt-6 p-4 rounded-lg bg-green-900/40 border border-green-700 text-green-300">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-900/40 border border-red-700 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-sm font-medium mb-2">
              Why do you want to become an organizer?
            </label>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={6}
              maxLength={1000}
              required
              placeholder="Describe your experience, event ideas, and the type of events you plan to organize..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4 text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
            />

            <div className="text-right text-xs text-slate-500 mt-2">
              {reason.length}/1000 characters
            </div>

            <button
              type="submit"
              disabled={loading || reason.trim().length < 20}
              className="w-full mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Organizer Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
