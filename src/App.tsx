/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SceneId, AppConfig } from './types';
import { initialLoveAlgorithmConfig } from './config/loveAlgorithmConfig';
import { HeartBackgroundCanvas } from './components/canvas/HeartBackgroundCanvas';
import { Scene1ExperimentBegins } from './components/scenes/Scene1ExperimentBegins';
import { Scene2DigitalHeart } from './components/scenes/Scene2DigitalHeart';
import { Scene3LoveTest } from './components/scenes/Scene3LoveTest';
import { Scene4LoveMeter } from './components/scenes/Scene4LoveMeter';
import { Scene5HeartGame } from './components/scenes/Scene5HeartGame';
import { Scene6SecretMessage } from './components/scenes/Scene6SecretMessage';
import { Scene7AiGlitch } from './components/scenes/Scene7AiGlitch';
import { Scene8GrandReveal } from './components/scenes/Scene8GrandReveal';
import { AudioPlayerWidget } from './components/common/AudioPlayerWidget';
import { InstagramReelBar } from './components/common/InstagramReelBar';
import { PersonalizeModal } from './components/common/PersonalizeModal';
import { Toast } from './components/common/Toast';
import { Heart, Sparkles, SlidersHorizontal } from 'lucide-react';
import { soundEngine } from './audio/soundEngine';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(initialLoveAlgorithmConfig);
  const [currentScene, setCurrentScene] = useState<SceneId>('scene1_init');
  const [quizScore, setQuizScore] = useState<number>(95);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [reelFrameActive, setReelFrameActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  // Determine background canvas mood
  const getCanvasIntensity = () => {
    switch (currentScene) {
      case 'scene1_init':
        return 'subtle';
      case 'scene4_meter':
        return 'celebration';
      case 'scene6_secret':
      case 'scene8_reveal':
        return 'rose_petals';
      case 'scene7_glitch':
        return 'glitch';
      default:
        return 'normal';
    }
  };

  const handleResetExperience = () => {
    soundEngine.playHeartPulse(0.6);
    setCurrentScene('scene1_init');
    setQuizScore(95);
    setQuizAnswers([]);
    showToast('Experience restarted from beginning ❤️');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-[#fdf2f4] overflow-x-hidden flex flex-col justify-between selection:bg-rose-500/30">
      {/* Background Animated Canvas with procedural particles, neural lines & rose petals */}
      <HeartBackgroundCanvas intensity={getCanvasIntensity()} />

      {/* Top Bar Contract: Brand Zone — Nav Links — Primary Action */}
      <header className="relative z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 border-b border-rose-500/15 bg-black/40 backdrop-blur-md">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={handleResetExperience}
          className="flex items-center gap-2 text-sm sm:text-base font-serif-romantic font-bold tracking-widest text-rose-100 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>THE LOVE ALGORITHM</span>
        </button>

        {/* Zone 2: Concise navigation hints */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono-code text-rose-300/70">
          <button
            onClick={() => setCurrentScene('scene1_init')}
            className={`hover:text-rose-200 transition-colors cursor-pointer ${
              currentScene === 'scene1_init' ? 'text-rose-300 font-semibold underline' : ''
            }`}
          >
            Origin
          </button>
          <button
            onClick={() => setCurrentScene('scene3_quiz')}
            className={`hover:text-rose-200 transition-colors cursor-pointer ${
              currentScene === 'scene3_quiz' ? 'text-rose-300 font-semibold underline' : ''
            }`}
          >
            Test
          </button>
          <button
            onClick={() => setCurrentScene('scene5_game')}
            className={`hover:text-rose-200 transition-colors cursor-pointer ${
              currentScene === 'scene5_game' ? 'text-rose-300 font-semibold underline' : ''
            }`}
          >
            Mini-Game
          </button>
          <button
            onClick={() => setCurrentScene('scene8_reveal')}
            className={`hover:text-rose-200 transition-colors cursor-pointer ${
              currentScene === 'scene8_reveal' ? 'text-rose-300 font-semibold underline' : ''
            }`}
          >
            Reveal
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Audio Widget */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsPersonalizeOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 hover:text-white text-xs font-mono-code transition-all cursor-pointer whitespace-nowrap"
            title="Personalize secret message"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Personalize</span>
          </button>

          <AudioPlayerWidget />
        </div>
      </header>

      {/* Main Experience Container */}
      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all duration-500 ${
          reelFrameActive
            ? 'max-w-[420px] mx-auto w-full min-h-[780px] my-4 rounded-[40px] border-2 border-rose-500/40 shadow-[0_0_60px_rgba(255,45,117,0.3)] bg-black/60 overflow-hidden'
            : 'w-full'
        }`}
      >
        {currentScene === 'scene1_init' && (
          <Scene1ExperimentBegins
            config={config}
            onStartExperiment={() => setCurrentScene('scene2_heart')}
          />
        )}

        {currentScene === 'scene2_heart' && (
          <Scene2DigitalHeart
            onScanComplete={() => setCurrentScene('scene3_quiz')}
          />
        )}

        {currentScene === 'scene3_quiz' && (
          <Scene3LoveTest
            config={config}
            onCompleteQuiz={(total, summaries) => {
              setQuizScore(total);
              setQuizAnswers(summaries);
              setCurrentScene('scene4_meter');
            }}
          />
        )}

        {currentScene === 'scene4_meter' && (
          <Scene4LoveMeter
            config={config}
            quizScore={quizScore}
            onAdvanceToGame={() => setCurrentScene('scene5_game')}
          />
        )}

        {currentScene === 'scene5_game' && (
          <Scene5HeartGame
            onUnlockSecret={() => setCurrentScene('scene6_secret')}
          />
        )}

        {currentScene === 'scene6_secret' && (
          <Scene6SecretMessage
            config={config}
            onOpenPersonalize={() => setIsPersonalizeOpen(true)}
            onProceedToGlitch={() => setCurrentScene('scene7_glitch')}
          />
        )}

        {currentScene === 'scene7_glitch' && (
          <Scene7AiGlitch
            onTransitionToGrandReveal={() => setCurrentScene('scene8_reveal')}
          />
        )}

        {currentScene === 'scene8_reveal' && (
          <Scene8GrandReveal
            config={config}
            onResetExperience={handleResetExperience}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Reel Director / Quick Jump Toolbar */}
      <InstagramReelBar
        currentScene={currentScene}
        onSelectScene={(scene) => setCurrentScene(scene)}
        reelFrameActive={reelFrameActive}
        onToggleReelFrame={() => setReelFrameActive(!reelFrameActive)}
      />

      {/* Personalize Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        config={config}
        onSaveConfig={(updated) => setConfig(updated)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
