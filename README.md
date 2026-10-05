# FitBuddy – AI Fitness Plan Generator

> **“Your AI-powered personal fitness companion”**  
> Build better habits with structured 7-day workout plans, goal-specific nutrition & recovery guidance, and iterative feedback adaptations powered by **Google Gemini AI**.

---

## 1. Project Description

**FitBuddy** is an intelligent, full-stack fitness and wellness web application that leverages Google Gemini models to generate personalized 7-day fitness schedules tailored to each individual's physical profile, experience level, available days, and workout preferences.

Beyond static workout generation, FitBuddy introduces an **Adaptive AI Feedback Loop** that allows users to submit natural language adjustments (e.g., *"Add more cardio"*, *"Include 15 minutes of yoga"*, *"Reduce intensity for knee comfort"*), prompting Gemini to evolve their workout plan while preserving the original blueprint for comparison. It also provides an **Admin / Coach Dashboard** to inspect client profiles, workout history, and user feedback.

---

## 2. Key Features

- **Personalized 7-Day Workout Generation**:
  - Full Day 1 through Day 7 schedule.
  - Granular breakdown of warm-ups (5–10 min), target exercises with exact sets and reps, rest intervals, cool-downs, and daily recovery routines.
  - Interactive exercise completion checkboxes for real-time workout tracking.
- **Goal-Calibrated Nutrition & Recovery Guidance**:
  - Distinct **💡 AI Nutrition & Recovery Tip** card tailored to user goals (Weight Loss, Muscle Gain, General Wellness, Strength, Flexibility, Endurance).
  - Clear hydration and sleep recovery protocols.
- **Adaptive AI Plan Evolution**:
  - “Improve My Plan” feedback system.
  - Automatically regenerates an updated routine based on user feedback without overwriting the original plan.
- **Original vs. Updated Plan History**:
  - Side-by-side or toggled version control.
  - Timestamped record of user feedback and adjustments made.
- **Print & Export Utilities**:
  - Clean `@media print` styling for printing paper-friendly workout cards.
  - Formatted text/markdown file download (`FitBuddy-Plan-[userId].txt`).
- **Coach & Admin Dashboard**:
  - Live statistics: *Total Users*, *Total Plans Generated*, *Updated Plans*, *Active Users*.
  - Full-text search by user name or ID.
  - Multi-criteria filtering by Goal, Intensity, and Experience level.
  - Sort by Newest, Oldest, or Goal.
  - Detailed modal inspector for user profiles, original plans, updated plans, and feedback logs.
  - JSON data export for coaching records.
- **Safety-First Fitness Architecture**:
  - Boundaries to prevent dangerous medical diagnosis or extreme weight loss advice.
  - Prominent medical disclaimers on every plan and footer.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Lucide React icons, Motion
- **Backend / API**: Node.js, Express, tsx
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK, `gemini-3.8-flash`)
- **Persistence**: File-backed JSON storage engine (`/data/fitbuddy_db.json`) with atomic transactions and seed data
- **Bundler & Build**: Vite 8, esbuild

---

## 4. Google Gemini Integration

FitBuddy utilizes the `@google/genai` SDK on the server side (`server.ts` / `src/server/geminiService.ts`). The API key is never exposed to the browser.

### Models Used
- **`gemini-3.8-flash`**: Selected for fast, structured reasoning, JSON schema enforcement, and intelligent workout personalization.

### Telemetry Header
Per guidelines, the client includes `'User-Agent': 'aistudio-build'` in `httpOptions`.

### AI Capabilities
1. `generateWorkoutPlan(profile)`: Enforces a structured JSON schema containing all 7 days, warm-ups, exercises, sets/reps, rest, cool-downs, recovery suggestions, and nutrition tips.
2. `updateWorkoutPlan(profile, originalPlan, feedback)`: Ingests the existing plan, user profile, and user feedback to regenerate a revised 7-day schedule while keeping the core fitness goal in focus.

---

## 5. Environment Variables

Create or configure a `.env` file in the project root:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PORT: Local server port (Default: 3000)
PORT=3000
```

---

## 6. How to Run the Project

### Installation
```bash
npm install
```

### Development
Starts the full-stack Express server with Vite middleware on port 3000:
```bash
npm run dev
```

### Production Build & Run
```bash
npm run build
npm run start
```

---

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & Gemini status |
| `POST` | `/api/generate-workout` *(alias: `/generate-workout`)* | Validates profile and generates 7-day plan with Gemini |
| `POST` | `/api/submit-feedback` *(alias: `/submit-feedback`)* | Submits feedback and generates updated plan |
| `GET` | `/api/users` *(alias: `/users`, `/view-all-users`)* | Retrieves all registered users and dashboard statistics |
| `GET` | `/api/users/:user_id` *(alias: `/users/:user_id`)* | Retrieves a single user record |
| `DELETE`| `/api/users/:user_id` *(alias: `/users/:user_id`)* | Deletes a user record |
| `GET` | `/api/stats` | Returns aggregate dashboard metrics |

---

## 8. Project Structure

```text
fitbuddy/
├── data/
│   └── fitbuddy_db.json         # Persistent JSON database (seeded with sample users)
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx   # Coach dashboard with stats, search & filter
│   │   ├── DisclaimerBanner.tsx # Safety disclaimer footer
│   │   ├── FeedbackSection.tsx  # Natural language plan improvement interface
│   │   ├── FitnessForm.tsx      # User profile form with validation & presets
│   │   ├── Hero.tsx             # Hero section with brand highlights
│   │   ├── LoadingOverlay.tsx   # Animated loading state with tips
│   │   ├── Navbar.tsx           # Athletic navigation bar with brand badge
│   │   ├── NutritionTipCard.tsx # AI nutrition, hydration & recovery card
│   │   ├── PlanHistoryView.tsx  # Original vs Updated plan comparison
│   │   ├── UserDetailModal.tsx  # Coach inspector modal
│   │   └── WorkoutPlanView.tsx  # 7-day workout cards, day tabs & print/download
│   ├── server/
│   │   ├── db.ts                # File-backed database controller
│   │   └── geminiService.ts     # Gemini API integration & schema definitions
│   ├── services/
│   │   └── api.ts               # Frontend API client
│   ├── types/
│   │   └── fitness.ts           # TypeScript interfaces & types
│   ├── App.tsx                  # Main application state machine
│   ├── index.css                # Tailwind CSS 4 & print rules
│   └── main.tsx                 # React entry point
├── server.ts                    # Full-stack Express server + Vite middleware
├── metadata.json                # AI Studio application metadata
├── package.json                 # Scripts and dependencies
└── tsconfig.json                # TypeScript configuration
```

---

## 9. Safety Disclaimer

> **“FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.”**  
> FitBuddy is engineered as an informational wellness companion. Users are instructed to consult certified medical professionals before undertaking any new or intense physical exercise, particularly if they have underlying health conditions, cardiovascular history, or recent injuries.

---

## 10. Future Improvements

- Wearable device sync (Fitbit, Apple Health, Garmin) for heart rate and sleep telemetry.
- Video demonstration previews for complex exercises.
- Multi-week periodized macrocycles (4-week and 12-week progressions).
- AI meal plan and recipe generator with grocery list exports.
