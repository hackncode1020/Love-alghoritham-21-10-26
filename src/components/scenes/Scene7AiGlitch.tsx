import React, { useState, useEffect } from 'react';
import { DigitalHeartSculpture } from '../canvas/DigitalHeartSculpture';
import { soundEngine } from '../../audio/soundEngine';
import { HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface Scene7Props {
  onTransitionToGrandReveal: () => void;
}

export const Scene7AiGlitch: React.FC<Scene7Props> = ({ onTransitionToGrandReveal }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: "ANALYSIS COMPLETE."
    soundEngine.playHeartPulse(0.7);

    // Stage 1: "RESULT: INCONCLUSIVE." (after 1.3s)
    const t1 = setTimeout(() => {
      setStage(1);
      soundEngine.playGlitchSound();
    }, 1300);

    // Stage 2: "WHY?" Glowing question mark (after 2.6s)
    const t2 = setTimeout(() => {
      setStage(2);
      soundEngine.playHeartPulse(1.2);
    }, 2600);

    // Stage 3: Heart pulses fast, final calculation attempt (after 4.0s)
    const t3 = setTimeout(() => {
      setStage(3);
      soundEngine.playScanBeam();
    }, 4000);

    // Stage 4: "ERROR 404: LOVE CANNOT BE FULLY MEASURED." (after 5.5s)
    const t4 = setTimeout(() => {
      setStage(4);
      soundEngine.playGlitchSound();
      soundEngine.playCelebrationBurst();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 select-none max-w-xl mx-auto w-full text-center">
      {/* Narrative Telemetry Status */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/30 text-xs font-mono-code text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>SYSTEM COMPUTATION CORE</span>
        </div>
      </div>

      {/* Narrative Staged Statements */}
      <div className="min-h-[140px] flex flex-col items-center justify-center space-y-3 mb-4">
        {stage >= 0 && (
          <p className="text-xs sm:text-sm font-mono-code text-rose-400 tracking-widest uppercase transition-opacity">
            ANALYSIS COMPLETE.
          </p>
        )}

        {stage >= 1 && (
          <h2 className="text-xl sm:text-2xl font-mono-code font-bold text-amber-200 tracking-wider">
            RESULT: INCONCLUSIVE.
          </h2>
        )}

        {stage >= 2 && (
          <div className="flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-3xl sm:text-4xl font-serif-romantic text-white glow-pink-text font-bold">
              WHY?
            </h3>
            <HelpCircle className="w-7 h-7 text-rose-400 animate-pulse" />
          </div>
        )}

        {stage >= 3 && stage < 4 && (
          <p className="text-xs font-mono-code text-rose-300/80 animate-pulse">
            ATTEMPTING RE-CALCULATION ACROSS INFINITE DIMENSIONS...
          </p>
        )}

        {stage >= 4 && (
          <div className="mt-2 p-3 sm:p-4 rounded-2xl bg-black/60 border border-rose-400/50 shadow-[0_0_30px_rgba(255,45,117,0.4)] animate-in fade-in zoom-in-95 duration-700">
            <h1 className="text-xl sm:text-3xl font-mono-code font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-200 glow-rosegold-text">
              ERROR 404: LOVE CANNOT BE FULLY MEASURED.
            </h1>
          </div>
        )}
      </div>

      {/* The Glitching / Dissolving Digital Heart */}
      <div className="relative my-2">
        <DigitalHeartSculpture
          size={290}
          glitchMode={stage >= 1}
          pulseSpeed={stage >= 2 ? 2.4 : 1.2}
          interactive={false}
        />
      </div>

      {/* Button to proceed to Grand Reveal */}
      <div className={`mt-6 transition-all duration-700 ${stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <button
          onClick={() => {
            soundEngine.playClick();
            onTransitionToGrandReveal();
          }}
          className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(255,45,117,0.6)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>WITNESS THE GRAND REVEAL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-[11px] font-mono-code text-rose-400/50">
          The code surrendered to sentiment
        </span>
      </div>
    </div>
  );
};
