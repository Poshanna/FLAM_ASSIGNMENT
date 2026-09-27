# AI Study Assistant

Turn any topic into an interactive study session.

## Live Demo

**Frontend:**  
https://flam-study-assistant-71v5.onrender.com

**Backend API:**  
https://flam-assignment-0h7b.onrender.com

**Backend Health Check:**  
https://flam-assignment-0h7b.onrender.com/api/health

> **Note:** The backend is an API service. Opening the backend root URL `/` directly may display `Cannot GET /`. The `/api/health` endpoint is the correct health-check endpoint.

---

## Overview

AI Study Assistant is a small AI-powered React application that turns any study topic or notes into an interactive study session.

Enter a topic, and the application generates:

- Interactive flashcards
- Multiple-choice quiz questions
- Automatic scoring
- Correct/incorrect breakdown
- A focused retake mode for incorrect questions

This is **not a chatbot**. The LLM returns structured JSON that is validated before being rendered as interactive React components.

---

## Features

- 📝 Free-form text input for any study topic or notes
- 🤖 Generates structured study sets using Google Gemini API
- 📇 Interactive flashcards with reveal, navigation, and progress
- 🧠 Multiple-choice quiz with answer feedback
- ✅ Automatic scoring with correct/incorrect breakdown
- 🔁 "Retake Incorrect Questions" mode
- ⟳ Full quiz restart
- ⏳ Loading state with spinner and skeleton UI
- ❌ Friendly error states with retry
- 🛡️ Defensive validation of AI-generated JSON
- 🚫 Stale-response protection
- 📱 Fully responsive from mobile to desktop
- ♿ Semantic HTML, keyboard accessibility, and visible focus states
- 🔐 API key is stored only on the backend and never exposed to the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JSX, React Hooks, Functional Components, CSS |
| Backend | Node.js, Express.js |
| AI | Google Gemini API (`@google/genai`) |
| Other | dotenv, cors, concurrently |

---

## Architecture

### Local Development

