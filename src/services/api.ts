import { UserProfile, FitBuddyUserRecord, WorkoutPlan, DashboardStats } from '../types/fitness';

export interface GenerateResponse {
  success: boolean;
  message: string;
  user: FitBuddyUserRecord;
  plan: WorkoutPlan;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  user: FitBuddyUserRecord;
  updatedPlan: WorkoutPlan;
}

export interface UsersResponse {
  success: boolean;
  users: FitBuddyUserRecord[];
  stats: DashboardStats;
}

export const FitBuddyAPI = {
  async generateWorkout(profile: UserProfile): Promise<GenerateResponse> {
    const res = await fetch('/api/generate-workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to generate workout plan. Please try again.');
    }
    return data;
  },

  async submitFeedback(userId: string, feedback: string): Promise<FeedbackResponse> {
    const res = await fetch('/api/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, feedback }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update plan. Please try again.');
    }
    return data;
  },

  async getAllUsers(): Promise<UsersResponse> {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch registered users.');
    }
    return data;
  },

  async getUser(userId: string): Promise<FitBuddyUserRecord> {
    const res = await fetch(`/api/users/${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to fetch user ${userId}`);
    }
    return data.user;
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to delete user ${userId}`);
    }
    return data;
  },

  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return { status: 'error', geminiConfigured: false };
      return await res.json();
    } catch {
      return { status: 'offline', geminiConfigured: false };
    }
  },
};
