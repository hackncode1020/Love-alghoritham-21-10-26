import React from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      onClick={onClose}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-rose-950/90 text-rose-100 border border-rose-400/40 shadow-xl shadow-rose-950/50 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 cursor-pointer"
      role="status"
    >
      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
      <span className="text-xs sm:text-sm font-medium tracking-wide font-sans-ui">{message}</span>
      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />
    </div>
  );
};
