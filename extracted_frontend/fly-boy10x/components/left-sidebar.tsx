'use client';

import Image from 'next/image';

const BETS = [
  { user: 'AcePilot', bet: '₦ 500', mult: '2.45x', cashout: '₦1,225.00' },
  { user: 'QueenBee', bet: '₦ 1,000', mult: '–', cashout: '–' },
  { user: 'FlyChuks', bet: '₦ 200', mult: '1.62x', cashout: '₦ 324.00' },
  { user: 'Mz_rich', bet: '₦ 700', mult: '–', cashout: '–' },
  { user: 'Don-P', bet: '₦ 300', mult: '3.21x', cashout: '₦ 963.00' },
  { user: 'BigJet', bet: '₦ 600', mult: '–', cashout: '–' },
  { user: 'KennyB', bet: '₦ 250', mult: '1.35x', cashout: '₦ 337.50' },
  { user: 'FlyGurl', bet: '₦ 1,000', mult: '4.12x', cashout: '₦ 4,120.00' },
  { user: 'KingDave', bet: '₦ 400', mult: '–', cashout: '–' },
  { user: 'TeeMoney', bet: '₦ 200', mult: '2.00x', cashout: '₦ 400.00' },
  { user: 'HardBoi', bet: '₦ 500', mult: '–', cashout: '–' },
  { user: 'Pilot7', bet: '₦ 300', mult: '1.28x', cashout: '₦ 384.00' },
];

export default function LeftSidebar() {
  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-3 py-1">
        <button className="px-2 py-1 text-xs font-semibold text-lime-400 border-b-2 border-lime-400">
          All Bets
        </button>
        <button className="px-2 py-1 text-xs text-slate-400 hover:text-white transition">
          My Bets
        </button>
      </div>

      {/* Total Bets */}
      <div className="px-3 py-2 border-b border-slate-800">
        <div className="text-xs text-slate-400 mb-0.5">TOTAL BETS</div>
        <div className="text-lg font-bold text-lime-400">₦ 125,480.00</div>
      </div>

      {/* Previous Hand */}
      <div className="px-3 py-1 flex items-center gap-2 text-xs text-slate-400 border-b border-slate-800">
        <span>⏮</span>
        <span>Previous hand</span>
      </div>

      {/* Table Headers */}
      <div className="px-3 py-1 grid grid-cols-4 gap-1 text-xs text-slate-500 border-b border-slate-800">
        <div>User</div>
        <div>Bet</div>
        <div>Mult.</div>
        <div>Cash out</div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {BETS.map((bet, i) => (
          <div key={i} className="px-3 py-1 border-b border-slate-900 grid grid-cols-4 gap-1 text-xs hover:bg-slate-900/50 transition hover:scale-105 hover:pl-4 transform duration-100">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex-shrink-0 animate-pulse"></div>
              <span className="text-slate-300 truncate text-xs">{bet.user}</span>
            </div>
            <div className="text-slate-300">{bet.bet}</div>
            <div className={bet.mult === '–' ? 'text-slate-600' : 'text-yellow-300 font-semibold'}>{bet.mult}</div>
            <div className={bet.cashout === '–' ? 'text-slate-600' : 'text-lime-400 font-semibold'}>{bet.cashout}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
