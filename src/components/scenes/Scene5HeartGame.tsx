import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Heart, Timer, Trophy, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface Scene5Props {
  onUnlockSecret: () => void;
}

interface FloatingHeart {
  id: number;
  x: number; // percentage 10 - 85%
  y: number; // percentage 15 - 80%
  size: number;
  color: string;
  speed: number;
  wobbleOffset: number;
  caught: boolean;
}

export const Scene5HeartGame: React.FC<Scene5Props> = ({ onUnlockSecret }) => {
  const TARGET_GOAL = 12;
  const INITIAL_TIME = 20;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const timerRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const nextHeartId = useRef(0);
  const caughtSet = useRef(new Set<number>());

  const colors = ['#ff2d75', '#f43f5e', '#e11d48', '#f5c7b8', '#fb7185'];

  // Start / Reset game
  const startGame = useCallback(() => {
    // Clear old timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);

    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setGameState('playing');
    setBursts([]);
    caughtSet.current.clear();

    // Initial batch of hearts
    const initialHearts: FloatingHeart[] = [];
    for (let i = 0; i < 5; i++) {
      initialHearts.push({
        id: nextHeartId.current++,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
        size: 38 + Math.random() * 16,
        color: colors[i % colors.length],
        speed: 0.8 + Math.random() * 0.8,
        wobbleOffset: Math.random() * Math.PI * 2,
        caught: false,
      });
    }
    setHearts(initialHearts);

    // Timer countdown
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnRef.current) clearInterval(spawnRef.current);
          setGameState((st) => (st === 'won' ? 'won' : 'lost'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn new hearts continuously
    spawnRef.current = window.setInterval(() => {
      setHearts((prev) => {
        // Keep between 4 and 8 uncaught hearts on screen
        const uncaught = prev.filter((h) => !h.caught);
        if (uncaught.length >= 8) return prev;

        const newH: FloatingHeart = {
          id: nextHeartId.current++,
          x: 12 + Math.random() * 76,
          y: 20 + Math.random() * 65,
          size: 36 + Math.random() * 18,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 0.8 + Math.random() * 1.0,
          wobbleOffset: Math.random() * Math.PI * 2,
          caught: false,
        };
        return [...uncaught, newH];
      });
    }, 750);
  }, []);

  useEffect(() => {
    startGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [startGame]);

  // Handle heart catch (touch or click)
  const handleCatchHeart = (heart: FloatingHeart, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;
    if (caughtSet.current.has(heart.id)) return; // Prevent double taps

    caughtSet.current.add(heart.id);

    // Play sparkle sound
    const pitch = 0.9 + (score / TARGET_GOAL) * 0.4;
    soundEngine.playCollectSparkle(pitch);

    // Spawn visual burst
    const burstId = Date.now() + Math.random();
    setBursts((b) => [...b, { id: burstId, x: heart.x, y: heart.y }]);
    setTimeout(() => {
      setBursts((b) => b.filter((item) => item.id !== burstId));
    }, 600);

    // Mark as caught
    setHearts((prev) =>
      prev.map((h) => (h.id === heart.id ? { ...h, caught: true } : h))
    );

    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= TARGET_GOAL) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      setGameState('won');
      soundEngine.playCelebrationBurst();
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 select-none max-w-2xl mx-auto w-full">
      {/* Game Header */}
      <div className="w-full text-center mb-4">
        <span className="text-xs font-mono-code text-rose-400 tracking-widest uppercase">
          AI RECEPTIVITY PROTOCOL
        </span>
        <h2 className="text-xl sm:text-3xl font-serif-romantic text-white glow-pink-text tracking-wide mt-1">
          CATCH 12 HEARTS TO UNLOCK THE UNKNOWN
        </h2>
        <p className="text-xs text-rose-200/80 font-sans-ui mt-1">
          Tap or click the floating hearts before time runs out!
        </p>
      </div>

      {/* Dashboard Bar: Score, Timer, Goal */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between px-4 py-2.5 rounded-2xl glass-panel border border-rose-500/25">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono-code text-rose-300">
            SCORE:{' '}
            <strong className="text-white text-sm tabular-nums">
              {score} / {TARGET_GOAL}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Timer
            className={`w-4 h-4 ${
              timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-rose-400'
            }`}
          />
          <span
            className={`text-xs font-mono-code tabular-nums font-semibold ${
              timeLeft <= 5 ? 'text-rose-400' : 'text-rose-200'
            }`}
          >
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => {
            const filled = score >= (i + 1) * 2;
            return (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  filled ? 'bg-rose-400 shadow-[0_0_6px_#ff2d75]' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Play Arena */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-black/60 border border-rose-500/30 overflow-hidden shadow-2xl touch-none">
        {/* Subtle grid lines in background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,45,117,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating Hearts */}
        {hearts.map((h) => {
          if (h.caught) return null;
          return (
            <div
              key={h.id}
              onClick={(e) => handleCatchHeart(h, e)}
              onTouchStart={(e) => handleCatchHeart(h, e)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-100 hover:scale-125 active:scale-95 animate-pulse"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.size}px`,
                height: `${h.size}px`,
                animationDuration: `${1.8 / h.speed}s`,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,45,117,0.7)]"
              >
                <path
                  d="M50,25 C35,5 10,25 30,55 C40,70 50,85 50,85 C50,85 60,70 70,55 C90,25 65,5 50,25 Z"
                  fill={h.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          );
        })}

        {/* Catch Bursts */}
        {bursts.map((b) => (
          <div
            key={b.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-ping"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-white bg-rose-400/50 shadow-[0_0_16px_#ff2d75]" />
          </div>
        ))}

        {/* Victory Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-pink-400 animate-spin" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-romantic font-bold text-white glow-pink-text mb-2">
              RECEPTIVITY UNLOCKED!
            </h3>
            <p className="text-sm text-rose-200/90 font-sans-ui max-w-sm mb-6">
              You caught all {TARGET_GOAL} hearts with {timeLeft} seconds to spare! The AI system has surfaced a hidden message.
            </p>

            <button
              onClick={() => {
                soundEngine.playClick();
                onUnlockSecret();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.6)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>REVEAL THE SECRET MESSAGE 💌</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Time's Up / Retry Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-rose-950/70 border border-rose-500/30 flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6 text-rose-400" />
            </div>

            <h3 className="text-xl sm:text-2xl font-serif-romantic text-rose-100 mb-1">
              Time Expired!
            </h3>
            <p className="text-xs sm:text-sm text-rose-300/80 font-sans-ui max-w-xs mb-5">
              You gathered {score} of {TARGET_GOAL} hearts. Give it another try to reveal the secret!
            </p>

            <button
              onClick={() => {
                soundEngine.playClick();
                startGame();
              }}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-rose-400/40 text-white text-xs font-mono-code tracking-wider uppercase transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETRY CHALLENGE</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <span className="text-[11px] font-mono-code text-rose-400/60">
          Touch or click on floating hearts · Single tap per heart
        </span>
      </div>
    </div>
  );
};
