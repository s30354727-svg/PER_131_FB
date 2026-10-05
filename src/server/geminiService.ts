import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, WorkoutPlan, WorkoutDay } from '../types/fitness';

const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize server-side Gemini client per official skill guidelines
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const WORKOUT_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    planTitle: {
      type: Type.STRING,
      description: 'Engaging, motivational title for the 7-day plan tailored to user and goal.',
    },
    overview: {
      type: Type.STRING,
      description: 'Brief executive summary explaining the methodology and target outcomes.',
    },
    motivationalQuote: {
      type: Type.STRING,
      description: 'Inspirational fitness quote personalized to the user and goal.',
    },
    nutritionTip: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Headline for the nutrition & recovery tip' },
        focus: { type: Type.STRING, description: 'Core dietary focus area' },
        actionableTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 practical, goal-aligned nutritional habits',
        },
        hydrationAdvice: { type: Type.STRING, description: 'Specific fluid intake guidelines' },
        recoveryAdvice: { type: Type.STRING, description: 'Sleep and muscle recovery guidance' },
      },
      required: ['title', 'focus', 'actionableTips', 'hydrationAdvice', 'recoveryAdvice'],
    },
    days: {
      type: Type.ARRAY,
      description: 'Exactly 7 structured days from Day 1 through Day 7.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: 'Day number (1 through 7)' },
          title: { type: Type.STRING, description: 'e.g. Day 1 – Full Body Ignition' },
          focus: { type: Type.STRING, description: 'Specific muscle group or focus' },
          warmup: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING, description: 'e.g. 5-10 minutes' },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 dynamic warm-up drills',
              },
            },
            required: ['duration', 'activities'],
          },
          exercises: {
            type: Type.ARRAY,
            description: '3 to 6 targeted exercises',
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Exercise name' },
                sets: { type: Type.STRING, description: 'e.g. 3 sets' },
                reps: { type: Type.STRING, description: 'e.g. 10-12 reps or 30-45 sec' },
                targetMuscles: { type: Type.STRING, description: 'Target muscle groups' },
                notes: { type: Type.STRING, description: 'Form cue or modification tip' },
              },
              required: ['name', 'sets', 'reps'],
            },
          },
          restTime: { type: Type.STRING, description: 'Rest between sets (e.g. 60-90 seconds)' },
          cooldown: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING, description: 'e.g. 5 minutes' },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 soothing cool-down stretches',
              },
            },
            required: ['duration', 'activities'],
          },
          recoverySuggestion: {
            type: Type.STRING,
            description: 'Daily recovery recommendation (hydration, walking, foam roll, etc.)',
          },
        },
        required: ['day', 'title', 'focus', 'warmup', 'exercises', 'restTime', 'cooldown', 'recoverySuggestion'],
      },
    },
    disclaimer: {
      type: Type.STRING,
      description: 'Standard medical and wellness disclaimer.',
    },
  },
  required: ['planTitle', 'overview', 'motivationalQuote', 'nutritionTip', 'days', 'disclaimer'],
};

const SYSTEM_INSTRUCTION = `You are FitBuddy, an elite personal trainer, certified strength coach, and sports nutrition specialist.
You create personalized, safe, structured 7-day fitness plans.

SAFETY & WELLNESS GUIDELINES:
- FitBuddy is a general fitness and wellness guide, NOT a medical diagnosis or treatment tool.
- Never diagnose medical conditions or claim workouts are universally safe for everyone with medical issues.
- Recommend consulting a healthcare professional when users present severe injuries, cardiovascular concerns, or pregnancy.
- Avoid extreme caloric or weight-loss advice. Emphasize sustainable lifestyle habits.
- For beginners, prioritize foundational biomechanics, bodyweight progressions, joint-friendly movements, and ample recovery.
- For higher experience/intensity, program progressive overload, mechanical tension, and periodized volume.
- If available workout days < 7 (e.g. 4 days), design scheduled active recovery, mobility, or restorative walk days for the off days, ensuring all 7 days (Day 1 through Day 7) are accounted for.
- Every day MUST have: Focus, Warm-up (5-10 mins), Exercises with sets and reps/duration, Rest time, Cool-down, and Recovery suggestion.
- Include the exact disclaimer: "FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice."`;

