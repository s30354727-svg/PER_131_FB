import React, { useState } from 'react';
import {
  User,
  Hash,
  Calendar,
  Weight,
  Target,
  Flame,
  Award,
  Clock,
  CalendarDays,
  FileText,
  Sparkles,
  AlertCircle,
  Dumbbell,
  RefreshCw,
} from 'lucide-react';
import {
  UserProfile,
  FitnessGoal,
  WorkoutIntensity,
  ExperienceLevel,
} from '../types/fitness';

interface FitnessFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const FitnessForm: React.FC<FitnessFormProps> = ({ onSubmit, isLoading }) => {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState(() => `user-${Math.floor(100 + Math.random() * 900)}`);
  const [age, setAge] = useState<string>('28');
  const [weight, setWeight] = useState<string>('72');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('Weight Loss');
  const [workoutIntensity, setWorkoutIntensity] = useState<WorkoutIntensity>('Medium');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Beginner');
  const [availableDays, setAvailableDays] = useState<number>(4);
  const [preferredDuration, setPreferredDuration] = useState<string>('45 minutes');
  const [preferences, setPreferences] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateRandomUserId = () => {
    setUserId(`user-${Math.floor(100 + Math.random() * 900)}`);
  };

  const loadSampleProfile = (type: 'beginner-loss' | 'muscle-gain' | 'wellness') => {
    if (type === 'beginner-loss') {
      setFullName('Jordan Lee');
      setUserId(`user-${Math.floor(100 + Math.random() * 900)}`);
      setAge('31');
      setWeight('82');
      setFitnessGoal('Weight Loss');
      setWorkoutIntensity('Medium');
      setExperienceLevel('Beginner');
      setAvailableDays(4);
      setPreferredDuration('45 minutes');
      setPreferences('Home workout, dumbbells and resistance bands available, prefer low impact on knees.');
    } else if (type === 'muscle-gain') {
      setFullName('Chris Taylor');
      setUserId(`user-${Math.floor(100 + Math.random() * 900)}`);
      setAge('25');
      setWeight('75');
      setFitnessGoal('Muscle Gain');
      setWorkoutIntensity('High');
      setExperienceLevel('Intermediate');
      setAvailableDays(5);
      setPreferredDuration('60 minutes');
      setPreferences('Full gym access with barbells, cable machines, focus on chest and back hypertrophy.');
    } else {
      setFullName('Samantha Ray');
      setUserId(`user-${Math.floor(100 + Math.random() * 900)}`);
      setAge('42');
      setWeight('65');
      setFitnessGoal('General Wellness');
      setWorkoutIntensity('Low');
      setExperienceLevel('Beginner');
      setAvailableDays(3);
      setPreferredDuration('30 minutes');
      setPreferences('Focus on core posture, stress relief, and gentle yoga stretching.');
    }
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!userId.trim()) {
      errs.userId = 'User ID is required.';
    }
    const numAge = Number(age);
    if (!age || isNaN(numAge) || numAge < 14 || numAge > 100) {
      errs.age = 'Age must be between 14 and 100.';
    }
    const numWeight = Number(weight);
    if (!weight || isNaN(numWeight) || numWeight < 30 || numWeight > 300) {
      errs.weight = 'Weight must be between 30 kg and 300 kg.';
    }
    if (availableDays < 1 || availableDays > 7) {
      errs.availableDays = 'Available days must be 1 to 7.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile: UserProfile = {
      fullName: fullName.trim(),
      userId: userId.trim(),
      age: Number(age),
      weight: Number(weight),
      fitnessGoal,
      workoutIntensity,
      experienceLevel,
      availableDays,
      preferredDuration,
      preferences: preferences.trim(),
    };

