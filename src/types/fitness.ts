export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'General Wellness'
  | 'Strength'
  | 'Flexibility'
  | 'Endurance';

export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  userId: string;
  fullName: string;
  age: number;
  weight: number; // in kg
  fitnessGoal: FitnessGoal;
  workoutIntensity: WorkoutIntensity;
  experienceLevel: ExperienceLevel;
  availableDays: number; // 1 to 7
  preferredDuration: string; // e.g. "45 minutes"
  preferences?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: string | number;
  reps: string; // e.g. "10-12 reps" or "30 seconds"
  targetMuscles?: string;
  notes?: string;
}

export interface WorkoutDay {
  day: number;
  title: string;
  focus: string;
  warmup: {
    duration: string;
    activities: string[];
  };
  exercises: WorkoutExercise[];
  restTime: string;
  cooldown: {
    duration: string;
    activities: string[];
  };
  recoverySuggestion: string;
}

export interface NutritionTip {
  title: string;
  focus: string;
  actionableTips: string[];
  hydrationAdvice: string;
  recoveryAdvice: string;
}

export interface WorkoutPlan {
  planTitle: string;
  overview: string;
  motivationalQuote: string;
  days: WorkoutDay[];
  nutritionTip: NutritionTip;
  disclaimer: string;
  generatedAt: string;
}

export interface PlanFeedbackRecord {
  id: string;
  feedbackText: string;
  submittedAt: string;
  appliedChangesSummary?: string;
}

export interface FitBuddyUserRecord {
  userId: string;
  fullName: string;
  age: number;
  weight: number;
  fitnessGoal: FitnessGoal;
  workoutIntensity: WorkoutIntensity;
  experienceLevel: ExperienceLevel;
  availableDays: number;
  preferredDuration: string;
  preferences: string;
  originalPlan: WorkoutPlan;
  updatedPlan?: WorkoutPlan | null;
  feedbackHistory: PlanFeedbackRecord[];
  status: 'Active' | 'Updated' | 'New';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalPlansGenerated: number;
  updatedPlans: number;
  activeUsers: number;
}
