'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded border border-slate-700 w-96 shadow-lg">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Create Account</h2>
          <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="px-3 py-3 space-y-2">
          {/* Email */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
            />
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="w-3 h-3 accent-lime-400" />
            <span className="text-xs text-slate-400">I agree to Terms of Service</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-700 flex gap-1">
          <button
            onClick={onClose}
            className="flex-1 py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button className="flex-1 py-1 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
