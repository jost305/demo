'use client';

import { useEffect, useRef } from 'react';

interface GameChartProps {
  multiplier: number;
}

export default function GameChart({ multiplier }: GameChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height / 5) * i);
      ctx.lineTo(canvas.width, (canvas.height / 5) * i);
      ctx.stroke();
    }

    // Generate curved path
    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const points = [];
    const startX = 50;
    const startY = canvas.height - 50;
    
    for (let i = 0; i <= 100; i++) {
      const x = startX + (i / 100) * (canvas.width - 100);
      // Exponential curve
      const progress = i / 100;
      const y = startY - (Math.pow(progress, 1.5) * (canvas.height - 100));
      points.push({ x, y });
    }

    // Draw curve with glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#CCFF00';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw end point circle
    const lastPoint = points[points.length - 1];
    ctx.fillStyle = '#CCFF00';
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw glow circle
    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw arrow at the end
    const arrowLength = 20;
    const angle = Math.atan2(
      points[points.length - 1].y - points[points.length - 2].y,
      points[points.length - 1].x - points[points.length - 2].x
    );

    ctx.fillStyle = '#CCFF00';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(
      lastPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
      lastPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      lastPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
      lastPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

  }, [multiplier]);

  return (
    <div className="w-full flex justify-center animate-in fade-in duration-500">
      <canvas 
        ref={canvasRef}
        className="w-full max-w-2xl h-auto drop-shadow-lg"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
