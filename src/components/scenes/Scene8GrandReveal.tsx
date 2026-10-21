import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { DigitalHeartSculpture } from '../canvas/DigitalHeartSculpture';
import { Heart, Copy, RotateCcw, Check, Sparkles, Share2 } from 'lucide-react';

interface Scene8Props {
  config: AppConfig;
  onResetExperience: () => void;
  onShowToast: (msg: string) => void;
}

export const Scene8GrandReveal: React.FC<Scene8Props> = ({
  config,
  onResetExperience,
  onShowToast,
}) => {
  const [stage, setStage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fallbackModalOpen, setFallbackModalOpen] = useState(false);

  useEffect(() => {
    // Cinematic staged reveal
    const t1 = setTimeout(() => {
      setStage(1);
      soundEngine.playHeartPulse(0.8);
    }, 800); // Line 1: THE ALGORITHM TRIED TO EXPLAIN LOVE...

    const t2 = setTimeout(() => {
      setStage(2);
      soundEngine.playHeartPulse(1.0);
    }, 2200); // Line 2: BUT SOME THINGS AREN'T MEANT TO BE CALCULATED.

    const t3 = setTimeout(() => {
      setStage(3);
      soundEngine.playCelebrationBurst();
    }, 3800); // Line 3: THEY'RE MEANT TO BE FELT. ❤️

    const t4 = setTimeout(() => {
      setStage(4);
    }, 5200); // Title & Final Credits

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleCopyMessage = async () => {
    soundEngine.playClick();
    const textToCopy = config.defaultShareMessage;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        onShowToast('Love message copied to clipboard! 💌');
      } else {
        setFallbackModalOpen(true);
      }
    } catch {
      setFallbackModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 select-none max-w-2xl mx-auto w-full text-center">
      {/* Giant Shimmering Particle Heart Sculpture */}
      <div className="relative my-2">
        <DigitalHeartSculpture
          size={340}
          pulseSpeed={0.9}
          interactive={true}
          grandRevealMode={true}
        />
      </div>

      {/* Narrative Staged Message */}
      <div className="min-h-[170px] flex flex-col items-center justify-center space-y-3 max-w-xl mx-auto my-3">
        {stage >= 1 && (
          <p className="text-sm sm:text-base font-serif-romantic text-rose-300/90 tracking-wide transition-all duration-700 animate-in fade-in">
            {config.finalRevealText.line1}
          </p>
        )}

        {stage >= 2 && (
          <p className="text-base sm:text-xl font-serif-romantic italic text-rose-100 font-light tracking-wide transition-all duration-700 animate-in fade-in">
            {config.finalRevealText.line2}
          </p>
        )}

        {stage >= 3 && (
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-romantic font-semibold text-white glow-rosegold-text tracking-wide transition-all duration-1000 animate-in fade-in zoom-in-95 leading-tight">
            {config.finalRevealText.line3}
          </h2>
        )}
      </div>

      {/* Grand Composition Title & Credits */}
      {stage >= 4 && (
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h1 className="text-xl sm:text-2xl font-serif-romantic font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 uppercase">
              {config.finalRevealText.title}
            </h1>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>

          <p className="text-xs sm:text-sm font-serif-romantic italic text-rose-200/80 mb-5">
            "{config.finalRevealText.subtitle}"
          </p>

          {/* Action CTAs: Experience Again & Copy Message */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onResetExperience();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-rose-400/40 text-rose-100 font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-rose-300" />
              <span>EXPERIENCE AGAIN ❤️</span>
            </button>

            <button
              onClick={handleCopyMessage}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.5)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>COPIED! 💌</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY A LOVE MESSAGE 💌</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-500/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-code text-rose-400/70 gap-2">
            <span>{config.finalRevealText.credit}</span>
            <span>NO CAMERAS · NO ALGORITHMS · ONLY CODE</span>
          </div>
        </div>
      )}

      {/* Fallback Manual Copy Modal if clipboard API is blocked */}
      {fallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl bg-[#0d070b] border border-rose-500/30 max-w-md w-full text-left">
            <h4 className="text-base font-serif-romantic text-rose-100 font-bold mb-2">
              Select and Copy Love Message:
            </h4>
            <textarea
              readOnly
              value={config.defaultShareMessage}
              rows={4}
              className="w-full p-3 rounded-xl bg-black/80 border border-rose-500/30 text-rose-200 text-xs font-sans-ui mb-4 select-all"
            />
            <button
              onClick={() => setFallbackModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-mono-code cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
