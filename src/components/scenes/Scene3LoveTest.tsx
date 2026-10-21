import React, { useState } from 'react';
import { AppConfig, QuizOption } from '../../types';
import { soundEngine } from '../../audio/soundEngine';
import { Heart, Sparkles, Check, ArrowRight } from 'lucide-react';

interface Scene3Props {
  config: AppConfig;
  onCompleteQuiz: (accumulatedScore: number, answersSummary: string[]) => void;
}

export const Scene3LoveTest: React.FC<Scene3Props> = ({ config, onCompleteQuiz }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [answers, setAnswers] = useState<{ [qId: number]: QuizOption }>({});
  const [showReaction, setShowReaction] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQ = config.quizQuestions[currentIdx];
  const progressPercent = ((currentIdx + 1) / config.quizQuestions.length) * 100;

  const handleSelectOption = (option: QuizOption) => {
    if (selectedOption || showReaction) return;
    setSelectedOption(option);
    setShowReaction(true);
    soundEngine.playCollectSparkle(1.1);

    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    // After brief playful animation, proceed to next question or complete
    setTimeout(() => {
      if (currentIdx < config.quizQuestions.length - 1) {
        setSelectedOption(null);
        setShowReaction(false);
        setCurrentIdx((prev) => prev + 1);
      } else {
        setIsFinishing(true);
        soundEngine.playHeartPulse(1);
        const totalScore = Object.values(newAnswers).reduce(
          (acc, cur) => acc + cur.romanticScore,
          0
        );
        const summaries = Object.values(newAnswers).map((a) => a.text);
        setTimeout(() => {
          onCompleteQuiz(totalScore, summaries);
        }, 800);
      }
    }, 1100);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 select-none max-w-xl mx-auto w-full">
      {/* Quiz Header & Progress */}
      <div className="w-full mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/20 text-xs font-mono-code text-rose-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>QUESTION {currentIdx + 1} OF {config.quizQuestions.length}</span>
        </div>

        <h2 className="text-xl sm:text-3xl font-serif-romantic font-semibold text-white glow-pink-text tracking-wide">
          LET'S TEST YOUR LOVE ENERGY.
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-4 overflow-hidden border border-rose-500/20">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 transition-all duration-500 shadow-[0_0_10px_#ff2d75]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl relative overflow-hidden transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-serif-romantic text-rose-50 font-normal leading-relaxed text-center mb-6">
          "{currentQ.question}"
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isChosen = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                  isChosen
                    ? 'bg-gradient-to-r from-rose-600/90 to-pink-600/90 text-white shadow-lg shadow-rose-900/50 scale-[1.02] border border-rose-300'
                    : selectedOption
                    ? 'bg-black/30 border border-rose-500/10 text-rose-200/50 opacity-60'
                    : 'bg-black/40 hover:bg-rose-950/40 border border-rose-500/20 hover:border-rose-400/50 text-rose-100 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono-code text-xs font-semibold transition-colors ${
                      isChosen
                        ? 'bg-white text-rose-600 shadow-md'
                        : 'bg-rose-950/60 text-rose-300 group-hover:bg-rose-900/60 border border-rose-500/20'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm sm:text-base font-sans-ui font-medium">
                    {opt.text}
                  </span>
                </div>

                <div className="shrink-0 ml-2">
                  {isChosen ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-rose-400/0 group-hover:text-rose-400/70 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Playful Reaction Notice */}
        {showReaction && (
          <div className="mt-5 p-3 rounded-xl bg-rose-950/70 border border-rose-400/30 text-center animate-in fade-in duration-300">
            <p className="text-xs font-mono-code text-rose-200 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
              <span>{currentQ.aiReaction}</span>
            </p>
          </div>
        )}
      </div>

      {/* Disclaimers & Entertainment Note */}
      <div className="mt-4 text-center">
        <p className="text-[11px] font-mono-code text-rose-400/60">
          Playful entertainment index · Every answer reveals a spark of connection
        </p>
      </div>
    </div>
  );
};
