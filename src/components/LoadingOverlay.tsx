import React, { useState, useEffect } from 'react';
import { Dumbbell, Sparkles, RefreshCw, Flame, HeartPulse } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const FITNESS_TIPS = [
  'Analyzing your biomechanical parameters, training intensity, and available days...',
  'Structuring warm-up protocols and progressive resistance movements...',
  'Balancing volume, rest intervals, and muscle recovery time...',
  'Synthesizing goal-specific nutrition and hydration habits...',
  'Fine-tuning 7-day schedule with Gemini 3.8 Flash intelligence...',
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'FitBuddy AI is creating your personalized plan…',
  subMessage,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % FITNESS_TIPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Animated Dumbbell / Spinner */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-lime-500/20 border-b-lime-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
            <Dumbbell className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Main message */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {message}
        </h3>

        {/* Submessage or cycling tip */}
        <p className="text-xs sm:text-sm text-emerald-400 font-semibold mt-3 min-h-[40px] flex items-center justify-center">
          {subMessage || FITNESS_TIPS[tipIndex]}
        </p>

        {/* Progress bar animation */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 mt-6 overflow-hidden border border-slate-800">
          <div className="bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-400 h-1.5 rounded-full animate-[shimmer_2s_infinite] w-3/4" />
        </div>

        <p className="text-[11px] text-slate-500 mt-4">
          FitBuddy AI • Powered by Google Gemini
        </p>
      </div>
    </div>
  );
};
