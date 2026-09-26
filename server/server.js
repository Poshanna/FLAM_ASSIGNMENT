import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

/* =========================================================
   VALIDATE STUDY SET
========================================================= */

function validateStudySet(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      valid: false,
      error: 'Response must be a JSON object.',
    };
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return {
      valid: false,
      error: 'Title is missing or empty.',
    };
  }

  const validDifficulties = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  if (
    typeof data.difficulty !== 'string' ||
    !validDifficulties.includes(data.difficulty)
  ) {
    return {
      valid: false,
      error:
        'Difficulty must be Beginner, Intermediate, or Advanced.',
    };
  }

  /* ---------------- FLASHCARDS ---------------- */

  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    return {
      valid: false,
      error: 'Flashcards array is missing or empty.',
    };
  }

  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];

    if (!card || typeof card !== 'object') {
      return {
        valid: false,
        error: `Flashcard ${i + 1} is invalid.`,
      };
    }

    if (
      typeof card.question !== 'string' ||
      !card.question.trim()
    ) {
      return {
        valid: false,
        error: `Flashcard ${i + 1} is missing a question.`,
      };
    }

    if (
      typeof card.answer !== 'string' ||
      !card.answer.trim()
    ) {
      return {
        valid: false,
        error: `Flashcard ${i + 1} is missing an answer.`,
      };
    }
  }

  /* ---------------- QUIZ ---------------- */

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return {
      valid: false,
      error: 'Quiz array is missing or empty.',
    };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];

    if (!q || typeof q !== 'object') {
      return {
        valid: false,
        error: `Quiz question ${i + 1} is invalid.`,
      };
    }

    if (
      typeof q.question !== 'string' ||
      !q.question.trim()
    ) {
      return {
        valid: false,
        error: `Quiz question ${i + 1} is missing a question.`,
      };
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      return {
        valid: false,
        error:
          `Quiz question ${i + 1} must have at least 2 options.`,
      };
    }

    for (const opt of q.options) {
      if (typeof opt !== 'string' || !opt.trim()) {
        return {
          valid: false,
          error:
            `Quiz question ${i + 1} has an invalid option.`,
        };
      }
    }

    if (
      typeof q.answer !== 'string' ||
      !q.answer.trim()
    ) {
      return {
        valid: false,
        error:
          `Quiz question ${i + 1} is missing an answer.`,
      };
    }

    if (!q.options.includes(q.answer)) {
      return {
        valid: false,
        error:
          `Quiz question ${i + 1} answer is not in options.`,
      };
    }
  }

  return {
    valid: true,
  };
}

/* =========================================================
   BUILD PROMPT
========================================================= */

function buildPrompt(input) {
  return `You are an educational content generator.

Given the user's study topic or notes, generate a compact study set.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in \`\`\`json.
Do not add explanations before or after the JSON.

The response MUST exactly follow this structure:

{
  "title": "string",
  "difficulty": "Beginner | Intermediate | Advanced",
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    }
  ]
}

Requirements:
- Generate 5-8 flashcards
- Generate exactly 5 quiz questions
- Each quiz question must have exactly 4 options
- The answer for each quiz question must be one of the 4 options
- Make the content factually accurate and educational
- Difficulty should be Beginner, Intermediate, or Advanced based on the topic

User input:
${input}`;
}

/* =========================================================
   EXTRACT JSON
========================================================= */

function extractJSON(text) {
  if (!text) {
    return null;
  }

  const trimmed = text.trim();

  /* First attempt: pure JSON */

  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to extraction attempt
  }

  /* Second attempt: JSON surrounded by text */

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    const jsonStr = trimmed.slice(
      firstBrace,
      lastBrace + 1
    );

    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }

  return null;
}

/* =========================================================
   TRANSIENT GEMINI ERROR CHECK
========================================================= */

function isTransientGeminiError(error) {
  const message = error?.message || String(error);
  const lowerMessage = message.toLowerCase();

  return (
    message.includes('429') ||
    message.includes('500') ||
    message.includes('503') ||
    lowerMessage.includes('high demand') ||
    lowerMessage.includes('temporarily unavailable') ||
    lowerMessage.includes('service unavailable')
  );
}

/* =========================================================
   WAIT HELPER
========================================================= */

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* =========================================================
   GEMINI GENERATION
========================================================= */

