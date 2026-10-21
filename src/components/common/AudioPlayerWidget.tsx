import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const AudioPlayerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe(() => {
      const status = soundEngine.getStatus();
      setIsPlaying(status.isPlaying);
      setIsMuted(status.isMuted);
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = () => {
    soundEngine.playClick();
    soundEngine.togglePlay();
  };

  const handleToggleMute = () => {
    soundEngine.playClick();
    soundEngine.toggleMute();
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/20 shadow-lg text-xs font-mono-code text-rose-200/90 transition-all hover:border-rose-500/40">
        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-rose-500/15 transition-colors cursor-pointer text-xs"
          title={isPlaying ? 'Pause ambient soundtrack' : 'Play ambient soundtrack'}
          aria-label={isPlaying ? 'Pause ambient soundtrack' : 'Play ambient soundtrack'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          ) : (
            <Play className="w-3.5 h-3.5 text-rose-300" />
          )}
          <span className="hidden sm:inline text-[11px] tracking-wide">
            {isPlaying ? 'AUDIO ON' : 'SOUND'}
          </span>
        </button>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 px-1" aria-hidden="true">
            <span className="w-0.5 bg-rose-400 animate-pulse h-2" style={{ animationDuration: '400ms' }} />
            <span className="w-0.5 bg-rose-300 animate-pulse h-3" style={{ animationDuration: '650ms' }} />
            <span className="w-0.5 bg-rose-500 animate-pulse h-1.5" style={{ animationDuration: '500ms' }} />
          </div>
        )}

        <button
          onClick={handleToggleMute}
          className="p-1 rounded-full hover:bg-rose-500/15 text-rose-300/80 hover:text-rose-200 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400/60" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
