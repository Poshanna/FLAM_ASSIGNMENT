# AI Study Assistant

## Overview

AI Study Assistant is a small AI-powered React application that turns any study topic or notes into an interactive study session. Enter a topic, and the app generates **flashcards** with questions and answers, plus a **multiple-choice quiz** with scoring and the ability to retake only the questions you missed.

This is **not a chatbot** — the LLM returns structured JSON that is validated and rendered as interactive React components.

## Features

- 📝 Free-form text input for any study topic or notes
- 🤖 Generates structured study sets using Google Gemini API
- 📇 Interactive flashcards (flip to reveal answers, navigation, progress)
- 🧠 Multiple-choice quiz with instant feedback
- ✅ Automatic scoring with correct/incorrect breakdown
- 🔁 "Retake Incorrect Questions" mode
- ⟳ Full quiz restart
- ⏳ Loading state with spinner and skeleton UI
- ❌ Friendly error states with retry
- 🛡️ Defensive validation of all AI-generated JSON
- 🚫 Stale-response protection (old responses never overwrite newer ones)
- 📱 Fully responsive (320px → 1440px+)
- ♿ Semantic HTML, keyboard accessible, visible focus states
- 🔐 API key lives only on the backend (never exposed to the browser)

## Tech Stack

| Layer     | Tech                |
|-----------|---------------------|
| Frontend  | React 18, Vite, JSX, React Hooks, Functional Components, CSS |
| Backend   | Node.js, Express.js |
| AI        | Google Gemini API (`@google/generative-ai`) |
| Other     | `dotenv`, `cors`, `concurrently` |

## Architecture

```
┌──────────────┐     HTTP POST      ┌──────────────────┐    Gemini API     ┌──────────┐
│  React App   │ ────────────────▶  │  Express Server  │ ────────────────▶ │  Gemini  │
│  (Vite)      │ ◀────────────────  │  (:3001)         │ ◀────────────────  │   API    │
│  :5173       │   JSON + validate  │  validates input │    structured JSON │          │
└──────────────┘                     └──────────────────┘                    └──────────┘
       │                                      │
       ▼                                      ▼
  validateResult.js               Server-side validateStudySet
  (never trust the AI)            (never trust the frontend)
```

## How It Works

1. **User input** — The user types a topic or pastes notes into the textarea.
2. **React → Backend** — The React app sends a `POST /api/generate` request to the Express backend with the trimmed input string.
3. **Backend → Gemini** — The Express server builds a strict prompt (instructing the model to return **only JSON matching a specific schema**), then calls the Gemini SDK using the `GEMINI_API_KEY` from a `.env` file.
4. **JSON parsing** — The backend extracts/parses the JSON from Gemini's text response (defensively, in case the model wraps it or adds text).
5. **Backend validation** — The parsed JSON is validated against a strict schema (title exists, difficulty is one of 3 values, every flashcard has question+answer, every quiz question has 2+ options and answer is in options, etc.).
6. **Validated JSON → React** — The backend returns valid structured JSON, or a 4xx/5xx error with a friendly message.
7. **Frontend validation (again)** — The frontend runs the same validator on the response for defense in depth.
8. **Interactive UI** — React renders the `FlashcardDeck` (flip cards, prev/next, progress) and `Quiz` (select, submit, feedback, score, retake-incorrect, restart).

## Project Structure