export async function generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  const prompt = `Generate a personalized 7-Day Workout Plan and Goal-Aligned Nutrition/Recovery Tip for:
- Name: ${profile.fullName} (ID: ${profile.userId})
- Age: ${profile.age} years old
- Current Weight: ${profile.weight} kg
- Fitness Goal: ${profile.fitnessGoal}
- Workout Intensity: ${profile.workoutIntensity}
- Experience Level: ${profile.experienceLevel}
- Available Workout Days per week: ${profile.availableDays} days (schedule the remaining as active recovery/mobility days)
- Preferred Workout Duration: ${profile.preferredDuration}
- User Preferences / Equipment / Notes: ${profile.preferences || 'None specified'}

Structure all 7 days (Day 1 through Day 7) with detailed exercises, precise sets/reps, warm-up, rest times, cool-down, and recovery suggestions. Make it exceptionally practical, realistic, and inspiring.`;

  try {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using intelligent rule-based fallback generation.');
      return generateFallbackPlan(profile);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: WORKOUT_PLAN_SCHEMA as any,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed: WorkoutPlan = JSON.parse(text);
    parsed.generatedAt = new Date().toISOString();
    if (!parsed.disclaimer) {
      parsed.disclaimer = 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.';
    }
    return parsed;
  } catch (err: any) {
    console.error('Error generating workout plan with Gemini, utilizing resilient fallback:', err);
    return generateFallbackPlan(profile);
  }
}

export async function updateWorkoutPlan(
  profile: UserProfile,
  originalPlan: WorkoutPlan,
  feedback: string
): Promise<WorkoutPlan> {
  const prompt = `You are updating an existing FitBuddy 7-day fitness plan based on the user's specific feedback.

USER PROFILE:
- Name: ${profile.fullName}
- Age: ${profile.age} | Weight: ${profile.weight} kg
- Goal: ${profile.fitnessGoal} | Intensity: ${profile.workoutIntensity} | Experience: ${profile.experienceLevel}
- Preferred Duration: ${profile.preferredDuration}

USER FEEDBACK / REQUESTED CHANGES:
"${feedback}"

ORIGINAL PLAN SUMMARY:
- Title: ${originalPlan.planTitle}
- Overview: ${originalPlan.overview}
- Day 1 Focus: ${originalPlan.days[0]?.focus}
- Day 2 Focus: ${originalPlan.days[1]?.focus}
- Day 3 Focus: ${originalPlan.days[2]?.focus}
- Day 4 Focus: ${originalPlan.days[3]?.focus}
- Day 5 Focus: ${originalPlan.days[4]?.focus}
- Day 6 Focus: ${originalPlan.days[5]?.focus}
- Day 7 Focus: ${originalPlan.days[6]?.focus}

TASK:
Modify the 7-day workout plan to address the user's feedback precisely (e.g., adding yoga, incorporating cardio, adjusting intensity, accommodating knee or shoulder pain, replacing exercises, adding rest days).
Keep the user's main fitness goal (${profile.fitnessGoal}) in perspective.
Also refresh the nutrition and recovery advice to complement these updates.
Return the complete, revised 7-day plan in JSON format conforming to the schema.`;

  try {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using intelligent feedback adaptation fallback.');
      return generateFallbackUpdatedPlan(profile, originalPlan, feedback);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: WORKOUT_PLAN_SCHEMA as any,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API for plan update');
    }

    const parsed: WorkoutPlan = JSON.parse(text);
    parsed.generatedAt = new Date().toISOString();
    if (!parsed.disclaimer) {
      parsed.disclaimer = 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.';
    }
    return parsed;
  } catch (err: any) {
    console.error('Error updating workout plan with Gemini, utilizing resilient fallback:', err);
    return generateFallbackUpdatedPlan(profile, originalPlan, feedback);
  }
}

