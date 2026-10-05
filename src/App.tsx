import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FitnessForm } from './components/FitnessForm';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { FeedbackSection } from './components/FeedbackSection';
import { PlanHistoryView } from './components/PlanHistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { FitBuddyAPI } from './services/api';
import { FitBuddyUserRecord, UserProfile } from './types/fitness';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'history' | 'admin'>('home');
  const [currentUser, setCurrentUser] = useState<FitBuddyUserRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('FitBuddy AI is creating your personalized plan…');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  // Auto-dismiss banners
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Initial load: check if seed users exist and set first one as preview if desired
  useEffect(() => {
    FitBuddyAPI.getAllUsers()
      .then((data) => {
        if (data.users && data.users.length > 0 && !currentUser) {
          // Pre-load the first user record for seamless exploration if user wants to look at plans right away
          setCurrentUser(data.users[0]);
        }
      })
      .catch((err) => {
        console.warn('Initial fetch check:', err);
      });
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('fitness-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGeneratePlan = async (profile: UserProfile) => {
    try {
      setIsLoading(true);
      setLoadingMessage('FitBuddy AI is creating your personalized plan…');
      setErrorMessage(null);

      const result = await FitBuddyAPI.generateWorkout(profile);
      setCurrentUser(result.user);
      setActiveTab('plan');
      setSuccessMessage('Your personalized 7-day fitness plan is ready!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Plan generation error:', err);
      setErrorMessage(err.message || 'Something went wrong while generating your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackText: string) => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setLoadingMessage('FitBuddy AI is updating your workout plan…');
      setErrorMessage(null);

      const result = await FitBuddyAPI.submitFeedback(currentUser.userId, feedbackText);
      setCurrentUser(result.user);
      setShowFeedbackModal(false);
      setSuccessMessage('Your workout plan has been successfully updated with your feedback!');
      setActiveTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Plan update error:', err);
      setErrorMessage(err.message || 'Something went wrong while updating your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUserFromAdmin = (user: FitBuddyUserRecord) => {
    setCurrentUser(user);
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onNewPlanClick={() => {
          setActiveTab('home');
          setTimeout(handleScrollToForm, 100);
        }}
      />

      {/* Notifications / Feedback Toasts */}
      <div className="fixed top-20 right-4 z-50 max-w-md w-full space-y-2 pointer-events-none">
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* Main Content Area */}
      <main className="flex-1 pt-4 sm:pt-8">
        {/* VIEW 1: HOME (Hero + Input Form) */}
        {activeTab === 'home' && (
          <div>
            <Hero onScrollToForm={handleScrollToForm} />
            <FitnessForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
        )}

        {/* VIEW 2: ACTIVE PLAN */}
        {activeTab === 'plan' && currentUser && (
          <div>
            <WorkoutPlanView
              userRecord={currentUser}
              activePlan={currentUser.updatedPlan || currentUser.originalPlan}
              onGenerateNew={() => {
                setActiveTab('home');
                setTimeout(handleScrollToForm, 100);
              }}
              onOpenFeedback={() => setShowFeedbackModal(true)}
              onComparePlans={() => setActiveTab('history')}
              isUpdatedVersion={!!currentUser.updatedPlan}
            />

            {/* Embedded or Modal Feedback Drawer */}
            {showFeedbackModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
                <div className="w-full max-w-2xl">
                  <FeedbackSection
                    userRecord={currentUser}
                    onSubmitFeedback={handleSubmitFeedback}
                    isLoading={isLoading}
                    onCancel={() => setShowFeedbackModal(false)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fallback if user clicked "My Plan" but no user selected */}
        {activeTab === 'plan' && !currentUser && (
          <div className="max-w-md mx-auto my-24 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">No Active Plan Loaded</h3>
            <p className="text-xs text-slate-400">
              Create a personalized 7-day fitness plan or select a client from the Coach Dashboard.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Generate a Plan Now
            </button>
          </div>
        )}

        {/* VIEW 3: PLAN HISTORY (Original vs. Updated) */}
        {activeTab === 'history' && currentUser && (
          <PlanHistoryView
            userRecord={currentUser}
            onGenerateNew={() => {
              setActiveTab('home');
              setTimeout(handleScrollToForm, 100);
            }}
            onOpenFeedback={() => setShowFeedbackModal(true)}
          />
        )}

        {/* Fallback if user clicked "History" but no user selected */}
        {activeTab === 'history' && !currentUser && (
          <div className="max-w-md mx-auto my-24 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">No Plan History Available</h3>
            <p className="text-xs text-slate-400">
              Generate a fitness plan first to inspect version history and modifications.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Create Your Plan
            </button>
          </div>
        )}

        {/* VIEW 4: ADMIN / COACH DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard onSelectUserForMainView={handleSelectUserFromAdmin} />
        )}
      </main>

      {/* Safety & Medical Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
}
