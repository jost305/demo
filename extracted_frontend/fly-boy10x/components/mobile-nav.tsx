'use client';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const tabs = [
    { id: 'game', label: 'Game', icon: '🎮' },
    { id: 'bets', label: 'My Bets', icon: '⏱️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'wallet', label: 'Wallet', icon: '💳' },
    { id: 'chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 h-16 flex items-center justify-around md:hidden">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition ${
            activeTab === tab.id 
              ? 'text-lime-400' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="text-xs font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