// Fallback generator ensures the app is 100% resilient and functional under all circumstances
function generateFallbackPlan(profile: UserProfile): WorkoutPlan {
  const goal = profile.fitnessGoal;
  const isLoss = goal === 'Weight Loss';
  const isMuscle = goal === 'Muscle Gain' || goal === 'Strength';
  const isFlex = goal === 'Flexibility';

  const days: WorkoutDay[] = [
    {
      day: 1,
      title: 'Day 1 – Full Body Foundation',
      focus: isLoss ? 'Metabolic Resistance & Core' : isMuscle ? 'Upper Body Push & Pull' : 'Full Body Mobility & Tone',
      warmup: {
        duration: '7 minutes',
        activities: ['Arm circles and chest openers', 'Hip 90/90 mobility', 'Bodyweight squats (12 reps)'],
      },
      exercises: [
        {
          name: isMuscle ? 'Goblet Squats or Barbell Back Squats' : 'Bodyweight Air Squats to Bench',
          sets: '3-4 sets',
          reps: isMuscle ? '8-10 reps' : '12-15 reps',
          targetMuscles: 'Quadriceps, Glutes',
          notes: 'Keep chest proud, push floor away through heels.',
        },
        {
          name: 'Incline Push-ups or Standard Floor Push-ups',
          sets: '3 sets',
          reps: '10-12 reps',
          targetMuscles: 'Chest, Anterior Deltoids, Triceps',
          notes: 'Maintain rigid plank alignment through hips.',
        },
        {
          name: 'Dumbbell or Resistance Band Rows',
          sets: '3 sets',
          reps: '12 reps',
          targetMuscles: 'Upper Back, Rhomboids, Lats',
          notes: 'Squeeze shoulder blades together at the top.',
        },
        {
          name: 'Dead Bug or Forearm Plank Hold',
          sets: '3 sets',
          reps: '30-45 seconds',
          targetMuscles: 'Transverse Abdominis, Core',
          notes: 'Press lower back into the mat and breathe.',
        },
      ],
      restTime: isMuscle ? '90 seconds between sets' : '60 seconds between sets',
      cooldown: {
        duration: '5 minutes',
        activities: ['Doorway chest stretch', 'Hamstring floor stretch', 'Child’s pose with deep breathing'],
      },
      recoverySuggestion: 'Hydrate with at least 1 liter of fresh water over the next 2 hours.',
    },
    {
      day: 2,
      title: 'Day 2 – Aerobic Stamina & Dynamic Core',
      focus: isFlex ? 'Spinal Mobility & Flow' : 'Cardiovascular Conditioning',
      warmup: {
        duration: '5 minutes',
        activities: ['Jumping jacks or step jacks', 'Torso twists and side bends'],
      },
      exercises: [
        {
          name: isLoss ? 'Interval Cardio (Brisk Walk / Jog / Elliptical)' : 'Zone 2 Steady-State Cardio',
          sets: '1 set',
          reps: `${profile.preferredDuration} continuous`,
          targetMuscles: 'Heart, Lungs, Leg Endurance',
          notes: 'Maintain conversational breathing rate.',
        },
        {
          name: 'Plank Shoulder Taps',
          sets: '3 sets',
          reps: '16 total taps',
          targetMuscles: 'Core Stability',
          notes: 'Lock hips firmly; do not let hips rotate.',
        },
        {
          name: 'Bird-Dog Contralateral Holds',
          sets: '3 sets',
          reps: '10 per side',
          targetMuscles: 'Lower Back, Glutes',
          notes: 'Reach opposite arm and leg straight out.',
        },
      ],
      restTime: '45 seconds between core sets',
      cooldown: {
        duration: '5 minutes',
        activities: ['Seated forward fold', 'Quadriceps standing stretch'],
      },
      recoverySuggestion: 'Take a brief contrast shower to stimulate blood circulation.',
    },
    {
      day: 3,
      title: 'Day 3 – Active Recovery & Joint Decompression',
      focus: 'Parasympathetic Reset & Tissue Regeneration',
      warmup: {
        duration: '5 minutes',
        activities: ['Deep diaphragmatic breathing in supine position'],
      },
      exercises: [
        {
          name: 'Outdoor Nature Walk',
          sets: '1 session',
          reps: '25-30 minutes',
          targetMuscles: 'Whole body',
          notes: 'Relaxed, screen-free pace in daylight.',
        },
        {
          name: 'Full Body Foam Rolling & Fascial Release',
          sets: '1 set',
          reps: '15 minutes',
          targetMuscles: 'Calves, Quads, Thoracic Spine',
          notes: 'Pause on any tight tender areas for 20-30s.',
        },
      ],
      restTime: 'Self-paced',
      cooldown: {
        duration: '5 minutes',
        activities: ['Legs-up-the-wall pose (Viparita Karani)'],
      },
      recoverySuggestion: 'Epsom salt warm bath before bed to ease muscle tension.',
    },
    {
      day: 4,
      title: 'Day 4 – Lower Body & Posterior Chain Power',
      focus: 'Glutes, Hamstrings & Hip Stability',
      warmup: {
        duration: '8 minutes',
        activities: ['Glute bridges (15 reps)', 'Lateral band walks', 'Hip circles'],
      },
      exercises: [
        {
          name: 'Dumbbell Romanian Deadlifts (RDL)',
          sets: '3-4 sets',
          reps: '10-12 reps',
          targetMuscles: 'Hamstrings, Gluteus Maximus, Erector Spinae',
          notes: 'Hinge deeply at hips while keeping spine flat.',
        },
        {
          name: 'Alternating Reverse Step Lunges',
          sets: '3 sets',
          reps: '10 reps each leg',
          targetMuscles: 'Quadriceps, Balance',
          notes: 'Step backward smoothly, dropping back knee gently.',
        },
        {
          name: 'Glute Hip Thrusts (Floor or Bench)',
          sets: '3 sets',
          reps: '12-15 reps',
          targetMuscles: 'Glutes',
          notes: 'Lock out hips and pause for 2 seconds at the crest.',
        },
        {
          name: 'Side Plank Holds',
          sets: '3 sets',
          reps: '25-35 seconds per side',
          targetMuscles: 'Obliques, Quadratus Lumborum',
          notes: 'Keep shoulder aligned over elbow.',
        },
      ],
      restTime: '60-75 seconds between sets',
      cooldown: {
        duration: '5 minutes',
        activities: ['Figure 4 piriformis stretch', 'Butterfly groin stretch'],
      },
      recoverySuggestion: 'Consume a high-protein meal within 60 minutes after workout.',
    },
    {
      day: 5,
      title: 'Day 5 – Upper Body Strength & Postural Balance',
      focus: 'Shoulders, Back, and Arm Endurance',
      warmup: {
        duration: '6 minutes',
        activities: ['Band pull-aparts', 'Arm circles', 'Cat-cow spine waves'],
      },
      exercises: [
        {
          name: 'Dumbbell Overhead Shoulder Press',
          sets: '3 sets',
          reps: '10-12 reps',
          targetMuscles: 'Deltoids, Triceps',
          notes: 'Brace abs so ribs do not flare upward.',
        },
        {
          name: 'Single-Arm Dumbbell Rows',
          sets: '3 sets',
          reps: '10-12 per arm',
          targetMuscles: 'Lats, Rhomboids',
          notes: 'Pull elbow straight back toward the hip.',
        },
        {
          name: 'Bicep Curl to Overhead Tricep Combo',
          sets: '3 sets',
          reps: '10 reps each',
          targetMuscles: 'Biceps, Triceps',
          notes: 'Strict form; zero swinging or momentum.',
        },
        {
          name: 'Farmer’s Carry with Dumbbells',
          sets: '3 sets',
          reps: '35-45 seconds walk',
          targetMuscles: 'Grip, Trapezius, Core',
          notes: 'Walk tall with shoulders back and level.',
        },
      ],
      restTime: '60 seconds between sets',
      cooldown: {
        duration: '5 minutes',
        activities: ['Cross-body shoulder stretch', 'Overhead triceps stretch'],
      },
      recoverySuggestion: 'Electrolyte hydration with lemon and a pinch of pink salt.',
    },
    {
      day: 6,
      title: 'Day 6 – Functional Metabolic Conditioning',
      focus: isLoss ? 'High Calorie Burn Circuit' : 'Endurance & Core Stamina',
      warmup: {
        duration: '7 minutes',
        activities: ['High knees (gentle)', 'Torso rotations', 'Light shadow boxing'],
      },
      exercises: [
        {
          name: 'Kettlebell or Dumbbell Sumo Deadlifts',
          sets: '3 sets',
          reps: '12-15 reps',
          targetMuscles: 'Adductors, Glutes, Hamstrings',
          notes: 'Wide stance, drive knees outward.',
        },
        {
          name: 'Mountain Climbers (Paced & Controlled)',
          sets: '3 sets',
          reps: '20 total reps',
          targetMuscles: 'Core, Shoulder Stabilizers',
          notes: 'Keep hips down level with shoulders.',
        },
        {
          name: 'Step-ups onto Bench or Sturdy Box',
          sets: '3 sets',
          reps: '10 per leg',
          targetMuscles: 'Quadriceps, Glutes',
          notes: 'Drive through lead heel without hopping off the back foot.',
        },
        {
          name: 'Russian Twists',
          sets: '3 sets',
          reps: '20 total twists',
          targetMuscles: 'Internal & External Obliques',
          notes: 'Rotate rib cage smoothly side to side.',
        },
      ],
      restTime: '60 seconds',
      cooldown: {
        duration: '5 minutes',
        activities: ['Cobra pose gentle abdominal stretch', 'Standing hamstring stretch'],
      },
      recoverySuggestion: 'Post-circuit nutrient refueling with wholesome proteins and carbs.',
    },
    {
      day: 7,
      title: 'Day 7 – Mindful Flow & Weekly Reflection',
      focus: 'Total Body Mobility, Fascia Stretch & Recovery',
      warmup: {
        duration: '5 minutes',
        activities: ['Seated neck and shoulder roll breathing'],
      },
      exercises: [
        {
          name: 'Gentle Hatha / Yin Yoga Sequence',
          sets: '1 flow',
          reps: '20-25 minutes',
          targetMuscles: 'Full body connective tissue',
          notes: 'Breathe into every posture for 4-5 slow breaths.',
        },
        {
          name: 'Restorative Walk in Sunlight',
          sets: '1 stroll',
          reps: '20 minutes',
          targetMuscles: 'Cardiovascular and mental reset',
          notes: 'Zero pace pressure; focus on mental clarity.',
        },
      ],
      restTime: 'Fluid transition',
      cooldown: {
        duration: '5 minutes',
        activities: ['Savasana (lying meditation)', 'Review accomplishments from the week'],
      },
      recoverySuggestion: 'Plan ahead for the coming week’s workouts and celebrate your progress!',
    },
  ];

  return {
    planTitle: `${profile.fullName}’s 7-Day ${profile.fitnessGoal} Blueprint`,
    overview: `A tailored ${profile.experienceLevel.toLowerCase()}-level roadmap calibrated for ${profile.workoutIntensity.toLowerCase()} intensity and ${profile.preferredDuration} sessions.`,
    motivationalQuote: 'Every champion was once a contender who refused to give up.',
    disclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
    generatedAt: new Date().toISOString(),
    nutritionTip: {
      title: `${profile.fitnessGoal} Fueling Strategy`,
      focus: isLoss ? 'Metabolic Efficiency & Satiety' : isMuscle ? 'Lean Hypertrophy & Protein Timing' : 'Vibrant Energy & Cellular Health',
      actionableTips: [
        isLoss ? 'Prioritize 25-30g protein per main meal to protect lean tissue and curb hunger cravings.' : isMuscle ? 'Consume 1.6-2.0g protein per kg bodyweight divided across 4 balanced meals.' : 'Aim for whole foods with vibrant colors on half your plate at lunch and dinner.',
        'Hydrate with water throughout the day, drinking 500ml upon waking.',
        'Keep ultra-processed snacks minimal; replace with Greek yogurt, berries, or raw almonds.',
      ],
      hydrationAdvice: `Aim for approx ${(profile.weight * 0.035).toFixed(1)} liters of water per day, increasing on hot or training days.`,
      recoveryAdvice: 'Prioritize 7.5 to 8.5 hours of restorative sleep to allow muscular repair and central nervous system replenishment.',
    },
    days,
  };
}

