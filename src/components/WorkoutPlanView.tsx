import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  Printer,
  Download,
  MessageSquarePlus,
  CheckCircle,
  Circle,
  Smile,
  ShieldAlert,
  Calendar,
  Layers,
  Heart,
  Zap,
} from 'lucide-react';
import { FitBuddyUserRecord, WorkoutPlan, WorkoutDay } from '../types/fitness';
import { NutritionTipCard } from './NutritionTipCard';

interface WorkoutPlanViewProps {
  userRecord: FitBuddyUserRecord;
  activePlan: WorkoutPlan;
  onGenerateNew: () => void;
  onOpenFeedback: () => void;
  onComparePlans?: () => void;
  isUpdatedVersion?: boolean;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  userRecord,
  activePlan,
  onGenerateNew,
  onOpenFeedback,
  onComparePlans,
  isUpdatedVersion = false,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<number | 'all'>('all');
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  const toggleExercise = (exerciseKey: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
=============================================================
FITBUDDY – AI PERSONAL FITNESS PLAN
Generated for: ${userRecord.fullName} (${userRecord.userId})
Goal: ${userRecord.fitnessGoal} | Intensity: ${userRecord.workoutIntensity} | Experience: ${userRecord.experienceLevel}
Duration: ${userRecord.preferredDuration} | Days: ${userRecord.availableDays} days/week
Generated At: ${new Date(activePlan.generatedAt).toLocaleString()}
${isUpdatedVersion ? 'STATUS: REVISED WITH USER FEEDBACK' : 'STATUS: ORIGINAL AI PLAN'}
=============================================================

MOTIVATIONAL MESSAGE:
"${activePlan.motivationalQuote}"

PLAN OVERVIEW:
${activePlan.overview}

-------------------------------------------------------------
7-DAY WORKOUT SCHEDULE
-------------------------------------------------------------
${activePlan.days
  .map(
    (day) => `
DAY ${day.day}: ${day.title}
Workout Focus: ${day.focus}
Warm-up (${day.warmup.duration}):
${day.warmup.activities.map((a) => `  * ${a}`).join('\n')}

Main Exercises:
${day.exercises
  .map(
    (ex, i) =>
      `  ${i + 1}. ${ex.name} – ${ex.sets} × ${ex.reps} ${ex.targetMuscles ? `[${ex.targetMuscles}]` : ''} ${
        ex.notes ? `(${ex.notes})` : ''
      }`
  )
  .join('\n')}

Rest: ${day.restTime}
Cool-down (${day.cooldown.duration}):
${day.cooldown.activities.map((a) => `  * ${a}`).join('\n')}
Recovery Suggestion: ${day.recoverySuggestion}
`
  )
  .join('\n-------------------------------------------------------------\n')}

=============================================================
NUTRITION & RECOVERY RECOMMENDATION
Focus: ${activePlan.nutritionTip.title} (${activePlan.nutritionTip.focus})
Tips:
${activePlan.nutritionTip.actionableTips.map((t) => `  • ${t}`).join('\n')}
Hydration: ${activePlan.nutritionTip.hydrationAdvice}
Sleep & Recovery: ${activePlan.nutritionTip.recoveryAdvice}

=============================================================
SAFETY DISCLAIMER:
FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.
=============================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FitBuddy-Plan-${userRecord.userId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const daysToRender =
    selectedDayTab === 'all'
      ? activePlan.days
      : activePlan.days.filter((d) => d.day === selectedDayTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 print-page">
      {/* Top Banner: Motivational Quote & Status */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-lime-950/40 border border-emerald-500/30 p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {isUpdatedVersion ? '🚀 Updated Feedback Edition' : '✨ Primary Plan'}
              </span>
              <span className="text-xs text-slate-400">
                Generated {new Date(activePlan.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {activePlan.planTitle || `${userRecord.fullName}’s 7-Day Fitness Plan`}
            </h2>
            <p className="text-sm text-slate-300 italic flex items-center gap-2 pt-1">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>“{activePlan.motivationalQuote}”</span>
            </p>
          </div>

          {/* Action buttons header */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Improve Plan</span>
            </button>

            {userRecord.updatedPlan && onComparePlans && (
              <button
                onClick={onComparePlans}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Compare Versions</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={onGenerateNew}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <p>{activePlan.overview}</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 shadow-md">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>User Profile</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
            ID: {userRecord.userId}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-left">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate block">
              {userRecord.fullName}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
            <span className="text-xs sm:text-sm font-bold text-white">{userRecord.age} yrs</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
            <span className="text-xs sm:text-sm font-bold text-white">{userRecord.weight} kg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Goal</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 truncate block">
              {userRecord.fitnessGoal}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Intensity</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400">{userRecord.workoutIntensity}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400">{userRecord.experienceLevel}</span>
          </div>
        </div>

        {userRecord.preferences && (
          <div className="mt-3 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
            <span className="font-semibold text-slate-300">Preferences / Equipment:</span>{' '}
            {userRecord.preferences}
          </div>
        )}
      </div>

      {/* 💡 AI Nutrition & Recovery Tip Card */}
      <NutritionTipCard
        nutritionTip={activePlan.nutritionTip}
        fitnessGoal={userRecord.fitnessGoal}
      />

      {/* 7-Day Plan Section Title & Day Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Your 7-Day Fitness Plan</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Click on exercises to mark them completed as you work out.
          </p>
        </div>

        {/* Day Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-print">
          <button
            onClick={() => setSelectedDayTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedDayTab === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All 7 Days
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDayTab(d)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedDayTab === d
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Day Cards */}
      <div className="space-y-8">
        {daysToRender.map((day: WorkoutDay) => (
          <div
            key={day.day}
            className="day-card bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-slate-700 transition"
          >
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                  D{day.day}
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white">
                    {day.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>{day.focus}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rest: {day.restTime}</span>
                </div>
              </div>
            </div>

            {/* Warm-up Section */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Warm-up ({day.warmup.duration})</span>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {day.warmup.activities.map((act, i) => (
                  <li key={i} className="text-xs text-amber-100/90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Exercises Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>Main Workout Exercises</span>
                </h5>
                <span className="text-[11px] text-slate-500">
                  {day.exercises.length} Exercises Planned
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {day.exercises.map((exercise, idx) => {
                  const key = `d${day.day}-e${idx}`;
                  const isDone = !!completedExercises[key];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExercise(key)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-400'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-emerald-400 shrink-0 focus:outline-none"
                      >
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-bold truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {exercise.name}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 whitespace-nowrap">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>

                        {exercise.targetMuscles && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            <span className="text-slate-500">Target:</span> {exercise.targetMuscles}
                          </p>
                        )}

                        {exercise.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/40">
                            💡 {exercise.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cool-down & Recovery Row */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cool-down */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cool-down ({day.cooldown.duration})</span>
                </div>
                <ul className="space-y-1">
                  {day.cooldown.activities.map((cAct, i) => (
                    <li key={i} className="text-xs text-indigo-200/90 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{cAct}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recovery Suggestion */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recovery Suggestion</span>
                </div>
                <p className="text-xs text-cyan-200/90 leading-relaxed">
                  {day.recoverySuggestion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating or Footer Action Bar */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <h4 className="text-base font-bold text-white">
            Need adjustments to your routine?
          </h4>
          <p className="text-xs text-slate-400">
            Tell FitBuddy what to tweak (add yoga, reduce intensity, add rest, etc.) and Gemini will rewrite your plan!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFeedback}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Give Feedback / Improve Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