```text
┌──────────────┐     HTTP POST      ┌──────────────────┐
│  React App   │ ─────────────────▶ │  Express Server  │
│   (Vite)     │                    │     :3001        │
│    :5173     │ ◀───────────────── │                  │
└──────────────┘                    └────────┬─────────┘
                                             │
                                             │ Gemini API
                                             ▼
                                      ┌──────────────┐
                                      │    Gemini    │
                                      │     API      │
                                      └──────────────┘

Production Deployment
┌──────────────────────────┐
│   React / Vite Frontend  │
│      Render Static Site  │
└────────────┬─────────────┘
             │
             │ HTTPS /api/generate
             ▼
┌──────────────────────────┐
│    Express Backend       │
│     Render Web Service   │
└────────────┬─────────────┘
             │
             │ Gemini API
             ▼
┌──────────────────────────┐
│      Google Gemini       │
└──────────────────────────┘

The frontend communicates with the deployed Express backend, while the Gemini API key remains securely configured on the backend.
How It Works
1. User input
   The user types a topic or pastes notes into the textarea.
2. React → Backend
   The React application sends a POST /api/generate request containing the study topic.
3. Backend → Gemini
   The Express server builds a structured prompt and calls the Gemini API using the backend environment variable GEMINI_API_KEY.
4. JSON parsing
   The backend extracts and parses the JSON returned by Gemini.
5. Backend validation
   The generated study set is validated against the expected schema.
6. Validated response → React
   Valid structured JSON is returned to the frontend. Invalid or malformed responses are rejected with a user-friendly error.
7. Frontend validation
   The frontend validates the response again for defense in depth.
8. Interactive UI
   React renders the flashcards and quiz.
9. Quiz results
   The application calculates the score and identifies incorrect questions.
10. Retake incorrect questions
    Users can retake only the questions they previously answered incorrectly.
Project Structure
flam-study-assistant/
│
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── Flashcard.jsx
│   │   ├── Quiz.jsx
│   │   ├── ResultView.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
└── index.html

Important Files
- App.jsx — Top-level application state and request handling
- PromptInput.jsx — Topic input, examples, validation, and character counter
- FlashcardDeck.jsx — Flashcard navigation and restart
- Flashcard.jsx — Individual flashcard interaction
- Quiz.jsx — Quiz flow, scoring, results, and retake functionality
- api.js — Backend API communication and request cancellation
- validateResult.js — Frontend validation of AI-generated JSON
- server.js — Express API, Gemini integration, parsing, validation, and error handling
- vite.config.js — Vite configuration and local /api proxy
Prerequisites
- Node.js >= 18
- npm
- Google Gemini API key
A Gemini API key can be obtained from:
https://aistudio.google.com/app/apikey
Installation
Clone the repository:
git clone https://github.com/Poshanna/FLAM_ASSIGNMENT.git

Navigate into the project:
cd FLAM_ASSIGNMENT

Install dependencies:
npm install

Environment Variables
Local Development
Create a .env file in the project root:
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001

Variables
- GEMINI_API_KEY — Required Gemini API key
- PORT — Optional backend port. Defaults to 3001
⚠️ Never commit .env to GitHub. The .env file is included in .gitignore.
The .env.example file is provided as a safe template without real secrets.

Production
In production, the GEMINI_API_KEY is configured as a secure environment variable in the Render backend service.
The API key is never included in the frontend code.
Running Locally
One Command
Start both the frontend and backend:
npm run dev

Frontend:
http://localhost:5173

Backend:
http://localhost:3001

Health check:
http://localhost:3001/api/health

The Vite development server proxies /api/* requests to the Express backend.
Run Individually
Backend only:
npm run dev:server

Frontend only:
npm run dev:client

Production Build
Build the frontend:
npm run build

Preview the production build locally:
npm run preview

The production frontend is generated inside:
dist/

Deployment
The application is deployed using Render.
Frontend
The React/Vite frontend is deployed as a Render Static Site.
Frontend URL:
https://flam-study-assistant-71v5.onrender.com
Build command:
npm install && npm run build

Publish directory:
dist

Production environment variable:
VITE_API_URL=https://flam-assignment-0h7b.onrender.com

Backend
The Express backend is deployed as a Render Web Service.
Backend URL:
https://flam-assignment-0h7b.onrender.com
Build command:
npm install

Start command:
node server/server.js

The Gemini API key is configured as a backend environment variable.
Backend Health Check
https://flam-assignment-0h7b.onrender.com/api/health
The health endpoint verifies that the backend service is running and that the Gemini API key is configured.
Render Free Tier: The backend may spin down after a period of inactivity. The first request after inactivity can therefore take longer while the service starts again.

Example Usage
Try any of the following:
Example 1
Explain binary search

Generates flashcards covering the algorithm, process, and time/space complexity, followed by a multiple-choice quiz.
Example 2
Teach me OS process scheduling

Covers concepts such as FCFS, SJF, Round Robin, and Priority Scheduling.
Example 3
Explain transformers in NLP

Covers concepts such as attention, self-attention, multi-head attention, and encoder/decoder architecture.
Example 4
Paste your own class notes.
The application supports up to 5000 characters of input.
Error Handling
Scenario	Handling	User Experience
Empty input	Frontend + Backend validation	Friendly validation message
Input over 5000 characters	Frontend + Backend validation	Character limit error
Backend unreachable	Frontend API handling	Connection error with retry
Malformed AI JSON	Backend JSON extraction/parsing	Friendly AI response error
Wrong JSON structure	Backend + Frontend validation	Specific validation error
Empty AI response	Backend validation	Friendly retry message
Gemini API failure	Backend error handling	Temporary service error
Slow request	Loading state	Spinner/skeleton and disabled button
Multiple rapid requests	AbortController + request ID	Stale response is ignored


The application never directly trusts AI-generated content. Responses are parsed and validated before being rendered.
AI Output Validation
The backend validates the generated study set before sending it to the frontend.
Validation includes:
- Study-set title
- Difficulty value
- Flashcard structure
- Flashcard question and answer
- Quiz question structure
- Multiple-choice options
- Correct answer must exist in the provided options
- Required fields must be present
The frontend performs an additional validation pass before rendering the result.
This provides defense in depth against malformed or unexpected AI output.
Stale Response Protection
The frontend uses request cancellation and request IDs to prevent an older request from overwriting the result of a newer request.
For example:
Request A ────────────────►
Request B ────────►

If B finishes first:
B becomes the displayed result.

If A finishes later:
A is ignored.

This prevents race conditions when users submit multiple study topics quickly.
AI Usage Note
AI coding assistants were used during development for:
- Brainstorming
- Debugging
- Code suggestions
- Documentation assistance
The final implementation was reviewed, tested, and adapted by the author.
Known Limitations
- AI-generated content may occasionally contain factual inaccuracies. Important facts should be verified using reliable sources.
- The quiz currently uses multiple-choice questions rather than true/false or free-response questions.
- Study sets are stored only in React state and are not persisted in a database.
- Refreshing the page starts a new session.
- The free Gemini API tier has rate limits and quotas.
- AI-generated content is primarily optimized for English.
- There are no user accounts or cloud-saved study sets.
- The application is designed as a focused single-session study tool.
Accessibility and Responsive Design
The application was designed to work across different screen sizes, including mobile and desktop.
It includes:
- Semantic HTML
- Keyboard-accessible controls
- Visible focus states
- Responsive layouts
- Mobile-friendly buttons and cards
- Responsive flashcard and quiz interfaces
Testing
The application was tested for:
- Study topic generation
- Flashcard rendering
- Flashcard reveal
- Flashcard navigation
- Quiz interaction
- Score calculation
- Incorrect-answer tracking
- Retake incorrect questions
- Quiz restart
- Empty input
- Invalid input
- AI/API failures
- Loading states
- Backend health
- Production frontend/backend communication
- Production build
A production build was successfully generated using:
npm run build

Repository
GitHub:
https://github.com/Poshanna/FLAM_ASSIGNMENT

Author
Poshanna Durki
AI & ML Undergraduate Student
GitHub:
https://github.com/Poshanna
