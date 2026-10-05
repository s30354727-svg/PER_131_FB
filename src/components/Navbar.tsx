import React from 'react';
import { Dumbbell, Sparkles, LayoutDashboard, History, PlusCircle, HeartPulse, ShieldCheck } from 'lucide-react';
import { FitBuddyUserRecord } from '../types/fitness';

interface NavbarProps {
  activeTab: 'home' | 'plan' | 'history' | 'admin';
  setActiveTab: (tab: 'home' | 'plan' | 'history' | 'admin') => void;
  currentUser: FitBuddyUserRecord | null;
  onNewPlanClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onNewPlanClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Fit<span className="text-emerald-400">Buddy</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                AI Fitness Plan Generator
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Plan</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setActiveTab('plan')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'plan'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span className="hidden xs:inline">My Plan</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'history'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden xs:inline">Plan History</span>
                {currentUser.updatedPlan && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-pulse" />
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Coach Dashboard</span>
              <span className="sm:hidden">Coach</span>
            </button>
          </nav>

          {/* User profile pill or quick create */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-200 leading-tight">
                    {currentUser.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {currentUser.userId}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onNewPlanClick}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
