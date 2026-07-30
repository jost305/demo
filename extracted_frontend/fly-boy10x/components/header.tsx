'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import RegisterModal from '@/components/modals/register-modal';
import DepositModal from '@/components/modals/deposit-modal';
import NotificationsModal from '@/components/modals/notifications-modal';

interface HeaderProps {
  balance: number;
}

export default function Header({ balance }: HeaderProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 py-1">
        {/* Logo */}
        <Image src="/flyboy-logo.png" alt="FlyBoy10x" width={140} height={44} className="object-contain" />

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Balance */}
          <div className="text-xs text-slate-300">
            ₦ {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Deposit Button */}
          <button 
            onClick={() => setShowDeposit(true)}
            className="px-2 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition"
          >
            + Deposit
          </button>

          {/* Notifications Icon */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-1 hover:bg-slate-800 rounded transition"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Sign In Button */}
          <button 
            onClick={() => setShowRegister(true)}
            className="px-2 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Modals */}
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
