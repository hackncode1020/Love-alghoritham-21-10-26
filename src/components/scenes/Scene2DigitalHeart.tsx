import React, { useState, useEffect } from 'react';
import { DigitalHeartSculpture } from '../canvas/DigitalHeartSculpture';
import { soundEngine } from '../../audio/soundEngine';
import { Heart, Activity, Radio, Cpu, Sparkles } from 'lucide-react';

interface Scene2Props {
  onScanComplete: () => void;
}

export const Scene2DigitalHeart: React.FC<Scene2Props> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState<string>('');

  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    soundEngine.playHeartPulse(1);
    soundEngine.playScanBeam();

    const messages = [
      'CALIBRATING EMOTIONAL RESONANCE...',
      'SYNCHRONIZING PULSE VECTORS...',
      'MAPPING INTANGIBLE FREQUENCIES...',
      'SIGNAL LOCK CONFIRMED. READY.',
    ];

    let step = 0;
    setScanMessage(messages[0]);

    const interval = setInterval(() => {
      step++;
      if (step < messages.length) {
        setScanMessage(messages[step]);
      }
    }, 550);

    const startTime = Date.now();
    const duration = 2300;

    const anim = () => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min(1, elapsed / duration);
      setScanProgress(prog);

      if (prog < 1) {
        requestAnimationFrame(anim);
      } else {
        clearInterval(interval);
        soundEngine.playCollectSparkle();
        setTimeout(() => {
          onScanComplete();
        }, 400);
      }
    };

    requestAnimationFrame(anim);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 text-center select-none">
      {/* Narrative Telemetry Bar (Visual Storytelling) */}
      <div className="w-full max-w-md mx-auto mb-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/40 border border-rose-500/20 text-[11px] font-mono-code text-rose-300/80">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span>LOVE SYSTEM: ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-pink-400" />
          <span>SIGNAL: DETECTED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-rose-300" />
          <span>ANALYSIS: READY</span>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-xs font-mono-code text-rose-400/80 tracking-widest uppercase">
          AI BIOMETRIC CORE
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif-romantic text-white glow-pink-text tracking-wide mt-1">
          The Digital Heart Sculpture
        </h2>
        <p className="text-xs text-rose-200/70 max-w-sm mx-auto mt-1 font-sans-ui">
          Touch or move across the heart to tilt the neural orbital rings.
        </p>
      </div>

      {/* The Digital Heart Sculpture */}
      <div className="relative my-2">
        <DigitalHeartSculpture
          size={320}
          isScanning={isScanning}
          scanProgress={scanProgress}
          pulseSpeed={isScanning ? 1.8 : 1}
          onHeartClick={handleStartScan}
        />

        {/* Fictional scanning status badge overlay */}
        {isScanning && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-rose-950/90 border border-rose-400/60 shadow-lg shadow-rose-950/80 backdrop-blur-md whitespace-nowrap">
            <div className="flex items-center gap-2 text-xs font-mono-code text-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-spin" />
              <span>{scanMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className="relative px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:via-pink-500 hover:to-rose-500 text-white font-medium text-sm sm:text-base tracking-wider uppercase shadow-[0_0_25px_rgba(255,45,117,0.45)] hover:shadow-[0_0_40px_rgba(255,45,117,0.7)] transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <Heart className={`w-4 h-4 fill-white ${isScanning ? 'animate-ping' : ''}`} />
            {isScanning ? 'SCANNING PULSE...' : 'SCAN MY HEART'}
          </span>
        </button>

        <span className="text-[11px] font-mono-code text-rose-400/60 tracking-wider">
          Visual simulation · No biological data recorded
        </span>
      </div>
    </div>
  );
};
