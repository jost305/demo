'use client';

import { useState, useEffect } from 'react';
import GameChart from './game-chart';

interface GameAreaProps {
  balance: number;
  setBalance: (balance: number) => void;
}

const PREVIOUS_ROUNDS = [2.13, 1.45, 3.67, 1.12, 6.25, 1.75, 2.98, 12.43, 1.33, 4.12, 1.08, 9.76];

const RECENT_WINNERS = [
  { name: 'JOHN D.', bet: '₦50,000', multiplier: '2.64x', winnings: '₦132,000' },
  { name: 'EMMA O.', bet: '₦20,000', multiplier: '1.78x', winnings: '₦35,600' },
  { name: 'KING247', bet: '₦10,000', multiplier: '1.23x', winnings: '₦12,300' },
];

export default function GameArea({ balance, setBalance }: GameAreaProps) {
  const [currentMultiplier, setCurrentMultiplier] = useState(104.4);
  const [betAmount, setBetAmount] = useState(5.00);
  const [gameActive, setGameActive] = useState(true);
  const [displayMultiplier, setDisplayMultiplier] = useState(104.4);

  // Animate multiplier ticking up
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setDisplayMultiplier(prev => {
        const newVal = prev + (Math.random() * 0.5 - 0.1);
        return Math.min(newVal, 150);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [gameActive]);

  return (
    <div className="flex-1 bg-slate-950 flex flex-col border-r border-slate-800 overflow-y-auto scrollbar-hide">
      {/* Previous Rounds */}
      <div className="px-4 py-2 border-b border-slate-800">
        <div className="text-xs text-slate-500 mb-1">PREVIOUS ROUNDS</div>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {PREVIOUS_ROUNDS.map((round, i) => (
            <div key={i} className="flex-shrink-0 px-2 py-0.5 bg-slate-900 rounded text-xs text-yellow-300 font-semibold whitespace-nowrap hover:bg-slate-800 transition cursor-pointer hover:scale-105 transform">
              {round}x
            </div>
          ))}
          <div className="flex-shrink-0 px-3 py-1 bg-slate-900 rounded text-slate-400 hover:bg-slate-800 transition cursor-pointer">📊</div>
        </div>
      </div>

      {/* Game Display */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-2 min-h-64">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(100, 200, 50) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* Game Status */}
        <div className="text-center mb-4">
          <div className="text-xs text-lime-400 font-semibold tracking-widest animate-pulse">FLEW AWAY!</div>
          <div className="text-6xl font-black mt-2 text-white transition-all duration-100">
            {displayMultiplier.toFixed(1)}<span className="text-4xl">x</span>
          </div>
        </div>

        {/* Game Chart */}
        <div className="w-full max-w-2xl">
          <GameChart multiplier={currentMultiplier} />
        </div>

        {/* Time Markers */}
        <div className="w-full max-w-2xl flex justify-between px-8 mt-2 text-xs text-slate-500">
          <span>0s</span>
          <span>2s</span>
          <span>4s</span>
          <span>6s</span>
          <span>8s</span>
          <span>10s</span>
        </div>

        {/* Multiplier Markers on Right */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-12 text-sm text-slate-500">
          <span>100x</span>
          <span>75x</span>
          <span>50x</span>
          <span>25x</span>
          <span>0x</span>
        </div>
      </div>

      {/* Betting Controls */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Bet 1 */}
          <div className="bg-slate-800 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-lime-400 font-semibold">Bet</span>
              <span className="text-xs text-slate-400">Auto</span>
            </div>

            {/* Bet Amount */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <button className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition text-xs">−</button>
              <input 
                type="number" 
                value={betAmount.toFixed(2)} 
                className="w-12 bg-transparent text-center text-lg font-bold text-white outline-none"
                readOnly
              />
              <button className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition text-xs">+</button>
            </div>

            {/* Quick Bets */}
            <div className="flex gap-1 mb-2 text-xs">
              {[5, 10, 20, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className="flex-1 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition text-xs font-semibold"
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* BET Button */}
            <button className="w-full py-2 bg-lime-400 text-black font-bold rounded hover:bg-lime-300 transition flex items-center justify-center gap-1 hover:scale-105 transform duration-100">
              <span>BET</span>
              <span>⚡</span>
            </button>
          </div>

          {/* Bet 2 (Same as Bet 1) */}
          <div className="bg-slate-800 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-lime-400 font-semibold">Bet</span>
              <span className="text-xs text-slate-400">Auto</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <button className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition text-xs">−</button>
              <input 
                type="number" 
                value={betAmount.toFixed(2)} 
                className="w-12 bg-transparent text-center text-lg font-bold text-white outline-none"
                readOnly
              />
              <button className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition text-xs">+</button>
            </div>

            <div className="flex gap-1 mb-2 text-xs">
              {[5, 10, 20, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className="flex-1 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition text-xs font-semibold"
                >
                  {amt}
                </button>
              ))}
            </div>

            <button className="w-full py-2 bg-lime-400 text-black font-bold rounded hover:bg-lime-300 transition flex items-center justify-center gap-1 hover:scale-105 transform duration-100">
              <span>BET</span>
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* Collapse Button */}
        <button className="w-full mt-1 p-1 text-slate-400 hover:text-white transition text-xs">−</button>
      </div>
    </div>
  );
}