    onSubmit(profile);
  };

  const goalsList: { value: FitnessGoal; label: string; desc: string }[] = [
    { value: 'Weight Loss', label: 'Weight Loss', desc: 'Caloric burn, metabolic intervals & lean muscle preservation' },
    { value: 'Muscle Gain', label: 'Muscle Gain', desc: 'Hypertrophy volume, mechanical tension & muscle building' },
    { value: 'General Wellness', label: 'General Wellness', desc: 'Energy, cardiovascular health, posture & longevity' },
    { value: 'Strength', label: 'Strength', desc: 'Progressive overload, neuromuscular power & core bracing' },
    { value: 'Flexibility', label: 'Flexibility', desc: 'Joint range of motion, fascia release & dynamic mobility' },
    { value: 'Endurance', label: 'Endurance', desc: 'Aerobic stamina, lactate threshold & sustained pacing' },
  ];

  const durations = [
    '20 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
  ];

  return (
    <div id="fitness-form-container" className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
      {/* Container Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

        {/* Header & Sample Profile Pre-fills */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Dumbbell className="w-4 h-4" />
              <span>Step 1: Your Fitness Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Personal & Training Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Gemini will tailor every exercise, set, and rest interval to your inputs.
            </p>
          </div>

          {/* Quick preset loaders for user convenience */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Quick Presets:
            </span>
            <button
              type="button"
              onClick={() => loadSampleProfile('beginner-loss')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Weight Loss
            </button>
            <button
              type="button"
              onClick={() => loadSampleProfile('muscle-gain')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Muscle Gain
            </button>
            <button
              type="button"
              onClick={() => loadSampleProfile('wellness')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Wellness
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Row 1: Name and User ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jordan Lee"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition ${
                  errors.fullName
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80'
                }`}
              />
              {errors.fullName && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  <span>User ID *</span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomUserId}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Randomize
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. user-101"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (errors.userId) setErrors({ ...errors, userId: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none transition ${
                  errors.userId
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80'
                }`}
              />
              {errors.userId && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.userId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Age and Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Age (Years) *</span>
              </label>
              <input
                type="number"
                min="14"
                max="100"
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors({ ...errors, age: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition ${
                  errors.age
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80'
                }`}
              />
              {errors.age && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.age}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weight (in kg) *</span>
              </label>
              <input
                type="number"
                min="30"
                max="300"
                step="0.5"
                placeholder="e.g. 72"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  if (errors.weight) setErrors({ ...errors, weight: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition ${
                  errors.weight
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80'
                }`}
              />
              {errors.weight && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.weight}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Fitness Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Primary Fitness Goal *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {goalsList.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setFitnessGoal(g.value)}
                  className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                    fitnessGoal === g.value
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold">{g.label}</span>
                    {fitnessGoal === g.value && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Intensity & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Workout Intensity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Workout Intensity *</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as WorkoutIntensity[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setWorkoutIntensity(level)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                      workoutIntensity === level
                        ? level === 'High'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-bold'
                          : level === 'Medium'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Experience Level *</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperienceLevel(exp)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                      experienceLevel === exp
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{exp}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: Available Days & Preferred Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Available Days */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Available Workout Days *</span>
                </label>
                <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800">
                  {availableDays} Days / Week
                </span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAvailableDays(num)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      availableDays === num
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Days not selected for heavy training will be programmed as active recovery or mobility.
              </p>
            </div>

            {/* Preferred Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preferred Workout Duration *</span>
              </label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur} className="bg-slate-900 text-slate-200">
                    {dur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Optional Fitness Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Optional Fitness Preferences & Equipment</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dumbbells only, knee-friendly/no jumping, outdoor running preference, focus on upper chest and core..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/80 transition"
            />
            {/* Quick snippet chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] text-slate-500">Quick additions:</span>
              {[
                'Dumbbells only',
                'Knee-friendly (no jumping)',
                'Include 10 min yoga cooldown',
                'Home bodyweight',
                'Core focus',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    if (!preferences.includes(chip)) {
                      setPreferences(preferences ? `${preferences}, ${chip}` : chip);
                    }
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Large CTA button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wide uppercase shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>FitBuddy AI is crafting your plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>Generate My Fitness Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
