import React, { useState } from 'react';
import { X, Heart, Copy, RotateCcw, Check, Sparkles } from 'lucide-react';
import { AppConfig } from '../../types';
import { soundEngine } from '../../audio/soundEngine';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (updated: AppConfig) => void;
  onShowToast: (msg: string) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onShowToast,
}) => {
  const [customMsg, setCustomMsg] = useState(
    config.secretMessageStages[config.secretMessageStages.length - 1]
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playClick();
    const updatedStages = [...config.secretMessageStages];
    updatedStages[updatedStages.length - 1] = customMsg;
    onSaveConfig({
      ...config,
      secretMessageStages: updatedStages,
    });
    onShowToast('Custom message saved!');
    onClose();
  };

  const handleCopy = async () => {
    soundEngine.playClick();
    try {
      await navigator.clipboard.writeText(customMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShowToast('Love message copied to clipboard! 💌');
    } catch {
      onShowToast('Select and copy the text below');
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setCustomMsg(
      'SOME THINGS ARE VALUABLE BECAUSE OF THE FEELINGS AND EFFORT WE PUT INTO THEM. ❤️'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-[#0d070b] border border-rose-500/30 rounded-3xl shadow-2xl text-rose-100">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-950/60 text-rose-300 transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-serif-romantic font-semibold tracking-wide text-rose-100">
            Personalize The Secret Love Message
          </h3>
        </div>

        <p className="text-xs text-rose-300/80 mb-5 leading-relaxed font-sans-ui">
          Customize the final secret message that appears inside the digital origami envelope.
          Send it to someone you care about or save your personal sentiment.
        </p>

        <div className="mb-5">
          <label className="block text-xs font-mono-code text-rose-400 mb-2">
            FINAL SECRET MESSAGE:
          </label>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            rows={4}
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm font-serif-romantic leading-relaxed resize-none"
            placeholder="Type your romantic message here..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono-code text-rose-300 transition-colors cursor-pointer"
              title="Reset to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/20 text-xs font-mono-code text-rose-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 text-xs text-rose-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-medium tracking-wide shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Save Message</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-rose-500/10 flex items-center justify-between text-[11px] font-mono-code text-rose-400/60">
          <span>CREATOR: {config.creatorHandle}</span>
          <span>{config.projectName}</span>
        </div>
      </div>
    </div>
  );
};
