import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-4 text-center no-print">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Health & Wellness Boundary</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
          “FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.”
        </p>

        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          Always consult a physician or certified healthcare provider before beginning any new exercise or nutritional regimen, especially if you have pre-existing health conditions or cardiovascular concerns.
        </p>

        <div className="pt-2 text-[10px] text-slate-600 font-medium">
          FitBuddy – AI Fitness Plan Generator • Powered by Google Gemini AI
        </div>
      </div>
    </footer>
  );
};
