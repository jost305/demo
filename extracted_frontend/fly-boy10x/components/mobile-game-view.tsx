'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const INITIAL_ROUNDS = [1.09, 2.00, 1.02, 1.32, 5.53, 3.90];

function roundColor(v: number) {
  if (v < 1.5) return 'text-purple-400 border-purple-500/60';
  if (v < 2.5) return 'text-blue-400 border-blue-500/60';
  if (v < 5)   return 'text-cyan-400 border-cyan-500/60';
  if (v < 10)  return 'text-lime-400 border-lime-500/60';
  return 'text-yellow-300 border-yellow-400/60';
}

interface MobileGameViewProps {
  balance: number;
  setBalance: (balance: number) => void;
}

function MobileChart({ multiplier }: { multiplier: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const padLeft = 44;
    const padBottom = 24;
    const padTop = 12;
    const padRight = 12;

    ctx.clearRect(0, 0, W, H);

    // Y-axis labels
    const yLabels = ['0x', '2.0x', '4.0x', '6.0x', '8.0x', '10.0x'];
    const chartH = H - padBottom - padTop;
    const chartW = W - padLeft - padRight;

    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.textAlign = 'right';
    yLabels.forEach((label, i) => {
      const y = H - padBottom - (i / (yLabels.length - 1)) * chartH;
      ctx.fillText(label, padLeft - 4, y + 4);
      // Horizontal grid line
      ctx.strokeStyle = 'rgba(100,116,139,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();
    });

    // X-axis dots
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    for (let i = 0; i <= 6; i++) {
      const x = padLeft + (i / 6) * chartW;
      ctx.beginPath();
      ctx.arc(x, H - padBottom + 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Generate exponential curve points
    const points: { x: number; y: number }[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = padLeft + t * chartW;
      const curveY = Math.pow(t, 1.8);
      const y = H - padBottom - curveY * chartH;
      points.push({ x, y });
    }

    // Filled gradient area under curve
    const grad = ctx.createLinearGradient(0, padTop, 0, H - padBottom);
    grad.addColorStop(0, 'rgba(132,204,22,0.25)');
    grad.addColorStop(1, 'rgba(132,204,22,0.02)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, H - padBottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - padBottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Curve line with glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#84cc16';
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.shadowBlur = 0;

    // End dot
    const last = points[points.length - 1];
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
    ctx.fill();

  }, [multiplier]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={220}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.stopPropagation(); onChange(!checked); }}
      style={{ touchAction: 'manipulation' }}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-lime-500' : 'bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function BetPanel({
  amount,
  setAmount,
  autoBet,
  setAutoBet,
  autoCashout,
  setAutoCashout,
  onBet,
}: {
  amount: number;
  setAmount: (v: number) => void;
  autoBet: boolean;
  setAutoBet: (v: boolean) => void;
  autoCashout: boolean;
  setAutoCashout: (v: boolean) => void;
  onBet: () => void;
}) {
  return (
    <div className="border border-slate-700 rounded-lg bg-slate-900">
      {/* Toggles row */}
      <div className="flex justify-around items-center px-3 pt-2 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Auto Bet</span>
          <Toggle checked={autoBet} onChange={setAutoBet} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Auto Cashout</span>
          <Toggle checked={autoCashout} onChange={setAutoCashout} />
        </div>
      </div>

      {/* Main controls row */}
      <div className="flex">
        {/* Left 50%: amount + quick bets */}
        <div className="w-1/2 px-2 py-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Min : 10</span>
            <span>Max : 500000</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <button
              type="button"
              style={{ touchAction: 'manipulation' }}
              onPointerDown={() => setAmount(Math.max(10, amount - 10))}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-700 active:bg-slate-500 rounded-lg text-white text-lg font-bold"
            >−</button>
            <input
              type="number"
              value={amount.toFixed(2)}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 min-w-0 bg-transparent text-center text-lg font-bold text-white outline-none"
            />
            <button
              type="button"
              style={{ touchAction: 'manipulation' }}
              onPointerDown={() => setAmount(amount + 10)}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-700 active:bg-slate-500 rounded-lg text-white text-lg font-bold"
            >+</button>
          </div>
          <div className="flex gap-1">
            {[100, 200, '1K'].map(amt => (
              <button
                type="button"
                key={amt}
                style={{ touchAction: 'manipulation' }}
                onPointerDown={() => setAmount(typeof amt === 'string' ? 1000 : amt)}
                className="flex-1 py-1 bg-slate-700 active:bg-slate-500 rounded-lg text-xs font-semibold text-slate-300"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Right 50%: BET button */}
        <div className="w-1/2 p-2 flex">
          <button
            type="button"
            style={{ touchAction: 'manipulation' }}
            onPointerDown={onBet}
            className="w-full bg-lime-500 active:bg-lime-300 rounded-xl text-black font-black flex flex-col items-center justify-center transition"
          >
            <span className="text-base font-black leading-tight">BET</span>
            <span className="text-lg font-black leading-tight"><span className="text-sm font-light">NGN </span>{amount.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MobileGameView({ balance, setBalance }: MobileGameViewProps) {
  const [displayMultiplier, setDisplayMultiplier] = useState(5.53);
  const [rounds, setRounds] = useState(INITIAL_ROUNDS);
  const [newRoundId, setNewRoundId] = useState<number | null>(null);
  const [bet1Amount, setBet1Amount] = useState(10.00);
  const [bet2Amount, setBet2Amount] = useState(50.00);
  const [bet1AutoBet, setBet1AutoBet] = useState(false);
  const [bet1AutoCashout, setBet1AutoCashout] = useState(false);
  const [bet2AutoBet, setBet2AutoBet] = useState(false);
  const [bet2AutoCashout, setBet2AutoCashout] = useState(false);

  // Animate multiplier
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayMultiplier(prev => Math.min(prev + (Math.random() * 0.05), 150));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Add a new round result every 4–7 seconds
  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 3000;
      return setTimeout(() => {
        const raw = Math.random();
        // Weight towards low multipliers like real crash games
        const value = raw < 0.5
          ? 1 + Math.random() * 1.5
          : raw < 0.8
          ? 2.5 + Math.random() * 4
          : 6.5 + Math.random() * 20;
        const rounded = Math.round(value * 100) / 100;
        setRounds(prev => [rounded, ...prev].slice(0, 20));
        setNewRoundId(rounded);
        setTimeout(() => setNewRoundId(null), 600);
        timer = schedule();
      }, delay);
    };
    let timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-black overflow-y-auto scrollbar-hide">
      {/* Round History Bar */}
      <div className="px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-slate-800">
        {rounds.map((value, i) => (
          <div
            key={`${value}-${i}`}
            className={`flex-shrink-0 px-2 py-0.5 border rounded text-xs font-bold whitespace-nowrap transition-all duration-300 ${roundColor(value)} ${i === 0 && newRoundId !== null ? 'scale-110 opacity-100' : 'opacity-90'}`}
          >
            {value.toFixed(2)}x
          </div>
        ))}
        <button className="flex-shrink-0 ml-auto flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 whitespace-nowrap">
          Round History <span className="text-lime-400">▼</span>
        </button>
      </div>

      {/* Game Chart Container */}
      <div className="mx-2 mt-2 border border-lime-500/40 rounded-xl bg-slate-950 relative overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Chart */}
        <div className="absolute inset-0">
          <MobileChart multiplier={displayMultiplier} />
        </div>

        {/* Airplane at tip of curve */}
        <div className="absolute" style={{ right: '14px', top: '18px' }}>
          <Image src="/favicon.png" alt="plane" width={56} height={56} className="object-contain" />
        </div>

        {/* Multiplier display - centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-5xl font-black text-lime-400 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(132,204,22,0.6)' }}>
            {displayMultiplier.toFixed(2)}<span className="text-3xl">x</span>
          </div>
        </div>
      </div>

      {/* Bet Panels */}
      <div className="px-2 mt-2 space-y-1 pb-2">
        <BetPanel
          amount={bet1Amount} setAmount={setBet1Amount}
          autoBet={bet1AutoBet} setAutoBet={setBet1AutoBet}
          autoCashout={bet1AutoCashout} setAutoCashout={setBet1AutoCashout}
          onBet={() => setBalance(Math.max(0, balance - bet1Amount))}
        />
        <BetPanel
          amount={bet2Amount} setAmount={setBet2Amount}
          autoBet={bet2AutoBet} setAutoBet={setBet2AutoBet}
          autoCashout={bet2AutoCashout} setAutoCashout={setBet2AutoCashout}
          onBet={() => setBalance(Math.max(0, balance - bet2Amount))}
        />
      </div>

    </div>
  );
}
