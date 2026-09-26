export function validateResult(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Invalid response format.' };
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return { valid: false, error: 'Missing or invalid title.' };
  }

  const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
  if (typeof data.difficulty !== 'string' || !validDifficulties.includes(data.difficulty)) {
    return { valid: false, error: 'Difficulty must be Beginner, Intermediate, or Advanced.' };
  }

  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    return { valid: false, error: 'No flashcards were generated.' };
  }

  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];
    if (!card || typeof card !== 'object') {
      return { valid: false, error: `Flashcard ${i + 1} is invalid.` };
    }
    if (typeof card.question !== 'string' || !card.question.trim()) {
      return { valid: false, error: `Flashcard ${i + 1} is missing a question.` };
    }
    if (typeof card.answer !== 'string' || !card.answer.trim()) {
      return { valid: false, error: `Flashcard ${i + 1} is missing an answer.` };
    }
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return { valid: false, error: 'No quiz questions were generated.' };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    if (!q || typeof q !== 'object') {
      return { valid: false, error: `Quiz question ${i + 1} is invalid.` };
    }
    if (typeof q.question !== 'string' || !q.question.trim()) {
      return { valid: false, error: `Quiz question ${i + 1} is missing a question.` };
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return { valid: false, error: `Quiz question ${i + 1} must have at least 2 options.` };
    }
    for (const opt of q.options) {
      if (typeof opt !== 'string' || !opt.trim()) {
        return { valid: false, error: `Quiz question ${i + 1} has an invalid option.` };
      }
    }
    if (typeof q.answer !== 'string' || !q.answer.trim()) {
      return { valid: false, error: `Quiz question ${i + 1} is missing an answer.` };
    }
    if (!q.options.includes(q.answer)) {
      return { valid: false, error: `Quiz question ${i + 1} answer doesn't match any option.` };
    }
  }

  return { valid: true };
}
