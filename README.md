# AI Study Assistant

**Turn any topic into an interactive study session.**

## 🚀 LIVE DEMO

**Frontend:** https://flam-study-assistant-71v5.onrender.com

**Backend API:** https://flam-assignment-0h7b.onrender.com

**Backend Health Check:** https://flam-assignment-0h7b.onrender.com/api/health

> The backend is an API service. Use `/api/health` for the health check.

## 📌 OVERVIEW

AI Study Assistant turns any study topic or notes into an interactive study session using Google Gemini. It generates **flashcards**, a **multiple-choice quiz**, **automatic scoring**, and **retake incorrect questions**.

This is **not a chatbot**. The LLM returns structured JSON that is validated before being rendered as interactive React components.

## ✨ FEATURES

- 📝 **Free-form study topic input**
- 🤖 **Google Gemini AI integration**
- 📇 **Interactive flashcards**
- 🧠 **Multiple-choice quiz**
- ✅ **Automatic scoring**
- 🔁 **Retake incorrect questions**
- ⟳ **Quiz restart**
- ⏳ **Loading states**
- ❌ **Error handling**
- 🛡️ **AI JSON validation**
- 🚫 **Stale-response protection**
- 📱 **Responsive design**
- ♿ **Accessibility support**
- 🔐 **Backend-only API key**

## 🛠️ TECH STACK

| **Layer** | **Technology** |
|---|---|
| **Frontend** | React 18, Vite, JSX, React Hooks, Functional Components, CSS |
| **Backend** | Node.js, Express.js |
| **AI** | Google Gemini API (`@google/genai`) |
| **Other** | dotenv, cors, concurrently |

## 🏗️ ARCHITECTURE

### **LOCAL DEVELOPMENT**

```text
React / Vite :5173
      │
      │ HTTP POST /api/generate
      ▼
Express Backend :3001
      │
      │ Gemini API
      ▼
Google Gemini
```

### **PRODUCTION DEPLOYMENT**

```text
React / Vite Frontend (Render)
          │
          │ HTTPS /api/generate
          ▼
Express Backend (Render)
          │
          │ Gemini API
          ▼
Google Gemini
```

**The Gemini API key is stored only on the backend.**

## ⚙️ HOW IT WORKS

1. **User Input** — User enters a study topic or notes.
2. **React → Backend** — React sends `POST /api/generate`.
3. **Backend → Gemini** — Express creates a structured prompt and calls Gemini.
4. **JSON Parsing** — The backend extracts and parses the AI response.
5. **Backend Validation** — The generated JSON is validated against the expected schema.
6. **Frontend Validation** — The frontend validates the response again.
7. **Interactive Rendering** — React renders flashcards and quiz questions.
8. **Quiz Evaluation** — The application calculates the score.
9. **Retake Incorrect Questions** — Users can retry only the questions they answered incorrectly.

## 📁 PROJECT STRUCTURE

```text
flam-study-assistant/
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
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
└── index.html
```

## 🔑 PREREQUISITES

- **Node.js >= 18**
- **npm**
- **Google Gemini API key**

Get a Gemini API key from: https://aistudio.google.com/app/apikey

## 📥 INSTALLATION

### **1. Clone the Repository**

```bash
git clone https://github.com/Poshanna/FLAM_ASSIGNMENT.git
```

### **2. Navigate to the Project**

```bash
cd FLAM_ASSIGNMENT
```

### **3. Install Dependencies**

```bash
npm install
```

## 🔐 ENVIRONMENT VARIABLES

### **Local Development**

Create `.env` in the project root:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

- **GEMINI_API_KEY** — Required Gemini API key
- **PORT** — Optional backend port; defaults to `3001`

> ⚠️ **Never commit `.env` to GitHub.** The `.env.example` file is a safe template.

### **Production**

The Gemini API key is configured securely as an environment variable in the Render backend and is **never exposed to the frontend**.

## ▶️ RUNNING LOCALLY

### **Start Frontend + Backend**

```bash
npm run dev
```

**Frontend:** `http://localhost:5173`  
**Backend:** `http://localhost:3001`  
**Health Check:** `http://localhost:3001/api/health`

## 🏭 PRODUCTION BUILD

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## ☁️ DEPLOYMENT

The application is deployed using **Render**.

### **FRONTEND**

**Live URL:** https://flam-study-assistant-71v5.onrender.com

**Build Command:**

```bash
npm install && npm run build
```

**Publish Directory:** `dist`

**Production Environment Variable:**

```text
VITE_API_URL=https://flam-assignment-0h7b.onrender.com
```

### **BACKEND**

