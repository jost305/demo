'use client';

import { X, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS = [
  { id: 1, type: 'win', message: 'You won ₦2,500! Game hit 8.4x', time: '2 min ago' },
  { id: 2, type: 'cashout', message: 'Successfully cashed out ₦5,000', time: '15 min ago' },
  { id: 3, type: 'bonus', message: 'Bonus credit of ₦500 added', time: '1 hour ago' },
  { id: 4, type: 'promotion', message: 'New promotion: 50% bonus on next deposit', time: '3 hours ago' },
];

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded border border-slate-700 w-80 shadow-lg max-h-96 flex flex-col">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 space-y-1">
          {NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className="px-2 py-1.5 bg-slate-800/50 rounded border border-slate-700 hover:bg-slate-800 transition">
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded flex-shrink-0 mt-0.5 ${
                  notif.type === 'win' ? 'bg-green-500/20' :
                  notif.type === 'cashout' ? 'bg-yellow-500/20' :
                  notif.type === 'bonus' ? 'bg-lime-400/20' :
                  'bg-blue-500/20'
                }`}>
                  <Check className={`w-3 h-3 ${
                    notif.type === 'win' ? 'text-green-400' :
                    notif.type === 'cashout' ? 'text-yellow-400' :
                    notif.type === 'bonus' ? 'text-lime-400' :
                    'text-blue-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white leading-tight">{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-700">
          <button className="w-full py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
