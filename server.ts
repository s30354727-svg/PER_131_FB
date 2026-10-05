import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { FitBuddyDB } from './src/server/db';
import { generateWorkoutPlan, updateWorkoutPlan } from './src/server/geminiService';
import { UserProfile, FitBuddyUserRecord } from './src/types/fitness';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'FitBuddy – AI Fitness Plan Generator',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Helper for input validation
function validateProfile(body: any): { valid: boolean; error?: string } {
  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length === 0) {
    return { valid: false, error: 'Full Name is required.' };
  }
  if (!body.userId || typeof body.userId !== 'string' || body.userId.trim().length === 0) {
    return { valid: false, error: 'User ID is required.' };
  }
  const age = Number(body.age);
  if (isNaN(age) || age < 12 || age > 110) {
    return { valid: false, error: 'Please enter a valid age between 12 and 110.' };
  }
  const weight = Number(body.weight);
  if (isNaN(weight) || weight < 25 || weight > 350) {
    return { valid: false, error: 'Please enter a valid weight between 25 kg and 350 kg.' };
  }
  const validGoals = ['Weight Loss', 'Muscle Gain', 'General Wellness', 'Strength', 'Flexibility', 'Endurance'];
  if (!validGoals.includes(body.fitnessGoal)) {
    return { valid: false, error: 'Please select a valid fitness goal.' };
  }
  const validIntensities = ['Low', 'Medium', 'High'];
  if (!validIntensities.includes(body.workoutIntensity)) {
    return { valid: false, error: 'Please select a valid workout intensity.' };
  }
  const validExperiences = ['Beginner', 'Intermediate', 'Advanced'];
  if (!validExperiences.includes(body.experienceLevel)) {
    return { valid: false, error: 'Please select a valid experience level.' };
  }
  const days = Number(body.availableDays);
  if (isNaN(days) || days < 1 || days > 7) {
    return { valid: false, error: 'Available workout days must be between 1 and 7.' };
  }
  if (!body.preferredDuration) {
    return { valid: false, error: 'Please select a preferred workout duration.' };
  }
  return { valid: true };
}

// Handler for generating workout plan
const handleGenerateWorkout = async (req: express.Request, res: express.Response) => {
  try {
    const validation = validateProfile(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const profile: UserProfile = {
      userId: req.body.userId.trim(),
      fullName: req.body.fullName.trim(),
      age: Number(req.body.age),
      weight: Number(req.body.weight),
      fitnessGoal: req.body.fitnessGoal,
      workoutIntensity: req.body.workoutIntensity,
      experienceLevel: req.body.experienceLevel,
      availableDays: Number(req.body.availableDays),
      preferredDuration: req.body.preferredDuration,
      preferences: req.body.preferences?.trim() || '',
    };

    // Check if user already exists
    const existing = FitBuddyDB.getUserById(profile.userId);

    // Call Gemini to generate the 7-day plan and nutrition tip
    const plan = await generateWorkoutPlan(profile);

    const now = new Date().toISOString();
    const userRecord: FitBuddyUserRecord = {
      userId: profile.userId,
      fullName: profile.fullName,
      age: profile.age,
      weight: profile.weight,
      fitnessGoal: profile.fitnessGoal,
      workoutIntensity: profile.workoutIntensity,
      experienceLevel: profile.experienceLevel,
      availableDays: profile.availableDays,
      preferredDuration: profile.preferredDuration,
      preferences: profile.preferences || '',
      originalPlan: plan,
      updatedPlan: null, // Initial plan has no feedback update yet
      feedbackHistory: existing ? existing.feedbackHistory : [],
      status: 'Active',
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    FitBuddyDB.saveUser(userRecord);

    return res.json({
      success: true,
      message: 'Personalized 7-day fitness plan generated successfully!',
      user: userRecord,
      plan,
    });
  } catch (error: any) {
    console.error('Error in generate-workout route:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while generating your plan. Please try again.',
    });
  }
};

// Route aliases to support both /api/generate-workout and FastAPI-style /generate-workout
app.post('/api/generate-workout', handleGenerateWorkout);
app.post('/generate-workout', handleGenerateWorkout);

// Handler for submitting feedback and updating plan
const handleSubmitFeedback = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, feedback } = req.body;
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'User ID is required to submit feedback.' });
    }
    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide feedback to improve your plan.' });
    }

    const user = FitBuddyDB.getUserById(userId.trim());
    if (!user) {
      return res.status(404).json({ success: false, message: `User with ID '${userId}' not found.` });
    }

    const profile: UserProfile = {
      userId: user.userId,
      fullName: user.fullName,
      age: user.age,
      weight: user.weight,
      fitnessGoal: user.fitnessGoal,
      workoutIntensity: user.workoutIntensity,
      experienceLevel: user.experienceLevel,
      availableDays: user.availableDays,
      preferredDuration: user.preferredDuration,
      preferences: user.preferences,
    };

    // Ask Gemini to update the plan based on original plan + feedback + profile
    const updatedPlan = await updateWorkoutPlan(profile, user.originalPlan, feedback.trim());

    const now = new Date().toISOString();
    const feedbackItem = {
      id: `fb-${Date.now()}`,
      feedbackText: feedback.trim(),
      submittedAt: now,
      appliedChangesSummary: `Plan revised to integrate: "${feedback.trim()}"`,
    };

    user.updatedPlan = updatedPlan;
    user.feedbackHistory = [feedbackItem, ...user.feedbackHistory];
    user.status = 'Updated';
    user.updatedAt = now;

    FitBuddyDB.saveUser(user);

    return res.json({
      success: true,
      message: 'Plan successfully updated based on your feedback!',
      user,
      updatedPlan,
    });
  } catch (error: any) {
    console.error('Error in submit-feedback route:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while updating your plan. Please try again.',
    });
  }
};

app.post('/api/submit-feedback', handleSubmitFeedback);
app.post('/submit-feedback', handleSubmitFeedback);

// Handler to view all registered users and dashboard stats
const handleGetUsers = (req: express.Request, res: express.Response) => {
  try {
    const users = FitBuddyDB.getAllUsers();
    const stats = FitBuddyDB.getStats();
    return res.json({
      success: true,
      users,
      stats,
    });
  } catch (error: any) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

app.get('/api/users', handleGetUsers);
app.get('/users', handleGetUsers);
app.get('/view-all-users', handleGetUsers);

// Handler for single user retrieval
const handleGetUserById = (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.user_id;
    const user = FitBuddyDB.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User '${userId}' not found.` });
    }
    return res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user.' });
  }
};

app.get('/api/users/:user_id', handleGetUserById);
app.get('/users/:user_id', handleGetUserById);

// Handler for deleting a user
const handleDeleteUser = (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.user_id;
    const deleted = FitBuddyDB.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `User '${userId}' not found or already deleted.` });
    }
    return res.json({ success: true, message: `User '${userId}' has been removed.` });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

app.delete('/api/users/:user_id', handleDeleteUser);
app.delete('/users/:user_id', handleDeleteUser);

// Dashboard stats endpoint
app.get('/api/stats', (req, res) => {
  try {
    const stats = FitBuddyDB.getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
  }
});

// Full-stack Vite integration:
// In dev: mount vite.middlewares
// In prod: serve dist files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitBuddy AI Server running on port ${PORT}`);
  });
}

startServer();