**Live URL:** https://flam-assignment-0h7b.onrender.com

**Build Command:** `npm install`  
**Start Command:** `node server/server.js`

**Health Check:** https://flam-assignment-0h7b.onrender.com/api/health

> **Render Free Tier:** The backend may spin down after inactivity, so the first request after inactivity may take longer.

## 🧪 EXAMPLE USAGE

### **Example 1 — Binary Search**

```text
Explain binary search
```

### **Example 2 — Operating Systems**

```text
Teach me OS process scheduling
```

### **Example 3 — NLP**

```text
Explain transformers in NLP
```

### **Example 4 — Personal Notes**

Paste your own class notes. **Maximum input length: 5000 characters.**

## 🛡️ ERROR HANDLING

| **Scenario** | **Handling** | **User Experience** |
|---|---|---|
| Empty input | Frontend + Backend validation | Friendly validation message |
| Input > 5000 characters | Frontend + Backend validation | Character limit error |
| Backend unreachable | API error handling | Connection error + retry |
| Malformed AI JSON | JSON parsing | Friendly error |
| Wrong JSON structure | Backend + Frontend validation | Specific validation error |
| Empty AI response | Backend validation | Retry message |
| Gemini API failure | Backend error handling | Temporary service error |
| Slow request | Loading state | Spinner + disabled button |
| Multiple rapid requests | AbortController + request ID | Stale response ignored |

The application never directly trusts AI-generated content. Responses are parsed and validated before being rendered.

## 🤖 AI OUTPUT VALIDATION

The backend validates every generated study set before sending it to the frontend.

Validation includes:

- **Study-set title**
- **Difficulty**
- **Flashcard structure**
- **Flashcard question and answer**
- **Quiz question structure**
- **Multiple-choice options**
- **Correct answer exists in the options**
- **Required fields**

The frontend performs an additional validation pass for **defense in depth**.

## 🚫 STALE RESPONSE PROTECTION

The frontend uses **AbortController** and **request IDs** to prevent older requests from overwriting newer results.

```text
Request A ──────────────────►
Request B ────────►

If B finishes first:
    B becomes the displayed result.

If A finishes later:
    A is ignored.
```

## ♿ ACCESSIBILITY & RESPONSIVE DESIGN

The application supports mobile and desktop screen sizes and includes:

- **Semantic HTML**
- **Keyboard-accessible controls**
- **Visible focus states**
- **Responsive layouts**
- **Mobile-friendly controls**
- **Responsive flashcard interface**
- **Responsive quiz interface**

## 🧪 TESTING

The application was tested for:

- ✅ Study topic generation
- ✅ Flashcard rendering
- ✅ Flashcard reveal
- ✅ Flashcard navigation
- ✅ Quiz interaction
- ✅ Score calculation
- ✅ Incorrect-answer tracking
- ✅ Retake incorrect questions
- ✅ Quiz restart
- ✅ Empty input
- ✅ Invalid input
- ✅ AI/API failures
- ✅ Loading states
- ✅ Backend health
- ✅ Production frontend/backend communication
- ✅ Production build

Production build:

```bash
npm run build
```

## 🤖 AI USAGE NOTE

AI coding assistants were used during development for:

- Brainstorming
- Debugging
- Code suggestions
- Documentation assistance

The final implementation was **reviewed, tested, and adapted by the author**.

## ⚠️ KNOWN LIMITATIONS

- AI-generated content may occasionally contain factual inaccuracies.
- Important facts should be verified using reliable sources.
- The quiz currently uses multiple-choice questions.
- True/false and free-response questions are not currently supported.
- Study sets are stored only in React state.
- There is no database persistence.
- Refreshing the page starts a new session.
- The free Gemini API tier has rate limits and quotas.
- AI-generated content is primarily optimized for English.
- There are no user accounts or cloud-saved study sets.
- The application is designed as a focused single-session study tool.

## 📦 REPOSITORY

**GitHub Repository:**

https://github.com/Poshanna/FLAM_ASSIGNMENT

## ⏱️ TIME SPENT

Replace the values below with your **actual approximate time**:

- **Planning & Architecture:** `___ hours`
- **Backend (Express + Gemini):** `___ hours`
- **Validation Layer:** `___ hours`
- **Frontend Components:** `___ hours`
- **CSS + Responsive Design:** `___ hours`
- **README + Documentation:** `___ hours`
- **Testing + Bug Fixes:** `___ hours`

### **TOTAL: `___ HOURS`**

## 👨‍💻 AUTHOR

**Poshanna Durki**  
**AI & ML Undergraduate Student**

**GitHub:** https://github.com/Poshanna
