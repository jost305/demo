'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 5000, 10000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded border border-slate-700 w-80 shadow-lg">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Deposit Funds</h2>
          <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="px-3 py-3 space-y-2">
          {/* Payment Method */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white outline-none focus:border-lime-400 transition"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                {amt / 1000}K
              </button>
            ))}
          </div>
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
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
