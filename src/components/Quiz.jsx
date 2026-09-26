import { useState, useEffect, useMemo } from 'react';

export default function Quiz({ questions, initialMode = 'full' }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswers([]);
    setShowResults(false);
    setMode('full');
  }, [questions]);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;

  const score = useMemo(() => {
    return answers.filter((a) => a.isCorrect).length;
  }, [answers]);

  const incorrectAnswers = useMemo(() => {
    return answers.filter((a) => !a.isCorrect);
  }, [answers]);

  const progressPercent = showResults
    ? 100
    : Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / totalQuestions) * 100);

  function handleSelectOption(option) {
    if (isSubmitted) return;
    setSelectedOption(option);
  }

  function handleSubmit() {
    if (selectedOption === null || isSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.answer;
    const newAnswer = {
      questionIndex: currentIndex,
      originalQuestion: currentQuestion,
      selected: selectedOption,
      isCorrect,
    };
    setAnswers((prev) => [...prev, newAnswer]);
    setIsSubmitted(true);
  }

  function handleNext() {
    if (isLast) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setIsSubmitted(false);
  }

  function handleRestart() {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswers([]);
    setShowResults(false);
    setMode('full');
  }

  function handleRetakeIncorrect() {
    if (incorrectAnswers.length === 0) return;
    const missedQuestions = incorrectAnswers.map((a) => a.originalQuestion);
    setActiveQuestions(missedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswers([]);
    setShowResults(false);
    setMode('retake');
  }

  function getOptionClass(option) {
    const base = 'quiz-option';
    if (!isSubmitted) {
      if (selectedOption === option) return `${base} quiz-option-selected`;
      return base;
    }
    const isCorrectAnswer = option === currentQuestion.answer;
    const isSelected = selectedOption === option;
    if (isCorrectAnswer) return `${base} quiz-option-correct`;
    if (isSelected && !isCorrectAnswer) return `${base} quiz-option-incorrect`;
    return `${base} quiz-option-disabled`;
  }

  if (showResults) {
    return (
      <section className="quiz quiz-results" aria-labelledby="quiz-results-heading">
        <header className="section-header">
          <h2 id="quiz-results-heading" className="section-title">
            ✅ Quiz Results
          </h2>
          {mode === 'retake' && (
            <span className="section-badge badge-retake">Retake Mode</span>
          )}
        </header>

        <div className="quiz-score-card">
          <div className="quiz-score-main">
            <span className="quiz-score-number">
              {score} <span className="quiz-score-divider">/</span> {totalQuestions}
            </span>
            <p className="quiz-score-label">Your Score</p>
          </div>
          <div className="quiz-score-breakdown">
            <div className="score-item score-correct">
              <span className="score-count">✅ {score}</span>
              <span className="score-label">Correct</span>
            </div>
            <div className="score-item score-incorrect">
              <span className="score-count">❌ {totalQuestions - score}</span>
              <span className="score-label">Incorrect</span>
            </div>
          </div>
        </div>

        {incorrectAnswers.length > 0 && mode === 'full' && (
          <div className="quiz-review">
            <h3 className="quiz-review-title">Questions you missed:</h3>
            <ol className="quiz-review-list">
              {incorrectAnswers.map((item, idx) => (
                <li key={idx} className="quiz-review-item">
                  <p className="quiz-review-question">{item.originalQuestion.question}</p>
                  <p className="quiz-review-your">
                    <strong>Your answer:</strong>{' '}
                    <span className="text-incorrect">{item.selected}</span>
                  </p>
                  <p className="quiz-review-correct">
                    <strong>Correct answer:</strong>{' '}
                    <span className="text-correct">{item.originalQuestion.answer}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="quiz-results-actions">
          {incorrectAnswers.length > 0 && mode === 'full' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRetakeIncorrect}
            >
              🔁 Retake Incorrect Questions ({incorrectAnswers.length})
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={handleRestart}>
            ⟳ Restart Quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz" aria-labelledby="quiz-heading">
      <header className="section-header">
        <h2 id="quiz-heading" className="section-title">
          🧠 Quiz
        </h2>
        <div className="section-header-right">
          {mode === 'retake' && <span className="section-badge badge-retake">Retake Mode</span>}
          <span className="section-badge">{totalQuestions} questions</span>
        </div>
      </header>

      <div className="quiz-progress-info">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span>Score: {score}</span>
      </div>
      <div
        className="progress-bar quiz-progress"
        role="progressbar"
        aria-valuenow={currentIndex + (isSubmitted ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-label={`${progressPercent}% of quiz complete`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="quiz-question-card">
        <h3 className="quiz-question-text">{currentQuestion.question}</h3>

        <fieldset className="quiz-options" disabled={isSubmitted}>
          <legend className="visually-hidden">Answer options</legend>
          {currentQuestion.options.map((option, optIdx) => (
            <button
              key={optIdx}
              type="button"
              className={getOptionClass(option)}
              onClick={() => handleSelectOption(option)}
              disabled={isSubmitted}
              aria-pressed={selectedOption === option}
              aria-describedby={
                isSubmitted
                  ? option === currentQuestion.answer
                    ? 'correct-feedback'
                    : selectedOption === option
                    ? 'incorrect-feedback'
                    : undefined
                  : undefined
              }
            >
              <span className="quiz-option-letter">
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="quiz-option-text">{option}</span>
              {isSubmitted && option === currentQuestion.answer && (
                <span className="quiz-option-icon" aria-hidden="true">✓</span>
              )}
              {isSubmitted && selectedOption === option && option !== currentQuestion.answer && (
                <span className="quiz-option-icon" aria-hidden="true">✗</span>
              )}
            </button>
          ))}
        </fieldset>

        {isSubmitted && (
          <div
            className="quiz-feedback"
            role="status"
            id={
              answers[answers.length - 1]?.isCorrect
                ? 'correct-feedback'
                : 'incorrect-feedback'
            }
          >
            {answers[answers.length - 1]?.isCorrect ? (
              <p className="quiz-feedback-correct">✅ Correct! Great job.</p>
            ) : (
              <p className="quiz-feedback-incorrect">
                ❌ Not quite. The correct answer is:{' '}
                <strong>{currentQuestion.answer}</strong>
              </p>
            )}
          </div>
        )}

        <div className="quiz-question-actions">
          {!isSubmitted ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={selectedOption === null}
            >
              Submit Answer
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              {isLast ? 'View Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
