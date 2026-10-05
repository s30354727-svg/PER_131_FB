import React, { useState } from 'react';
import { History, Calendar, Sparkles, ArrowRight, MessageSquare, CheckCircle, Clock, Dumbbell } from 'lucide-react';
import { FitBuddyUserRecord, WorkoutPlan } from '../types/fitness';
import { WorkoutPlanView } from './WorkoutPlanView';

interface PlanHistoryViewProps {
  userRecord: FitBuddyUserRecord;
  onGenerateNew: () => void;
  onOpenFeedback: () => void;
}

export const PlanHistoryView: React.FC<PlanHistoryViewProps> = ({
  userRecord,
  onGenerateNew,
  onOpenFeedback,
}) => {
  const [selectedPlanVersion, setSelectedPlanVersion] = useState<'original' | 'updated'>('updated');

  const hasUpdated = !!userRecord.updatedPlan;
  const activePlanToView = (hasUpdated && selectedPlanVersion === 'updated')
    ? userRecord.updatedPlan!
    : userRecord.originalPlan;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <History className="w-4 h-4" />
              <span>Plan Version Control & History</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Original vs. Updated Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              FitBuddy preserves your initial blueprint while letting you evolve routines through AI feedback.
            </p>
          </div>

          {/* Toggle between original and updated */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSelectedPlanVersion('original')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                selectedPlanVersion === 'original'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Original Plan</span>
              <span className="text-[10px] opacity-75 font-mono">
                {new Date(userRecord.originalPlan.generatedAt).toLocaleDateString()}
              </span>
            </button>

            {hasUpdated ? (
              <button
                onClick={() => setSelectedPlanVersion('updated')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  selectedPlanVersion === 'updated'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Updated Plan</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {new Date(userRecord.updatedPlan!.generatedAt).toLocaleDateString()}
                </span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 px-3 py-2 italic">
                (No feedback updates yet)
              </span>
            )}
          </div>
        </div>

        {/* Feedback Context Callout (If viewing updated) */}
        {hasUpdated && userRecord.feedbackHistory.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Most Recent Feedback Applied:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium italic">
                  “{userRecord.feedbackHistory[0].feedbackText}”
                </p>
                <span className="text-[10px] text-slate-400">
                  Applied on {new Date(userRecord.feedbackHistory[0].submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Add Further Feedback
            </button>
          </div>
        )}
      </div>

      {/* Render the selected plan version */}
      <WorkoutPlanView
        userRecord={userRecord}
        activePlan={activePlanToView}
        onGenerateNew={onGenerateNew}
        onOpenFeedback={onOpenFeedback}
        isUpdatedVersion={selectedPlanVersion === 'updated' && hasUpdated}
      />
    </div>
  );
};
