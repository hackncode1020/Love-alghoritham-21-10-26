import React, { useEffect, useState, useRef } from 'react';
import { AppConfig } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { Sparkles, AlertCircle, Flame, ArrowRight } from 'lucide-react';

interface Scene4Props {
  config: AppConfig;
  quizScore: number;
  onAdvanceToGame: () => void;
}

export const Scene4LoveMeter: React.FC<Scene4Props> = ({
  config,
  quizScore,
  onAdvanceToGame,
}) => {
  const [percent, setPercent] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [reachedMax, setReachedMax] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Target score will rise through all tiers and dramatically hit 100% for the cinematic peak!
  useEffect(() => {
    let current = 0;
    const target = 100;
    const interval = setInterval(() => {
      // Accelerate then pause briefly around 88 before bursting to 100
      let increment = 1;
      if (current < 50) increment = 2;
      else if (current < 85) increment = 1.5;
      else if (current < 98) increment = 1;
      else increment = 0.5;

      current = Math.min(target, current + increment);
      setPercent(Math.floor(current));

      // Trigger subtle heartbeat clicks as it rises
      if (current % 15 === 0) {
        soundEngine.playHeartPulse(0.4);
      }

      if (current >= target) {
        clearInterval(interval);
        setReachedMax(true);
        triggerExplosion();
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const triggerExplosion = () => {
    setIsExploding(true);
    soundEngine.playCelebrationBurst();
    soundEngine.playHeartPulse(1);

    // Render canvas particle heart explosion
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = (canvas.width = canvas.offsetWidth);
        const h = (canvas.height = canvas.offsetHeight);

        const particles: {
          x: number;
          y: number;
          vx: number;
          vy: number;
          size: number;
          color: string;
          alpha: number;
        }[] = [];

        const colors = ['#ff2d75', '#f43f5e', '#e11d48', '#f5c7b8', '#ffffff'];
        for (let i = 0; i < 90; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 8;
          particles.push({
            x: w / 2,
            y: h / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
          });
        }

        let animId: number;
        const renderBoom = () => {
          ctx.clearRect(0, 0, w, h);
          let alive = false;
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.018;
            if (p.alpha > 0) {
              alive = true;
              ctx.save();
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });
          if (alive) {
            animId = requestAnimationFrame(renderBoom);
          }
        };
        renderBoom();
      }
    }
  };

  // Determine current tier message
  const getCurrentTier = () => {
    for (const tier of config.loveMeterTiers) {
      if (percent >= tier.min && percent <= tier.max) {
        return tier;
      }
    }
    return config.loveMeterTiers[config.loveMeterTiers.length - 1];
  };

  const currentTier = getCurrentTier();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 select-none max-w-xl mx-auto w-full text-center">
      {/* Title */}
      <div className="mb-4">
        <span className="text-xs font-mono-code text-rose-400 tracking-widest uppercase">
          CALCULATING YOUR LOVE ENERGY...
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-romantic text-white glow-pink-text tracking-wide mt-1">
          The Heart Resonance Gauge
        </h2>
      </div>

      {/* Heart-Shaped Meter Graphic with Canvas Explosion */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Outer glowing orbital meter ring */}
        <div
          className={`absolute inset-0 rounded-full border border-rose-500/30 transition-transform duration-700 ${
            reachedMax ? 'scale-110 border-rose-400 glow-crimson' : 'scale-100'
          }`}
        />

        {/* SVG Heart Shaped Meter */}
        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full relative z-10 filter drop-shadow-[0_0_25px_rgba(255,45,117,0.45)] transition-all duration-500 ${
            reachedMax ? 'scale-105' : 'scale-100'
          }`}
        >
          <defs>
            {/* Heart clip path for rising liquid level */}
            <clipPath id="heartMeterClip">
              <path d="M100,50 C70,10 20,50 60,110 C80,140 100,165 100,165 C100,165 120,140 140,110 C180,50 130,10 100,50 Z" />
            </clipPath>

            <linearGradient id="meterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="90%" stopColor="#ff2d75" />
              <stop offset="100%" stopColor="#f5c7b8" />
            </linearGradient>
          </defs>

          {/* Heart Background Outline */}
          <path
            d="M100,50 C70,10 20,50 60,110 C80,140 100,165 100,165 C100,165 120,140 140,110 C180,50 130,10 100,50 Z"
            fill="rgba(20, 8, 14, 0.7)"
            stroke="rgba(255, 45, 117, 0.4)"
            strokeWidth="2"
          />

          {/* Rising liquid fill inside heart */}
          <g clipPath="url(#heartMeterClip)">
            <rect
              x="0"
              y={170 - (percent / 100) * 140}
              width="200"
              height="200"
              fill="url(#meterGrad)"
              className="transition-all duration-200"
            />

            {/* Glowing wave surface line */}
            <line
              x1="20"
              y1={170 - (percent / 100) * 140}
              x2="180"
              y2={170 - (percent / 100) * 140}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
          </g>

          {/* Heart wireframe accent */}
          <path
            d="M100,50 C70,10 20,50 60,110 C80,140 100,165 100,165 C100,165 120,140 140,110 C180,50 130,10 100,50 Z"
            fill="none"
            stroke={reachedMax ? '#ff2d75' : 'rgba(255, 255, 255, 0.4)'}
            strokeWidth="2"
          />
        </svg>

        {/* Center Digital Percentage Ticker */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-15 pointer-events-none">
          <div className="flex items-baseline font-mono-code font-bold tabular-nums text-4xl sm:text-5xl text-white glow-rosegold-text drop-shadow-md">
            <span>{percent}</span>
            <span className="text-xl sm:text-2xl text-rose-300 ml-0.5">%</span>
          </div>

          <span className="text-[10px] font-mono-code uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full bg-black/60 border border-rose-400/30 text-rose-300">
            {currentTier.badge}
          </span>
        </div>
      </div>

      {/* Tier Feedback Card */}
      <div className="w-full max-w-md mt-4 p-4 rounded-2xl glass-panel shadow-lg border border-rose-500/20">
        <div className="flex items-center justify-center gap-2 mb-1">
          {reachedMax ? (
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          ) : (
            <Sparkles className="w-4 h-4 text-pink-400" />
          )}
          <h3 className="text-base sm:text-lg font-serif-romantic font-semibold text-rose-100">
            {currentTier.message}
          </h3>
        </div>

        <p className="text-xs text-rose-300/80 font-sans-ui mt-1">
          {reachedMax
            ? 'The algorithm overflowed beyond all computational bounds!'
            : 'Synchronizing emotional vectors with conversational inputs...'}
        </p>
      </div>

      {/* Next Step CTA */}
      <div className="mt-6 flex flex-col items-center gap-2">
        {reachedMax && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onAdvanceToGame();
            }}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm sm:text-base tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.5)] hover:shadow-[0_0_40px_rgba(255,45,117,0.8)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 animate-bounce"
          >
            <span>NEXT CHALLENGE: UNLOCK THE UNKNOWN</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <span className="text-[11px] font-mono-code text-rose-400/60 mt-1">
          Entertainment calculation based on your thoughtful responses
        </span>
      </div>
    </div>
  );
};
