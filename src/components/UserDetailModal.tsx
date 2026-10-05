import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Weight,
  Target,
  Flame,
  Award,
  Layers,
  Sparkles,
  History,
  CheckCircle,
  Clock,
  Printer,
  ExternalLink,
} from 'lucide-react';
import { FitBuddyUserRecord, WorkoutPlan } from '../types/fitness';
import { NutritionTipCard } from './NutritionTipCard';

interface UserDetailModalProps {
  user: FitBuddyUserRecord | null;
  initialTab?: 'profile' | 'original' | 'updated' | 'feedback';
  onClose: () => void;
  onSelectUserForMainView: (user: FitBuddyUserRecord) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  initialTab = 'profile',
  onClose,
  onSelectUserForMainView,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'original' | 'updated' | 'feedback'>(
    initialTab
  );

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {user.userId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {user.fitnessGoal} • {user.workoutIntensity} Intensity • {user.experienceLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectUserForMainView(user);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Load in FitBuddy</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/90 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'original'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Original Plan
          </button>
          <button
            onClick={() => setActiveTab('updated')}
            disabled={!user.updatedPlan}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              !user.updatedPlan
                ? 'border-transparent text-slate-600 cursor-not-allowed'
                : activeTab === 'updated'
                ? 'border-emerald-400 text-emerald-400 cursor-pointer'
                : 'border-transparent text-slate-400 hover:text-slate-200 cursor-pointer'
            }`}
          >
            Updated Plan {user.updatedPlan ? '✨' : '(None)'}
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Feedback Logs ({user.feedbackHistory.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Age</span>
                  <div className="text-lg font-black text-white mt-1">{user.age} Years</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Weight</span>
                  <div className="text-lg font-black text-white mt-1">{user.weight} kg</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Schedule</span>
                  <div className="text-lg font-black text-emerald-400 mt-1">{user.availableDays} Days/wk</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Duration</span>
                  <div className="text-lg font-black text-white mt-1">{user.preferredDuration}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Objectives & Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Goal:</span>{' '}
                    <span className="font-bold text-emerald-400">{user.fitnessGoal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Intensity:</span>{' '}
                    <span className="font-bold text-amber-400">{user.workoutIntensity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Level:</span>{' '}
                    <span className="font-bold text-cyan-400">{user.experienceLevel}</span>
                  </div>
                </div>

                {user.preferences && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Preferences / Equipment:</span>{' '}
                    {user.preferences}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>Account Created: {new Date(user.createdAt).toLocaleString()}</span>
                <span>Last Updated: {new Date(user.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Original Plan */}
          {activeTab === 'original' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-base font-extrabold text-white">
                  {user.originalPlan.planTitle}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{user.originalPlan.overview}</p>
                <p className="text-xs text-emerald-400 italic mt-2">
                  “{user.originalPlan.motivationalQuote}”
                </p>
              </div>

              <NutritionTipCard nutritionTip={user.originalPlan.nutritionTip} />

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  7-Day Routine Breakdown
                </h4>
                {user.originalPlan.days.map((day) => (
                  <div
                    key={day.day}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        Day {day.day}: {day.title}
                      </span>
                      <span className="text-slate-400">Rest: {day.restTime}</span>
                    </div>
                    <div className="text-emerald-400 font-semibold">{day.focus}</div>
                    <div className="text-slate-400">
                      Warmup: {day.warmup.activities.join(', ')} ({day.warmup.duration})
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-bold text-slate-300">Exercises: </span>
                      {day.exercises.map((e) => `${e.name} (${e.sets} × ${e.reps})`).join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Updated Plan */}
          {activeTab === 'updated' && user.updatedPlan && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Feedback-Adapted Plan</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {user.updatedPlan.planTitle}
                </h4>
                <p className="text-xs text-slate-300 mt-1">{user.updatedPlan.overview}</p>
                <p className="text-xs text-emerald-300 italic mt-2">
                  “{user.updatedPlan.motivationalQuote}”
                </p>
              </div>

              <NutritionTipCard nutritionTip={user.updatedPlan.nutritionTip} />

              <div className="space-y-4">
                {user.updatedPlan.days.map((day) => (
                  <div
                    key={day.day}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        Day {day.day}: {day.title}
                      </span>
                      <span className="text-slate-400">Rest: {day.restTime}</span>
                    </div>
                    <div className="text-emerald-400 font-semibold">{day.focus}</div>
                    <div className="text-slate-400">
                      Warmup: {day.warmup.activities.join(', ')} ({day.warmup.duration})
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-bold text-slate-300">Exercises: </span>
                      {day.exercises.map((e) => `${e.name} (${e.sets} × ${e.reps})`).join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Feedback Logs */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {user.feedbackHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No feedback has been submitted by this user yet.
                </div>
              ) : (
                user.feedbackHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold text-emerald-400">Feedback Submission</span>
                      <span>{new Date(item.submittedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200 italic font-medium">
                      “{item.feedbackText}”
                    </p>
                    {item.appliedChangesSummary && (
                      <p className="text-slate-400 pt-1 text-[11px]">
                        Result: {item.appliedChangesSummary}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
