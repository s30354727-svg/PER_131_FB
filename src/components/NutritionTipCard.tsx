import React from 'react';
import { Lightbulb, Droplets, Moon, Utensils, CheckCircle2, Flame, HeartPulse } from 'lucide-react';
import { NutritionTip } from '../types/fitness';

interface NutritionTipCardProps {
  nutritionTip: NutritionTip;
  fitnessGoal?: string;
}

export const NutritionTipCard: React.FC<NutritionTipCardProps> = ({
  nutritionTip,
  fitnessGoal,
}) => {
  if (!nutritionTip) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl mb-10">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shadow-amber-400/10">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                AI Nutrition & Recovery Tip
              </span>
              {fitnessGoal && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  {fitnessGoal}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {nutritionTip.title || 'Goal-Calibrated Fueling & Recovery'}
            </h3>
          </div>
        </div>

        {nutritionTip.focus && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-300">{nutritionTip.focus}</span>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Column 1: Actionable Nutrition Habits */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-1">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Target Nutrition Habits</span>
          </div>
          <div className="space-y-2.5">
            {nutritionTip.actionableTips && nutritionTip.actionableTips.length > 0 ? (
              nutritionTip.actionableTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition text-xs sm:text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Maintain balanced macronutrient distribution and adequate protein intake.</p>
            )}
          </div>
        </div>

        {/* Column 2: Hydration & Sleep Recovery Protocol */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Hydration */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-slate-300">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Hydration Protocol</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-cyan-100/90">
              {nutritionTip.hydrationAdvice || 'Drink 2.5 to 3.5 liters of clean water daily; increase during heavy training.'}
            </p>
          </div>

          {/* Sleep Recovery */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Sleep & Recovery</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-indigo-100/90">
              {nutritionTip.recoveryAdvice || 'Prioritize 7-8.5 hours of uninterrupted sleep for peak cellular repair and hormonal balance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
