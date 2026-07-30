'use client';

import { useState } from 'react';
import { Menu, MessageCircle, X, Home, Trophy, Wallet, Settings, HelpCircle, LogIn } from 'lucide-react';
import Image from 'next/image';
import RegisterModal from '@/components/modals/register-modal';
import DepositModal from '@/components/modals/deposit-modal';
import NotificationsModal from '@/components/modals/notifications-modal';

interface MobileHeaderProps {
  balance: number;
}

const MENU_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: Trophy, label: 'Leaderboard' },
  { icon: Wallet, label: 'Deposit' },
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help & Support' },
  { icon: LogIn, label: 'Sign In' },
];

export default function MobileHeader({ balance }: MobileHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-2 md:hidden flex items-center justify-between relative z-40">
        {/* Left: Menu */}
        <button onClick={() => setShowMenu(true)} className="p-1 hover:bg-slate-800 rounded transition">
          <Menu className="w-5 h-5 text-slate-300" />
        </button>

        {/* Center: Logo */}
        <Image src="/favicon.png" alt="FlyBoy10x" width={48} height={48} className="object-contain" />

        {/* Right: Balance + Chat */}
        <div className="flex items-center gap-1.5">
          <div className="border border-lime-500 rounded px-1.5 py-0.5">
            <div className="text-xs font-bold text-lime-400 whitespace-nowrap">₦{balance.toFixed(2)}</div>
          </div>
          <button className="relative p-1 hover:bg-slate-800 rounded transition">
            <MessageCircle className="w-4 h-4 text-lime-400" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center leading-none">3</span>
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
              <Image src="/favicon.png" alt="FlyBoy10x" width={40} height={40} className="object-contain" />
              <button onClick={() => setShowMenu(false)} className="p-1 hover:bg-slate-800 rounded transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Balance */}
            <div className="px-4 py-3 border-b border-slate-800">
              <div className="text-xs text-slate-400 mb-0.5">Balance</div>
              <div className="text-lg font-bold text-lime-400">₦{balance.toFixed(2)}</div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-2">
              {MENU_ITEMS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium"
                >
                  <Icon className="w-5 h-5 text-lime-400" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500 text-center">
              FlyBoy10x © 2026
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
