import fs from 'fs';
import path from 'path';
import { FitBuddyUserRecord, DashboardStats } from '../types/fitness';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'fitbuddy_db.json');

// Ensure directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial seed data so Admin dashboard has realistic showcase data out of the box
const SEED_USERS: FitBuddyUserRecord[] = [
  {
    userId: 'fit-user-101',
    fullName: 'Alex Morgan',
    age: 29,
    weight: 78,
    fitnessGoal: 'Weight Loss',
    workoutIntensity: 'Medium',
    experienceLevel: 'Beginner',
    availableDays: 4,
    preferredDuration: '45 minutes',
    preferences: 'Kettlebells and bodyweight, prefers low impact cardio',
    createdAt: '2026-09-28T09:30:00.000Z',
    updatedAt: '2026-09-29T14:20:00.000Z',
    status: 'Updated',
    feedbackHistory: [
      {
        id: 'fb-101-1',
        feedbackText: 'Add 10 minutes of mobility work and reduce jumping lunges due to slight ankle soreness.',
        submittedAt: '2026-09-29T14:20:00.000Z',
        appliedChangesSummary: 'Substituted jumping lunges with reverse step lunges; extended dynamic mobility warmup.',
      },
    ],
    originalPlan: {
      planTitle: 'Alex’s 7-Day Lean Kickstart',
      overview: 'A balanced beginner fat-loss routine combining metabolic bodyweight movements with restorative pacing.',
      motivationalQuote: 'Consistency beats intensity. Small daily steps build lifetime transformations.',
      disclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      generatedAt: '2026-09-28T09:30:00.000Z',
      nutritionTip: {
        title: 'Caloric Quality & Hydration Pacing',
        focus: 'Targeting a gentle caloric deficit with sustained energy levels.',
        actionableTips: [
          'Prioritize 25-30g lean protein per meal to preserve lean muscle tissue while losing fat.',
          'Fill half your plate with fibrous green vegetables to enhance satiety and digestion.',
          'Avoid liquid calories; choose sparkling water with fresh lemon or green tea.',
        ],
        hydrationAdvice: 'Drink at least 2.8 liters of water spread evenly between waking and 2 hours before bed.',
        recoveryAdvice: 'Prioritize 7.5 to 8 hours of uninterrupted sleep to regulate cortisol and hunger hormones.',
      },
      days: [
        {
          day: 1,
          title: 'Day 1 – Full Body Ignition',
          focus: 'Cardio-strength compound activation',
          warmup: {
            duration: '7 minutes',
            activities: ['Arm circles & torso twists', 'Cat-cow spine waves', 'Bodyweight glute bridges (15 reps)'],
          },
          exercises: [
            { name: 'Goblet Box Squats', sets: 3, reps: '12 reps', targetMuscles: 'Quadriceps, Glutes', notes: 'Keep chest upright, tap seat gently' },
            { name: 'Incline Push-ups (Hands on Bench)', sets: 3, reps: '10 reps', targetMuscles: 'Chest, Triceps', notes: 'Maintain strict neutral spine' },
            { name: 'Dumbbell Bent-over Rows', sets: 3, reps: '12 reps', targetMuscles: 'Upper Back, Lats', notes: 'Squeeze shoulder blades at peak' },
            { name: 'Dead Bug Holds', sets: 3, reps: '30 seconds', targetMuscles: 'Deep Core', notes: 'Press lower back flush to floor' },
          ],
          restTime: '60 seconds between sets',
          cooldown: {
            duration: '5 minutes',
            activities: ['Child’s pose hold', 'Hamstring floor stretch', 'Deep diaphragmatic breathing'],
          },
          recoverySuggestion: 'Take a gentle 15-minute evening stroll to assist lymphatic drainage.',
        },
        {
          day: 2,
          title: 'Day 2 – Low-Impact Aerobic Flow',
          focus: 'Zone 2 cardio and posture alignment',
          warmup: {
            duration: '5 minutes',
            activities: ['Ankle circles and calf raises', 'Shoulder dislocates with towel'],
          },
          exercises: [
            { name: 'Brisk Incline Walking / Elliptical', sets: 1, reps: '25 minutes', targetMuscles: 'Cardiovascular system', notes: 'Keep breathing at a conversational pace' },
            { name: 'Plank with Shoulder Taps', sets: 3, reps: '16 total reps', targetMuscles: 'Core stability', notes: 'Minimize hip sway' },
            { name: 'Bird-Dog Extensions', sets: 3, reps: '10 per side', targetMuscles: 'Posterior chain', notes: 'Reach long rather than high' },
          ],
          restTime: '45 seconds between core exercises',
          cooldown: {
            duration: '5 minutes',
            activities: ['Standing quad stretch', 'Chest doorway opener'],
          },
          recoverySuggestion: 'Electrolyte replenishment with a pinch of Himalayan salt in water.',
        },
        {
          day: 3,
          title: 'Day 3 – Rest & Active Restoration',
          focus: 'Joint decompression & recovery',
          warmup: {
            duration: '5 minutes',
            activities: ['Neck rolls and shoulder shrugs', 'Deep squat breathing hold'],
          },
          exercises: [
            { name: 'Outdoor Nature Walk', sets: 1, reps: '30 minutes', targetMuscles: 'Full body', notes: 'Relaxed pace, soak in natural daylight' },
            { name: 'Full Body Foam Rolling', sets: 1, reps: '15 minutes', targetMuscles: 'Quads, calves, thoracic spine', notes: 'Spend 30s on tight tender spots' },
          ],
          restTime: 'Self-paced',
          cooldown: {
            duration: '5 minutes',
            activities: ['Legs up the wall posture', '5-5-5 box breathing'],
          },
          recoverySuggestion: 'Warm Epsom salt bath before bedtime.',
        },
        {
          day: 4,
          title: 'Day 4 – Lower Body & Core Tone',
          focus: 'Glutes, hamstrings, and abdominal endurance',
          warmup: {
            duration: '8 minutes',
            activities: ['Hip openers (90/90 stretch)', 'Bodyweight lunges (5/side)', 'Side planks (15s/side)'],
          },
          exercises: [
            { name: 'Romanian Deadlifts with Dumbbells', sets: 3, reps: '10-12 reps', targetMuscles: 'Hamstrings, Glutes', notes: 'Hinge back at the hips, flat back' },
            { name: 'Alternating Reverse Step Lunges', sets: 3, reps: '10 per leg', targetMuscles: 'Quads, Balance', notes: 'Step softly, front knee tracked over toe' },
            { name: 'Glute Bridge with 2-sec Pause', sets: 3, reps: '15 reps', targetMuscles: 'Gluteus maximus', notes: 'Drive through heels, squeeze glutes at top' },
            { name: 'Forearm Plank Hold', sets: 3, reps: '35 seconds', targetMuscles: 'Transverse abdominis', notes: 'Tuck pelvis slightly' },
          ],
          restTime: '60 seconds between sets',
          cooldown: {
            duration: '5 minutes',
            activities: ['Figure 4 piriformis stretch', 'Seated butterfly stretch'],
          },
          recoverySuggestion: 'High protein post-workout snack: Greek yogurt with berries.',
        },
        {
          day: 5,
          title: 'Day 5 – Upper Body Strength & Stamina',
          focus: 'Back, shoulders, and arm endurance',
          warmup: {
            duration: '6 minutes',
            activities: ['Band pull-aparts', 'Arm swings', 'Wrist mobility drills'],
          },
          exercises: [
            { name: 'Dumbbell Overhead Press', sets: 3, reps: '10 reps', targetMuscles: 'Deltoids, Upper Chest', notes: 'Press straight upward without arching back' },
            { name: 'Single-arm Dumbbell Row', sets: 3, reps: '12 per arm', targetMuscles: 'Latissimus dorsi', notes: 'Pull elbow toward hip crease' },
            { name: 'Bicep Curl to Hammer Curl Combo', sets: 3, reps: '10 reps', targetMuscles: 'Biceps, Forearms', notes: 'Control the eccentric lowering phase' },
            { name: 'Bench Tricep Dips (Knees Bent)', sets: 3, reps: '10 reps', targetMuscles: 'Triceps', notes: 'Keep hips close to the bench edge' },
          ],
          restTime: '60 seconds between sets',
          cooldown: {
            duration: '5 minutes',
            activities: ['Cross-body shoulder stretch', 'Overhead tricep stretch'],
          },
          recoverySuggestion: 'Hydrate with magnesium-rich coconut water.',
        },
        {
          day: 6,
          title: 'Day 6 – Full Body Metabolic Circuit',
          focus: 'Caloric expenditure & stamina',
          warmup: {
            duration: '7 minutes',
            activities: ['Jumping jacks or step jacks', 'Torso rotations', 'High knees walking'],
          },
          exercises: [
            { name: 'Kettlebell Sumo Deadlift', sets: 3, reps: '12 reps', targetMuscles: 'Inner thighs, Glutes', notes: 'Wide stance, keep chest high' },
            { name: 'Mountain Climbers (Controlled)', sets: 3, reps: '20 total reps', targetMuscles: 'Core, Shoulders', notes: 'Drive knees rhythmically' },
            { name: 'Dumbbell Farmer’s Carry', sets: 3, reps: '40 seconds walk', targetMuscles: 'Grip, Traps, Core', notes: 'Stand tall with proud posture' },
            { name: 'Standing Russian Twists', sets: 3, reps: '20 twists', targetMuscles: 'Obliques', notes: 'Rotate with control' },
          ],
          restTime: '60-75 seconds between rounds',
          cooldown: {
            duration: '5 minutes',
            activities: ['Cobra pose gentle extension', 'Standing side bend'],
          },
          recoverySuggestion: 'Prioritize a nutritious whole-food dinner with salmon and sweet potatoes.',
        },
        {
          day: 7,
          title: 'Day 7 – Mindful Stretch & Weekly Reset',
          focus: 'Parasympathetic recovery and weekly reflection',
          warmup: {
            duration: '5 minutes',
            activities: ['Gentle seated breathing', 'Neck and shoulder rolls'],
          },
          exercises: [
            { name: 'Full Body Yin Yoga Flow', sets: 1, reps: '20 minutes', targetMuscles: 'Total body fascia', notes: 'Hold gentle postures for 60-90s each' },
            { name: 'Light Mobility Walk', sets: 1, reps: '20 minutes', targetMuscles: 'Legs and lungs', notes: 'Zero rush, mindful breathing' },
          ],
          restTime: 'Seamless flow',
          cooldown: {
            duration: '5 minutes',
            activities: ['Savasana progressive muscle relaxation', 'Positive self-affirmation'],
          },
          recoverySuggestion: 'Review progress, prep healthy meal plan for the upcoming week.',
        },
      ],
    },
    updatedPlan: {
      planTitle: 'Alex’s 7-Day Lean Kickstart (Mobility & Low-Impact Edition)',
      overview: 'Updated plan addressing ankle sensitivity and adding dynamic joint mobility routines.',
      motivationalQuote: 'Listening to your body is a strength, not a setback. Smarter training leads to faster progress.',
      disclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      generatedAt: '2026-09-29T14:20:00.000Z',
      nutritionTip: {
        title: 'Caloric Quality & Anti-Inflammatory Focus',
        focus: 'Enhanced cellular recovery and gentle fat oxidation.',
        actionableTips: [
          'Add turmeric or ginger tea to support joint and tendon comfort.',
          'Consume 25-30g lean protein per meal alongside antioxidant berries.',
          'Keep hydration high to keep connective tissues pliable.',
        ],
        hydrationAdvice: '3 liters of water daily, adding citrus slices for bioflavonoids.',
        recoveryAdvice: 'Gentle ankle circles and calf stretches before bed.',
      },
      days: [
        {
          day: 1,
          title: 'Day 1 – Full Body Low-Impact Ignition',
          focus: 'Low-impact compound activation with ankle support',
          warmup: {
            duration: '10 minutes',
            activities: ['Seated ankle alphabet mobility', 'Cat-cow spine waves', 'Glute bridge holds with adductor squeeze'],
          },
          exercises: [
            { name: 'Box Squats (Controlled Tempo)', sets: 3, reps: '12 reps', targetMuscles: 'Quadriceps, Glutes', notes: 'Soft ankle landing, flat foot drive' },
            { name: 'Incline Push-ups (Hands on Bench)', sets: 3, reps: '10 reps', targetMuscles: 'Chest, Triceps', notes: 'Stable locked core' },
            { name: 'Supported Dumbbell Rows', sets: 3, reps: '12 reps', targetMuscles: 'Upper Back', notes: 'Support torso on bench for spine neutrality' },
            { name: 'Dead Bug Core Holds', sets: 3, reps: '35 seconds', targetMuscles: 'Deep Transverse Core', notes: 'No strain on feet or ankles' },
          ],
          restTime: '60 seconds between sets',
          cooldown: {
            duration: '7 minutes',
            activities: ['Ankle alphabet rotations', 'Child’s pose', 'Calf wall stretch without bouncing'],
          },
          recoverySuggestion: 'Elevate lower legs on cushions for 10 minutes while relaxing.',
        },
        {
          day: 2,
          title: 'Day 2 – Low-Impact Stationary Cardio',
          focus: 'Zero-impact calorie burn & aerobic foundation',
          warmup: {
            duration: '7 minutes',
            activities: ['Gentle seated cycling', 'Shoulder rolls and chest openers'],
          },
          exercises: [
            { name: 'Recumbent Bike or Elliptical Glide', sets: 1, reps: '25 minutes', targetMuscles: 'Cardio endurance', notes: 'Smooth pedaling cadence with zero foot impact' },
            { name: 'Seated Torso Twists with Light Dumbbell', sets: 3, reps: '16 reps', targetMuscles: 'Obliques', notes: 'Controlled rotation' },
            { name: 'Bird-Dog Holds on Padded Mat', sets: 3, reps: '8 per side (3s hold)', targetMuscles: 'Spinal erectors, Glutes', notes: 'Soft padded knee cushion' },
          ],
          restTime: '45 seconds between exercises',
          cooldown: {
            duration: '5 minutes',
            activities: ['Hamstring towel stretch', 'Seated forward fold'],
          },
          recoverySuggestion: 'Cool water splash on lower legs post-workout.',
        },
        {
          day: 3,
          title: 'Day 3 – Deep Rest & Restorative Mobility',
          focus: 'Joint decompression & flexibility',
          warmup: {
            duration: '5 minutes',
            activities: ['Deep breathing in child’s pose'],
          },
          exercises: [
            { name: 'Gentle Upper Body Foam Rolling', sets: 1, reps: '15 minutes', targetMuscles: 'Upper back, lats', notes: 'Gentle pressure only' },
            { name: 'Restorative Mat Stretch Flow', sets: 1, reps: '20 minutes', targetMuscles: 'Hips, lower back', notes: 'Zero ankle strain' },
          ],
          restTime: 'Self-paced',
          cooldown: {
            duration: '5 minutes',
            activities: ['Legs elevated relaxation'],
          },
          recoverySuggestion: 'Epsom salt soak and quality sleep.',
        },
        {
          day: 4,
          title: 'Day 4 – Glute & Posterior Chain (Ankle Safe)',
          focus: 'Glutes and hamstrings without ballistic ankle stress',
          warmup: {
            duration: '8 minutes',
            activities: ['90/90 hip transitions', 'Glute bridge pulses', 'Seated band pulls'],
          },
          exercises: [
            { name: 'Dumbbell Romanian Deadlifts', sets: 3, reps: '10-12 reps', targetMuscles: 'Hamstrings, Glutes', notes: 'Weight evenly distributed across entire foot' },
            { name: 'Reverse Step Lunges (Slow & Gentle)', sets: 3, reps: '8 per leg', targetMuscles: 'Quads, Glutes', notes: 'Replaces jumping lunges; step back slowly' },
            { name: 'Elevated Glute Hip Thrusts', sets: 3, reps: '12 reps', targetMuscles: 'Gluteus maximus', notes: 'Pause at top contraction for 2 seconds' },
            { name: 'Dead Bug with Arm Reaches', sets: 3, reps: '12 reps', targetMuscles: 'Abdominals', notes: 'Keep lower back glued to mat' },
          ],
          restTime: '60-75 seconds',
          cooldown: {
            duration: '6 minutes',
            activities: ['Figure 4 piriformis stretch', 'Gentle foot sole massage'],
          },
          recoverySuggestion: 'Replenish with Greek yogurt and blueberries.',
        },
        {
          day: 5,
          title: 'Day 5 – Upper Body Strength & Posture',
          focus: 'Push, pull, and core stability',
          warmup: {
            duration: '6 minutes',
            activities: ['Arm circles', 'Band pull-aparts', 'Wrist rolling'],
          },
          exercises: [
            { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '10 reps', targetMuscles: 'Shoulders', notes: 'Seated position removes all ankle load' },
            { name: 'Seated Chest-Supported Dumbbell Rows', sets: 3, reps: '12 reps', targetMuscles: 'Mid-back, Lats', notes: 'Drive elbows back smoothly' },
            { name: 'Incline Push-ups or Floor Push-ups', sets: 3, reps: '8-10 reps', targetMuscles: 'Chest, Arms', notes: 'Firm core engagement' },
            { name: 'Pallof Press with Band', sets: 3, reps: '10 per side', targetMuscles: 'Anti-rotation core', notes: 'Resist rotational twist' },
          ],
          restTime: '60 seconds between sets',
          cooldown: {
            duration: '5 minutes',
            activities: ['Doorway chest stretch', 'Upper trapezius stretch'],
          },
          recoverySuggestion: 'Enjoy a warm herbal tea before bed.',
        },
        {
          day: 6,
          title: 'Day 6 – Low-Impact Metabolic Circuit',
          focus: 'Fat burning circuit without jumping',
          warmup: {
            duration: '7 minutes',
            activities: ['Step jacks without jump', 'Torso rotations', 'Padded knee hugs'],
          },
          exercises: [
            { name: 'Dumbbell Suitcase Deadlifts', sets: 3, reps: '12 reps', targetMuscles: 'Legs, Grip, Core', notes: 'Even pressure through soles' },
            { name: 'Shadow Boxing with Light Dumbbells (1-2kg)', sets: 3, reps: '45 seconds', targetMuscles: 'Cardio, Deltoids', notes: 'Fluid upper body punches, soft knees' },
            { name: 'Farmer’s Walk (Firm Flat Footwork)', sets: 3, reps: '35 seconds', targetMuscles: 'Grip, Posture', notes: 'Slow deliberate steps' },
            { name: 'Seated Russian Twists', sets: 3, reps: '16 total', targetMuscles: 'Core', notes: 'Keep feet anchored on floor' },
          ],
          restTime: '60 seconds',
          cooldown: {
            duration: '6 minutes',
            activities: ['Seated forward fold', 'Deep diaphragmatic breathing'],
          },
          recoverySuggestion: 'Protein smoothie with spinach and chia seeds.',
        },
        {
          day: 7,
          title: 'Day 7 – Gentle Yoga & Ankle Recovery',
          focus: 'Total body restoration and calming',
          warmup: {
            duration: '5 minutes',
            activities: ['Seated neck and shoulder circles'],
          },
          exercises: [
            { name: 'Gentle Floor Vinyasa (No Jumpbacks)', sets: 1, reps: '20 minutes', targetMuscles: 'Total body', notes: 'Step back gently, focus on breath' },
            { name: 'Ankle & Foot Mobility Routine', sets: 1, reps: '10 minutes', targetMuscles: 'Ankles, calves', notes: 'Gentle towel scrunches and ankle rotations' },
          ],
          restTime: 'Flowing',
          cooldown: {
            duration: '5 minutes',
            activities: ['Savasana meditation', 'Gratitude journal'],
          },
          recoverySuggestion: 'Reflect on a great week of injury-conscious training!',
        },
      ],
    },
  },
  {
    userId: 'fit-user-102',
    fullName: 'Marcus Vance',
    age: 34,
    weight: 85,
    fitnessGoal: 'Muscle Gain',
    workoutIntensity: 'High',
    experienceLevel: 'Intermediate',
    availableDays: 5,
    preferredDuration: '60 minutes',
    preferences: 'Gym equipment available, barbell and cable focus, hypertrophy emphasis',
    createdAt: '2026-09-29T11:00:00.000Z',
    updatedAt: '2026-09-29T11:00:00.000Z',
    status: 'Active',
    feedbackHistory: [],
    originalPlan: {
      planTitle: 'Marcus’s 7-Day Hypertrophy Protocol',
      overview: 'An upper/lower hypertrophy split engineered to maximize mechanical tension and progressive overload.',
      motivationalQuote: 'Muscles grow when pushed beyond comfort zones, provided fuel and recovery match the work.',
      disclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      generatedAt: '2026-09-29T11:00:00.000Z',
      nutritionTip: {
        title: 'Hypertrophic Fueling & Caloric Surplus',
        focus: 'Supplying amino acids and glycogen for tissue repair.',
        actionableTips: [
          'Aim for 1.8g to 2.2g protein per kg of bodyweight (approx. 150-185g daily for your weight).',
          'Distribute protein across 4 distinct meals separated by 3-4 hours to trigger muscle protein synthesis.',
          'Consume complex carbohydrates (oats, rice, sweet potatoes) around workout windows to fuel heavy lifting.',
        ],
        hydrationAdvice: 'Drink 3.5 liters daily. Supplement with creatine monohydrate (5g daily) with plenty of water.',
        recoveryAdvice: 'Aim for 8 hours of sleep; muscle protein synthesis peaks during deep slow-wave sleep phases.',
      },
      days: [
        {
          day: 1,
          title: 'Day 1 – Upper Body Hypertrophy (Push/Pull A)',
          focus: 'Pectorals, Lats, and Deltoids',
          warmup: {
            duration: '8 minutes',
            activities: ['Band dislocates', 'Scapular pull-ups', 'Push-up plus (10 reps)'],
          },
          exercises: [
            { name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10 reps', targetMuscles: 'Upper Chest, Anterior Deltoid', notes: 'Pause 1 sec at sternum before explosive drive' },
            { name: 'Weighted Pull-ups or Lat Pulldowns', sets: 4, reps: '8-10 reps', targetMuscles: 'Latissimus Dorsi', notes: 'Full hang to chin over bar' },
            { name: 'Dumbbell Seated Shoulder Press', sets: 3, reps: '10-12 reps', targetMuscles: 'Deltoids, Triceps', notes: 'Avoid flaring elbows past 75 degrees' },
            { name: 'Cable Low-to-High Chest Flyes', sets: 3, reps: '12-15 reps', targetMuscles: 'Pectoralis Major', notes: 'Peak contraction squeeze' },
            { name: 'Dumbbell Incline Bicep Curls', sets: 3, reps: '12 reps', targetMuscles: 'Biceps (Long Head)', notes: 'Full elbow extension stretch' },
          ],
          restTime: '90-120 seconds on compounds, 60s on isolations',
          cooldown: {
            duration: '5 minutes',
            activities: ['Pec doorway stretch', 'Lat hang stretch on pull-up bar'],
          },
          recoverySuggestion: 'Post-workout whey protein shake with banana and peanut butter.',
        },
        {
          day: 2,
          title: 'Day 2 – Lower Body Hypertrophy (Quad & Calves)',
          focus: 'Quadriceps, Adductors, and Calf Development',
          warmup: {
            duration: '10 minutes',
            activities: ['Stationary bike (3 mins)', 'Cossack squats (6/side)', 'Leg swings forward and lateral'],
          },
          exercises: [
            { name: 'Barbell Back Squats', sets: 4, reps: '6-8 reps', targetMuscles: 'Quadriceps, Glutes', notes: 'Hit parallel or below with brace' },
            { name: 'Bulgarian Split Squats (Dumbbells)', sets: 3, reps: '10 per leg', targetMuscles: 'Quads, Glutes', notes: 'Slight torso forward lean for glute engagement' },
            { name: 'Leg Extensions (Machine)', sets: 3, reps: '12-15 reps', targetMuscles: 'Quadriceps (Rectus Femoris)', notes: 'Last set drop-set to failure' },
            { name: 'Standing Calf Raises', sets: 4, reps: '15 reps (2s stretch)', targetMuscles: 'Gastrocnemius', notes: 'Deep stretch at bottom' },
            { name: 'Hanging Leg Raises', sets: 3, reps: '12 reps', targetMuscles: 'Lower Abdominals', notes: 'Control the descent without swinging' },
          ],
          restTime: '120 seconds on squats, 60-90s on machines',
          cooldown: {
            duration: '6 minutes',
            activities: ['Kneeling quad couch stretch', 'Calf wall lean stretch'],
          },
          recoverySuggestion: 'High carbohydrate meal within 90 minutes to refill leg glycogen.',
        },
        {
          day: 3,
          title: 'Day 3 – Rest & Growth Window',
          focus: 'Central nervous system & muscular recovery',
          warmup: {
            duration: '5 minutes',
            activities: ['Gentle full body mobility flow'],
          },
          exercises: [
            { name: 'Active Recovery Walk', sets: 1, reps: '30-40 minutes', targetMuscles: 'Cardiovascular, Legs', notes: 'Flushes metabolic byproducts without taxing CNS' },
            { name: 'Thoracic Spine Foam Rolling', sets: 1, reps: '10 minutes', targetMuscles: 'Mid-back', notes: 'Extend gently over roller' },
          ],
          restTime: 'Relaxed',
          cooldown: {
            duration: '5 minutes',
            activities: ['Breathing relaxation'],
          },
          recoverySuggestion: 'Eat a hearty caloric surplus meal and get 8+ hours of sleep.',
        },
        {
          day: 4,
          title: 'Day 4 – Upper Body Hypertrophy (Back & Arms Focus)',
          focus: 'Mid-back thickness, Rear Delts, Biceps/Triceps',
          warmup: {
            duration: '8 minutes',
            activities: ['Face pulls with light band', 'Push-up into downward dog'],
          },
          exercises: [
            { name: 'Barbell Bent-over Row (Overhand)', sets: 4, reps: '8-10 reps', targetMuscles: 'Rhomboids, Lats', notes: 'Pull bar to lower sternum' },
            { name: 'Flat Dumbbell Bench Press', sets: 3, reps: '10-12 reps', targetMuscles: 'Chest, Triceps', notes: 'Arch lower back slightly, tuck shoulder blades' },
            { name: 'Cable Face Pulls with External Rotation', sets: 4, reps: '15 reps', targetMuscles: 'Rear Delts, Rotator Cuff', notes: 'Pull rope toward forehead' },
            { name: 'Cable Rope Tricep Pressdowns', sets: 3, reps: '12-15 reps', targetMuscles: 'Triceps (Lateral Head)', notes: 'Spread ropes apart at lockout' },
            { name: 'EZ-Bar Preacher Curls', sets: 3, reps: '10-12 reps', targetMuscles: 'Biceps Brachii', notes: 'Do not bounce at the bottom' },
          ],
          restTime: '90 seconds between compound sets',
          cooldown: {
            duration: '5 minutes',
            activities: ['Cross-body shoulder stretch', 'Overhead lat stretch'],
          },
          recoverySuggestion: 'Consume 30g casein protein or cottage cheese before sleep.',
        },
        {
          day: 5,
          title: 'Day 5 – Lower Body Hypertrophy (Hamstrings & Glutes)',
          focus: 'Posterior chain dominance',
          warmup: {
            duration: '8 minutes',
            activities: ['Glute bridges with band', 'Good mornings with broomstick', 'Leg swings'],
          },
          exercises: [
            { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, reps: '8-10 reps', targetMuscles: 'Hamstrings, Glutes', notes: 'Hinge back, feel loaded hamstring stretch' },
            { name: 'Barbell Hip Thrusts', sets: 4, reps: '10-12 reps', targetMuscles: 'Gluteus Maximus', notes: 'Chin tucked, full hip extension lockout' },
            { name: 'Lying Hamstring Leg Curls (Machine)', sets: 3, reps: '12-15 reps', targetMuscles: 'Hamstrings', notes: 'Slow 3-second eccentric release' },
            { name: 'Seated Calf Raises', sets: 3, reps: '15 reps', targetMuscles: 'Soleus', notes: 'Full range of motion' },
            { name: 'Ab Wheel Rollouts', sets: 3, reps: '10 reps', targetMuscles: 'Core, Anti-extension', notes: 'Squeeze glutes to protect lower spine' },
          ],
          restTime: '90-120 seconds',
          cooldown: {
            duration: '5 minutes',
            activities: ['Hamstring towel stretch', 'Pigeon pose hip stretch'],
          },
          recoverySuggestion: 'Ice baths or contrasting showers for lower body fatigue relief.',
        },
        {
          day: 6,
          title: 'Day 6 – Shoulders, Arms & Weak Point Touch-up',
          focus: 'Deltoid caps, arm fullness, and core conditioning',
          warmup: {
            duration: '7 minutes',
            activities: ['Y-T-W arm raises', 'Light cable upright rows'],
          },
          exercises: [
            { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15 reps (Strict)', targetMuscles: 'Lateral Deltoids', notes: 'Lead with elbows, slight forward tilt' },
            { name: 'Close-grip Barbell Bench Press', sets: 3, reps: '8-10 reps', targetMuscles: 'Triceps, Upper Chest', notes: 'Hands shoulder-width apart' },
            { name: 'Hammer Curls with Dumbbells', sets: 3, reps: '10-12 reps', targetMuscles: 'Brachialis, Forearms', notes: 'Pin elbows to sides' },
            { name: 'Cable Overhead Tricep Extensions', sets: 3, reps: '12 reps', targetMuscles: 'Triceps (Long Head)', notes: 'Feel deep stretch in triceps' },
            { name: 'Hanging Windshield Wipers', sets: 3, reps: '10 reps total', targetMuscles: 'Obliques, Core', notes: 'Smooth rotational control' },
          ],
          restTime: '60-75 seconds',
          cooldown: {
            duration: '5 minutes',
            activities: ['Bicep wall stretch', 'Tricep overhead stretch'],
          },
          recoverySuggestion: 'Replenish electrolytes and maintain high amino acid intake.',
        },
        {
          day: 7,
          title: 'Day 7 – Full CNS Deload & Rest',
          focus: 'Total systemic recovery and muscle rebuilding',
          warmup: {
            duration: '5 minutes',
            activities: ['Light diaphragmatic breathing'],
          },
          exercises: [
            { name: 'Leisurely Walk in Fresh Air', sets: 1, reps: '30 minutes', targetMuscles: 'Systemic blood flow', notes: 'Unplugged, meditative stroll' },
            { name: 'Gentle Full-Body Static Stretching', sets: 1, reps: '15 minutes', targetMuscles: 'Major muscle groups', notes: 'Hold each stretch for 30 seconds' },
          ],
          restTime: 'Zero fatigue',
          cooldown: {
            duration: '5 minutes',
            activities: ['Deep progressive muscle relaxation'],
          },
          recoverySuggestion: 'Meal prep for next week’s training cycle; track progressive overload gains.',
        },
      ],
    },
  },
];

export class FitBuddyDB {
  private static usersCache: FitBuddyUserRecord[] | null = null;

  private static load(): FitBuddyUserRecord[] {
    if (this.usersCache) {
      return this.usersCache;
    }
    ensureDataDir();
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_USERS, null, 2), 'utf-8');
      this.usersCache = [...SEED_USERS];
      return this.usersCache;
    }

    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      this.usersCache = JSON.parse(data);
      return this.usersCache || [];
    } catch (e) {
      console.error('Error reading fitbuddy_db.json, re-initializing with seed:', e);
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_USERS, null, 2), 'utf-8');
      this.usersCache = [...SEED_USERS];
      return this.usersCache;
    }
  }

  private static persist() {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(this.usersCache || [], null, 2), 'utf-8');
  }

  static getAllUsers(): FitBuddyUserRecord[] {
    return this.load();
  }

  static getUserById(userId: string): FitBuddyUserRecord | undefined {
    const users = this.load();
    return users.find((u) => u.userId.toLowerCase() === userId.toLowerCase());
  }

  static saveUser(record: FitBuddyUserRecord): FitBuddyUserRecord {
    const users = this.load();
    const index = users.findIndex((u) => u.userId.toLowerCase() === record.userId.toLowerCase());
    if (index >= 0) {
      users[index] = record;
    } else {
      users.unshift(record);
    }
    this.persist();
    return record;
  }

  static deleteUser(userId: string): boolean {
    const users = this.load();
    const initialLen = users.length;
    this.usersCache = users.filter((u) => u.userId.toLowerCase() !== userId.toLowerCase());
    if (this.usersCache.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  static getStats(): DashboardStats {
    const users = this.load();
    const totalUsers = users.length;
    let totalPlansGenerated = 0;
    let updatedPlans = 0;

    for (const u of users) {
      if (u.originalPlan) totalPlansGenerated++;
      if (u.updatedPlan) {
        totalPlansGenerated++;
        updatedPlans++;
      }
    }

    return {
      totalUsers,
      totalPlansGenerated,
      updatedPlans,
      activeUsers: users.filter((u) => u.status === 'Active' || u.status === 'Updated').length,
    };
  }
}
