'use client';

const MY_BETS = [
  { id: 1, amount: '₦500', multiplier: '2.45x', status: 'won', payout: '₦1,225.00' },
  { id: 2, amount: '₦1,000', multiplier: '–', status: 'active', payout: '–' },
  { id: 3, amount: '₦200', multiplier: '1.62x', status: 'won', payout: '₦324.00' },
  { id: 4, amount: '₦700', multiplier: '–', status: 'lost', payout: '₦0' },
  { id: 5, amount: '₦300', multiplier: '3.21x', status: 'won', payout: '₦963.00' },
  { id: 6, amount: '₦600', multiplier: '–', status: 'active', payout: '–' },
];

export default function MobileBetsView() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto scrollbar-hide mb-16">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 sticky top-0 bg-slate-950 px-3 py-1">
        <button className="px-3 py-1 text-xs font-semibold text-lime-400 border-b-2 border-lime-400">
          All Bets
        </button>
        <button className="px-3 py-1 text-xs text-slate-400 hover:text-white transition">
          My Bets
        </button>
      </div>

      {/* Stats */}
      <div className="px-3 py-2 border-b border-slate-800">
        <div className="text-xs text-slate-400 mb-0.5">TOTAL BETS</div>
        <div className="text-lg font-bold text-lime-400">₦125,480.00</div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {MY_BETS.map((bet) => (
          <div
            key={bet.id}
            className="px-3 py-2 border-b border-slate-900 flex justify-between items-center text-xs hover:bg-slate-900/50 transition"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex-shrink-0"></div>
                <span className="font-semibold text-slate-300">Bet #{bet.id}</span>
              </div>
              <div className="text-slate-500 ml-7">{bet.amount}</div>
            </div>
            <div className="text-right">
              <div className={bet.status === 'won' ? 'text-yellow-300 font-semibold' : 'text-slate-600'}>
                {bet.multiplier}
              </div>
              <div className={bet.status === 'won' ? 'text-lime-400 font-semibold' : 'text-slate-600'}>
                {bet.payout}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
