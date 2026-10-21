import React, { useState } from 'react';
import { Video, ChevronDown, ChevronUp, Sparkles, Smartphone } from 'lucide-react';
import { SceneId } from '../../types';
import { soundEngine } from '../../audio/soundEngine';

interface InstagramReelBarProps {
  currentScene: SceneId;
  onSelectScene: (scene: SceneId) => void;
  reelFrameActive: boolean;
  onToggleReelFrame: () => void;
}

export const InstagramReelBar: React.FC<InstagramReelBarProps> = ({
  currentScene,
  onSelectScene,
  reelFrameActive,
  onToggleReelFrame,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const reelMoments: { id: SceneId; title: string; label: string }[] = [
    { id: 'scene1_init', title: 'Hook: "Can AI Understand Love?"', label: '1. Hook' },
    { id: 'scene2_heart', title: 'Digital Heart Scan', label: '2. Heart Scan' },
    { id: 'scene4_meter', title: 'Love Meter Reaches 100%', label: '3. Meter 100%' },
    { id: 'scene5_game', title: 'Heart-Catching Mini-game', label: '4. Mini-Game' },
    { id: 'scene7_glitch', title: 'Error 404 & Grand Reveal', label: '5. Grand Reveal' },
  ];

  const handleJump = (id: SceneId) => {
    soundEngine.playClick();
    onSelectScene(id);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto">
      <div className="bg-black/75 backdrop-blur-md border border-rose-500/25 rounded-2xl shadow-2xl p-2 transition-all">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex items-center gap-2 text-xs font-mono-code text-rose-300">
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline font-semibold tracking-wider text-[11px] uppercase">
              Reel Director
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleReelFrame();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                reelFrameActive
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50'
                  : 'bg-white/5 text-rose-300/70 hover:bg-white/10 hover:text-rose-200'
              }`}
              title="Toggle 9:16 mobile frame guide for Instagram Reels recording"
            >
              <Smartphone className="w-3 h-3" />
              <span className="text-[11px]">9:16 Guide</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/40 text-rose-300 text-xs hover:bg-rose-900/50 transition-colors cursor-pointer"
              aria-label={isOpen ? 'Hide scene shortcuts' : 'Show scene shortcuts'}
            >
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span className="text-[11px] font-mono-code">5 Reel Moments</span>
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="pt-2 mt-2 border-t border-rose-500/15 flex flex-wrap gap-1.5 justify-center">
            {reelMoments.map((moment) => {
              const isActive = currentScene === moment.id;
              return (
                <button
                  key={moment.id}
                  onClick={() => handleJump(moment.id)}
                  title={moment.title}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/30'
                      : 'bg-white/5 text-rose-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {moment.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
