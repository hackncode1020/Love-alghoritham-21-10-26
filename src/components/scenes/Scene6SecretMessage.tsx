import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { Mail, MailOpen, Edit3, Sparkles, ArrowRight, X } from 'lucide-react';

interface Scene6Props {
  config: AppConfig;
  onOpenPersonalize: () => void;
  onProceedToGlitch: () => void;
}

export const Scene6SecretMessage: React.FC<Scene6Props> = ({
  config,
  onOpenPersonalize,
  onProceedToGlitch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    soundEngine.playCelebrationBurst();
    soundEngine.playHeartPulse(0.8);
    setActiveStage(0);
  };

  const handleCloseEnvelope = () => {
    soundEngine.playClick();
    setIsOpen(false);
    setActiveStage(0);
  };

  // Staged text progression
  useEffect(() => {
    if (!isOpen) return;

    const timers: number[] = [];
    config.secretMessageStages.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setActiveStage(idx);
        soundEngine.playHeartPulse(0.3);
      }, (idx + 1) * 1400);
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isOpen, config.secretMessageStages]);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 select-none max-w-xl mx-auto w-full text-center">
      {/* Narrative Header */}
      <div className="mb-6">
        <span className="text-xs font-mono-code text-rose-400 tracking-widest uppercase">
          ANOMALY DETECTED IN DATA STREAM
        </span>
        <h2 className="text-xl sm:text-3xl font-serif-romantic text-white glow-pink-text tracking-wide mt-1">
          THE ALGORITHM FOUND SOMETHING UNEXPECTED.
        </h2>
      </div>

      {/* Digital Glowing Origami Envelope Graphic */}
      <div className="relative w-64 sm:w-72 my-4">
        {!isOpen ? (
          /* Closed Glowing Digital Envelope */
          <div
            onClick={handleOpenEnvelope}
            className="group relative cursor-pointer p-8 rounded-3xl glass-panel border border-rose-500/40 hover:border-rose-400 shadow-[0_0_35px_rgba(255,45,117,0.3)] hover:shadow-[0_0_50px_rgba(255,45,117,0.6)] transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Pulsing glow ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-amber-500/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-400/40 flex items-center justify-center shadow-inner">
                <Mail className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-mono-code text-rose-300 tracking-wider uppercase">
                ENCRYPTED HEART NOTE
              </span>
              <p className="text-xs text-rose-200/70 font-sans-ui">
                Click or tap the envelope to open
              </p>
            </div>
          </div>
        ) : (
          /* Opened Envelope Letter Card */
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#240c18] to-[#12050e] border border-rose-400/50 shadow-[0_0_45px_rgba(244,63,94,0.4)] animate-in fade-in zoom-in-95 duration-500 text-rose-100">
            {/* Top Bar inside envelope */}
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-mono-code text-rose-300">
                <MailOpen className="w-3.5 h-3.5 text-pink-400" />
                <span>DECRYPTED TRANSMISSION</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPersonalize}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 text-xs transition-colors cursor-pointer"
                  title="Customize this message"
                  aria-label="Customize love message"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCloseEnvelope}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 text-xs transition-colors cursor-pointer"
                  title="Close envelope"
                  aria-label="Close envelope"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Staged Message Lines */}
            <div className="space-y-4 py-2 min-h-[200px] flex flex-col justify-center">
              {config.secretMessageStages.map((msg, index) => {
                const isVisible = index <= activeStage;
                const isFinal = index === config.secretMessageStages.length - 1;

                if (!isVisible) return null;

                return (
                  <p
                    key={index}
                    className={`transition-all duration-700 animate-in fade-in slide-in-from-bottom-2 ${
                      isFinal
                        ? 'text-base sm:text-lg font-serif-romantic font-semibold text-rose-100 glow-rosegold-text pt-2 leading-relaxed'
                        : 'text-sm sm:text-base font-serif-romantic text-rose-200/90 leading-relaxed'
                    }`}
                  >
                    "{msg}"
                  </p>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/15 flex items-center justify-between text-[11px] font-mono-code text-rose-400/60">
              <button
                onClick={handleCloseEnvelope}
                className="hover:text-rose-200 transition-colors cursor-pointer underline underline-offset-2"
              >
                Fold & close
              </button>
              <span>{config.creatorHandle}</span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        {!isOpen ? (
          <button
            onClick={handleOpenEnvelope}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>REVEAL THE MESSAGE 💌</span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundEngine.playClick();
              onProceedToGlitch();
            }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>OBSERVE AI CORE REACTION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={onOpenPersonalize}
          className="text-xs font-mono-code text-rose-400/70 hover:text-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <Edit3 className="w-3 h-3" />
          <span>Customize or Edit This Secret Note</span>
        </button>
      </div>
    </div>
  );
};
