import React, { useState } from 'react';
import { MessageSquare, Sparkles, RefreshCw, Send, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { FitBuddyUserRecord } from '../types/fitness';

interface FeedbackSectionProps {
  userRecord: FitBuddyUserRecord;
  onSubmitFeedback: (feedback: string) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  userRecord,
  onSubmitFeedback,
  isLoading,
  onCancel,
}) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const sampleSuggestions = [
    'Add more cardio and HIIT finishers',
    'Include 15 minutes of yoga or flexibility cooldown',
    'Reduce workout intensity for knee comfort',
    'Include more rest days between heavy workouts',
    'Switch all barbell movements to dumbbell-only exercises',
    'Increase focus on core and lower back stability',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please describe how you would like to adjust your plan.');
      return;
    }
    setError('');
    await onSubmitFeedback(feedback.trim());
    setFeedback('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 feedback-section">
      <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Adaptive AI Feedback Loop
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Improve My Plan
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
          Tell FitBuddy what you’d like to tweak. Gemini will analyze your original plan, current fitness profile, and feedback to generate an updated 7-day schedule without discarding your original plan.
        </p>

        {/* Suggestion Chips */}
        <div className="mt-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Click to insert common adjustments:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setFeedback((prev) => (prev ? `${prev}. ${suggestion}` : suggestion));
                  setError('');
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition cursor-pointer"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                if (error) setError('');
              }}
              placeholder="Example: Add more cardio, reduce workout intensity, include more rest days, add yoga, replace lunges due to knee discomfort..."
              className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition leading-relaxed ${
                error ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {error && (
              <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Back to Plan
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>FitBuddy AI is updating your workout plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Update My Plan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Feedback History */}
        {userRecord.feedbackHistory && userRecord.feedbackHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Feedback History ({userRecord.feedbackHistory.length})</span>
            </h4>
            <div className="space-y-2.5">
              {userRecord.feedbackHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span className="font-semibold text-emerald-400">Feedback Submitted</span>
                    <span>{new Date(item.submittedAt).toLocaleString()}</span>
                  </div>
                  <p className="italic text-slate-200">“{item.feedbackText}”</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
