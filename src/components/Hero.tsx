import React from 'react';
import { Sparkles, Dumbbell, ShieldCheck, Flame, Zap, ArrowDown, Activity } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[200px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Powered by Google Gemini AI</span>
        </div>

        {/* Primary Titles */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Buddy</span>
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-2 tracking-wide uppercase">
          AI Fitness Plan Generator
        </p>
        <p className="text-base sm:text-xl text-emerald-400/90 italic font-medium mt-2">
          “Your AI-powered personal fitness companion”
        </p>

        {/* Hero Hook */}
        <div className="mt-6 max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Build Better Habits With AI
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Get a personalized 7-day workout plan powered by Google Gemini. Tailored exercises, structured warm-ups, recovery protocols, and goal-specific nutrition advice that evolves with your feedback.
          </p>
        </div>

        {/* Key Feature Highlights */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">7-Day Split</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Day 1 to 7 structured warm-up, sets, reps & cool-down</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-400 flex items-center justify-center mb-2">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Nutrition Tips</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Goal-aligned macronutrient, hydration & recovery tips</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Plan Evolution</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Submit feedback to modify and regenerate your schedule</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Safety-First</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Beginner progressions & wellness boundaries</div>
          </div>
        </div>

        {/* CTA to scroll */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start Your Profile</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