async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const modelName = 'gemini-3.8-flash';

  const maxAttempts = 3;

  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Gemini request attempt ${attempt}/${maxAttempts} using ${modelName}`
      );

      const interaction = await ai.interactions.create({
        model: modelName,
        input: prompt,
      });

      console.log(
        `Gemini request succeeded on attempt ${attempt}`
      );

      return interaction;

    } catch (error) {
      lastError = error;

      const message =
        error?.message || String(error);

      console.error(
        `Gemini attempt ${attempt} failed:`,
        message
      );

      /*
       * Permanent errors:
       * - invalid API key
       * - invalid model
       * - malformed request
       *
       * Don't waste retries on them.
       */

      if (!isTransientGeminiError(error)) {
        throw error;
      }

      /*
       * Retry temporary errors.
       */

      if (attempt < maxAttempts) {
        const delay = attempt * 2000;

        console.log(
          `Temporary Gemini error. Retrying in ${delay}ms...`
        );

        await wait(delay);
      }
    }
  }

  throw (
    lastError ||
    new Error('Gemini request failed.')
  );
}

/* =========================================================
   GENERATE STUDY SET API
========================================================= */

app.post('/api/generate', async (req, res) => {
  try {
    const { input } = req.body;

    /* ---------------- INPUT VALIDATION ---------------- */

    if (
      !input ||
      typeof input !== 'string' ||
      !input.trim()
    ) {
      return res.status(400).json({
        error:
          'Please enter a study topic or notes.',
      });
    }

    const trimmedInput = input.trim();

    /* ---------------- INPUT SIZE LIMIT ---------------- */

    if (trimmedInput.length > 5000) {
      return res.status(400).json({
        error:
          'Input is too long. Please keep it under 5000 characters.',
      });
    }

    /* ---------------- API KEY CHECK ---------------- */

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error:
          'Server configuration error. API key is missing.',
      });
    }

    /* ---------------- BUILD PROMPT ---------------- */

    const prompt = buildPrompt(trimmedInput);

    /* ---------------- CALL GEMINI ---------------- */

    let result;

    try {
      result = await generateWithGemini(prompt);

    } catch (geminiErr) {
      console.error(
        'Gemini API error:',
        geminiErr?.message || geminiErr
      );

      return res.status(502).json({
        error:
          'AI service is temporarily unavailable. Please try again later.',
      });
    }

    /* =====================================================
       EXTRACT RESPONSE TEXT
    ===================================================== */

    const responseText = result?.output_text;

    if (
      !responseText ||
      !responseText.trim()
    ) {
      return res.status(502).json({
        error:
          'AI returned an empty response. Please try again.',
      });
    }

    /* =====================================================
       PARSE JSON
    ===================================================== */

    const parsed = extractJSON(responseText);

    if (!parsed) {
      console.error(
        'Could not parse Gemini response:',
        responseText.slice(0, 500)
      );

      return res.status(502).json({
        error:
          'Could not parse AI response. Please try again.',
      });
    }

    /* =====================================================
       VALIDATE GENERATED STRUCTURE
    ===================================================== */

    const validation = validateStudySet(parsed);

    if (!validation.valid) {
      console.error(
        'Validation error:',
        validation.error
      );

      globalThis.__lastRawGeminiResponse =
        responseText;

      globalThis.__lastParsedResponse = {
        parsed,
        validationError: validation.error,
      };

      return res.status(502).json({
        error:
          validation.error +
          ' Please try again.',
      });
    }

    /* =====================================================
       STORE LAST SUCCESSFUL RESPONSE
    ===================================================== */

    globalThis.__lastRawGeminiResponse =
      responseText;

    globalThis.__lastParsedResponse =
      parsed;

    /* =====================================================
       RETURN ONLY VALIDATED DATA
    ===================================================== */

    return res.json({
      title: parsed.title,
      difficulty: parsed.difficulty,
      flashcards: parsed.flashcards,
      quiz: parsed.quiz,
    });

  } catch (err) {
    console.error(
      'Server error:',
      err?.message || err
    );

    return res.status(500).json({
      error:
        'Something went wrong on our end. Please try again.',
    });
  }
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!process.env.GEMINI_API_KEY,
  });
});

/* =========================================================
   LAST RESPONSE - DEBUGGING
========================================================= */

app.get('/api/last-response', (_req, res) => {
  try {
    if (globalThis.__lastRawGeminiResponse) {
      return res.json({
        rawTextLength:
          globalThis.__lastRawGeminiResponse.length,

        rawTextPreview:
          globalThis.__lastRawGeminiResponse.slice(
            0,
            400
          ),

        parsedJson:
          globalThis.__lastParsedResponse || null,
      });
    }

    return res.json({
      empty: true,
    });

  } catch (e) {
    return res.json({
      error: e.message,
    });
  }
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});