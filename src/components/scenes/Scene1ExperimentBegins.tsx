import React, { useEffect, useState } from 'react';
import { AppConfig } from '../../types';
import { soundEngine } from '../../audio/soundEngine';

interface Scene1Props {
  config: AppConfig;
  onStartExperiment: () => void;
}

export const Scene1ExperimentBegins: React.FC<Scene1Props> = ({
  config,
  onStartExperiment,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    // Quick, cinematic pacing: immediately clear within 2s for Reel capture
    const t1 = setTimeout(() => setStage(1), 500); // Tiny pulsing particle appears & lines start connecting
    const t2 = setTimeout(() => setStage(2), 1200); // "INITIALIZING LOVE ALGORITHM..."
    const t3 = setTimeout(() => setStage(3), 2000); // "CAN AN AI UNDERSTAND LOVE?"
    const t4 = setTimeout(() => setStage(4), 2800); // "THERE IS ONLY ONE WAY TO FIND OUT." & button ready

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleClick = () => {
    if (isExpanding) return;
    setIsExpanding(true);
    soundEngine.playHeartPulse(0.9);
    soundEngine.playCelebrationBurst();

    setTimeout(() => {
      onStartExperiment();
    }, 900);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 text-center select-none overflow-hidden">
      {/* Central Heart Formation Graphic */}
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
        {/* Pulsating energy rings on expansion */}
        {isExpanding && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
            <div className="absolute -inset-12 rounded-full border border-pink-500 animate-ping opacity-50" style={{ animationDuration: '1.2s' }} />
            <div className="absolute -inset-24 rounded-full border border-rose-300 animate-ping opacity-30" style={{ animationDuration: '1.6s' }} />
          </>
        )}

        {/* Stage 0 / 1: Tiny pulsing red particle */}
        {stage < 2 && (
          <div className="relative flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_20px_#ff2d75] animate-ping" />
            <div className="absolute w-2 h-2 rounded-full bg-white" />
          </div>
        )}

        {/* Stage 1+: SVG Digital Heart with animated thin glowing circuit lines */}
        {stage >= 1 && (
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full filter drop-shadow-[0_0_20px_rgba(255,45,117,0.5)] transition-all duration-700 ${
              isExpanding ? 'scale-150 opacity-90' : 'scale-100 opacity-100'
            }`}
          >
            {/* Pulsing energy rings */}
            <circle
              cx="100"
              cy="95"
              r={stage >= 3 ? '82' : '40'}
              fill="none"
              stroke="rgba(244, 63, 94, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="animate-spin"
              style={{ animationDuration: '24s' }}
            />
            <circle
              cx="100"
              cy="95"
              r={stage >= 3 ? '92' : '60'}
              fill="none"
              stroke="rgba(255, 45, 117, 0.18)"
              strokeWidth="1"
              strokeDasharray="8 12"
              className="animate-spin"
              style={{ animationDuration: '36s', animationDirection: 'reverse' }}
            />

            {/* Glowing lines connecting nodes */}
            <g stroke="#ff2d75" strokeWidth="1.2" strokeOpacity="0.6">
              <line x1="100" y1="45" x2="65" y2="75" className="transition-all duration-700" />
              <line x1="100" y1="45" x2="135" y2="75" className="transition-all duration-700" />
              <line x1="65" y1="75" x2="60" y2="115" className="transition-all duration-700" />
              <line x1="135" y1="75" x2="140" y2="115" className="transition-all duration-700" />
              <line x1="60" y1="115" x2="100" y2="160" className="transition-all duration-700" />
              <line x1="140" y1="115" x2="100" y2="160" className="transition-all duration-700" />
              <line x1="100" y1="45" x2="100" y2="160" strokeDasharray="3 4" strokeOpacity="0.4" />
              <line x1="65" y1="75" x2="135" y2="75" strokeDasharray="3 4" strokeOpacity="0.4" />
            </g>

            {/* Heart outline path */}
            <path
              d="M100,55 C70,10 20,50 60,110 C80,140 100,165 100,165 C100,165 120,140 140,110 C180,50 130,10 100,55 Z"
              fill="url(#heartGrad)"
              stroke="#ff2d75"
              strokeWidth="1.5"
              className="animate-pulse"
              style={{ animationDuration: '2.4s' }}
            />

            {/* Node dots */}
            <circle cx="100" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="65" cy="75" r="3" fill="#ff2d75" />
            <circle cx="135" cy="75" r="3" fill="#ff2d75" />
            <circle cx="60" cy="115" r="3" fill="#ff2d75" />
            <circle cx="140" cy="115" r="3" fill="#ff2d75" />
            <circle cx="100" cy="160" r="3.5" fill="#f5c7b8" />

            <defs>
              <radialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#881337" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#050507" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Typography Progression */}
      <div className="max-w-xl mx-auto space-y-4 min-h-[140px] flex flex-col items-center justify-center">
        {stage >= 2 && (
          <p className="text-xs sm:text-sm font-mono-code text-rose-400/90 tracking-widest uppercase transition-opacity duration-500">
            {config.openingText.systemInit}
          </p>
        )}

        {stage >= 3 && (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif-romantic font-normal tracking-wide text-white glow-pink-text leading-tight transition-all duration-700">
            {config.openingText.coreQuestion}
          </h1>
        )}

        {stage >= 4 && (
          <p className="text-sm sm:text-base font-serif-romantic italic text-rose-200/80 tracking-wide transition-opacity duration-700">
            {config.openingText.subHook}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className={`mt-8 transition-all duration-700 ${stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <button
          onClick={handleClick}
          disabled={isExpanding}
          className="group relative px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:via-pink-500 hover:to-rose-500 text-white font-medium text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(255,45,117,0.5)] hover:shadow-[0_0_45px_rgba(255,45,117,0.8)] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            {config.openingText.buttonLabel}
          </span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-[11px] font-mono-code text-rose-400/50 tracking-wider">
          {config.creatorTag}
        </span>
      </div>
    </div>
  );
};
