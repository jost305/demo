'use client';

import { useState, useEffect } from 'react';

const INITIAL_MESSAGES = [
  { user: 'AcePilot', message: 'Just hit 8.4x! 🚀', time: '12:45' },
  { user: 'FlyGurl', message: "Today's feeling good! 🔥", time: '12:46' },
  { user: 'BigJet', message: 'Cash out at 2x and be happy 😊', time: '12:46' },
  { user: 'QueenBee', message: '40x was crazyyy 🏠', time: '12:47' },
  { user: 'Don-P', message: 'Let\'s gooooo 🔥 🔥', time: '12:47' },
];

const NEW_MESSAGES = ['Massive win!', 'LFG!! 🚀', 'Cashout now!', 'Too close!', 'Nice hit'];
const USERS = ['AcePilot', 'FlyGurl', 'BigJet', 'QueenBee', 'Don-P'];

export default function MobileChatView() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMsg = {
        user: USERS[Math.floor(Math.random() * USERS.length)],
        message: NEW_MESSAGES[Math.floor(Math.random() * NEW_MESSAGES.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages(prev => [...prev.slice(1), newMsg]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden mb-16">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-1">
        <span className="text-xs font-semibold text-white">💬 LIVE CHAT</span>
        <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded flex items-center gap-0.5">
          <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
          <span>128</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-1 group text-xs">
            <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex-shrink-0 animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-slate-300">{msg.user}</span>
                <span className="text-xs text-slate-500">{msg.time}</span>
              </div>
              <p className="text-slate-300 break-words leading-tight">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="px-2 py-2 border-t border-slate-800">
        <div className="relative flex items-center bg-slate-800 rounded">
          <input
            type="text"
            placeholder="Type..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder-slate-500 outline-none"
          />
          <button className="px-2 py-1 text-slate-400 hover:text-white transition">
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
