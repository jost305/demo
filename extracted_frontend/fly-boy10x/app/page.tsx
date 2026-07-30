'use client';

import { useState } from 'react';
import Header from '@/components/header';
import LeftSidebar from '@/components/left-sidebar';
import GameArea from '@/components/game-area';
import RightSidebar from '@/components/right-sidebar';
import MobileHeader from '@/components/mobile-header';
import MobileNav from '@/components/mobile-nav';
import MobileGameView from '@/components/mobile-game-view';
import MobileBetsView from '@/components/mobile-bets-view';
import MobileChatView from '@/components/mobile-chat-view';

export default function Home() {
  const [balance, setBalance] = useState(45210.00);
  const [activeTab, setActiveTab] = useState('game');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col h-screen">
        <Header balance={balance} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <GameArea balance={balance} setBalance={setBalance} />
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <MobileHeader balance={balance} />
        
        {/* Tab Content */}
        {activeTab === 'game' && <MobileGameView balance={balance} setBalance={setBalance} />}
        {activeTab === 'bets' && <MobileBetsView />}
        {activeTab === 'chat' && <MobileChatView />}
        
      </div>
    </div>
  );
}