function generateFallbackUpdatedPlan(profile: UserProfile, original: WorkoutPlan, feedback: string): WorkoutPlan {
  const updatedDays = original.days.map((day) => {
    const isYogaRequested = feedback.toLowerCase().includes('yoga') || feedback.toLowerCase().includes('stretch');
    const isCardioRequested = feedback.toLowerCase().includes('cardio') || feedback.toLowerCase().includes('hiit');
    const isLighterRequested = feedback.toLowerCase().includes('reduce') || feedback.toLowerCase().includes('low') || feedback.toLowerCase().includes('joint');

    const exercises = [...day.exercises];
    if (isYogaRequested && (day.day === 3 || day.day === 7)) {
      exercises.unshift({
        name: 'Vinyasa Sun Salutations & Flow',
        sets: '3 rounds',
        reps: '5-8 minutes',
        targetMuscles: 'Whole Body Flexibility',
        notes: 'Requested modification: flow with deliberate ujjayi breathing.',
      });
    }

    if (isCardioRequested && day.day % 2 === 0) {
      exercises.push({
        name: 'Incline Cardio Finisher',
        sets: '1 set',
        reps: '10-12 minutes',
        targetMuscles: 'Cardiorespiratory fitness',
        notes: 'Requested modification: steady-state fat burn interval.',
      });
    }

    return {
      ...day,
      restTime: isLighterRequested ? '75-90 seconds between sets (extended per feedback)' : day.restTime,
      exercises,
    };
  });

  return {
    ...original,
    planTitle: `${original.planTitle} (Updated per Feedback)`,
    overview: `Revised to directly incorporate your feedback: "${feedback}". Workouts and pacing have been adjusted accordingly.`,
    motivationalQuote: 'Adaptability is the secret to lifelong fitness mastery. You are in control of your journey.',
    generatedAt: new Date().toISOString(),
    days: updatedDays,
  };
}