```
flam-study-assistant/
│
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx       # Textarea, char counter, example chips, validation
│   │   ├── FlashcardDeck.jsx     # Prev/next/restart deck navigation
│   │   ├── Flashcard.jsx         # Flippable card with progress bar
│   │   ├── Quiz.jsx              # Quiz flow + results + retake incorrect
│   │   ├── ResultView.jsx        # Study set header + deck + quiz
│   │   ├── LoadingState.jsx      # Spinner + skeleton cards
│   │   ├── ErrorState.jsx        # Friendly error + retry
│   │   └── EmptyState.jsx        # Initial onboarding state
│   │
│   ├── lib/
│   │   ├── api.js                # *Only* place that calls /api/generate + AbortController
│   │   └── validateResult.js     # Schema validator for AI JSON
│   │
│   ├── App.jsx                   # Top-level state machine (idle/loading/error/success)
│   ├── main.jsx                  # React root entry
│   └── index.css                 # Responsive CSS, tokens, animations
│
├── server/
│   └── server.js                 # Express app + POST /api/generate + Gemini SDK call
│
├── .env.example                  # Example env vars (no real secrets)
├── .gitignore                    # node_modules, .env, dist, .DS_Store
├── package.json                  # Dependencies + scripts
├── README.md
├── vite.config.js                # Vite + React plugin + /api proxy to :3001
└── index.html                    # Vite HTML entry
```

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** (bundled with Node.js)
- A **Google Gemini API key** (free tier available at [ai.google.dev](https://ai.google.dev/))

## Installation

```bash
npm install
```

This installs React, Vite, Express, the Gemini SDK, and all other dependencies.

## Environment Variables

Create a file named `.env` in the **project root** (same folder as `package.json`) with:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

- `GEMINI_API_KEY` — **Required**. Get one from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- `PORT` — *Optional*. Defaults to `3001` if not set. The Vite proxy in `vite.config.js` expects port 3001.

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`. The `.env.example` file is a safe template.

## Running Locally

### One command (recommended) — starts both frontend + backend:

```bash
npm run dev
```

- Frontend (Vite): [http://localhost:5173](http://localhost:5173)
- Backend (Express): [http://localhost:3001](http://localhost:3001)
- Backend health check: [http://localhost:3001/api/health](http://localhost:3001/api/health)

Vite automatically proxies `/api/*` requests to the Express backend, so the React code just calls `fetch('/api/generate')` without worrying about CORS or origins.

### Individually (for debugging):

```bash
# Backend only
npm run dev:server

# Frontend only (separate terminal)
npm run dev:client
```

### Production build:

```bash
npm run build    # Creates dist/
npm run preview  # Serves the built frontend
```

## Example Usage

Type or click any of these into the input and press **Generate Study Set**:

1. **"Explain binary search"** — Generates flashcards on the algorithm, steps, complexity, plus a 5-question quiz.
2. **"Teach me OS process scheduling"** — Covers FCFS, SJF, Round Robin, Priority scheduling with quiz.
3. **"Explain transformers in NLP"** — Attention, self-attention, multi-head attention, encoder/decoder stacks.
4. Paste your own class notes (up to 5000 characters).

## Error Handling

| Scenario                                | Where              | What the user sees                                                      |
|-----------------------------------------|--------------------|-------------------------------------------------------------------------|
| Empty / whitespace input                | Frontend + Backend | Friendly validation message under the textarea (no network call made) |
| Input too long (>5000 chars)            | Frontend + Backend | Character limit error + disabled button                                |
| Backend unreachable                     | Frontend `api.js`  | ErrorState: "Cannot connect to server. Please check your connection."  |
| AI returns malformed JSON               | Backend extractJSON | ErrorState: "Could not parse AI response. Please try again."          |
| Valid JSON but wrong shape/missing fields | Backend + Frontend validator | ErrorState with the specific field issue (e.g. "Missing title.") |
| AI returns empty response               | Backend            | ErrorState: "AI returned an empty response. Please try again."         |
| Gemini API quota/network error          | Backend try/catch  | ErrorState: "AI service is temporarily unavailable."                  |
| Request is slow or hung                 | Frontend `api.js`  | LoadingState visible the whole time; button disabled                   |
| **Two requests started quickly (stale)** | Frontend AbortController + requestId ref | **First response is silently discarded — only the latest request wins** |

## AI Usage Note

AI coding assistants were used during development for brainstorming, debugging, code suggestions, and documentation. The final implementation was reviewed and adapted by the author.

## Known Limitations

- AI-generated content may occasionally contain factual inaccuracies. Always verify critical facts from reliable sources.
- The quiz generator always produces 4-option MCQs per the schema; true/false or free-response questions are not supported.
- Study sets are generated once and stored only in React state — there is no persistence (no database, no local storage). Refresh the page to start fresh.
- The free Gemini API tier has rate limits and quota. If requests fail, try again after a moment or add a paid API key.
- Responses in languages other than English work, but the prompt is in English so English content generally gives the most consistent JSON structure.
- No user accounts or saving sets — intended as a single-session study tool (deliberate per scope).

## Time Spent

Edit this section with your actual time:

- Planning & architecture: ______ hours
- Backend (Express + Gemini): ______ hours
- Validation layer: ______ hours
- Frontend components (flashcards, quiz, states): ______ hours
- CSS + responsive design: ______ hours
- README + docs: ______ hours
- Testing + bug fixes: ______ hours

**Total: ______ hours**
