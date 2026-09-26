import { useState } from 'react';

export default function Flashcard({ card, cardNumber, totalCards }) {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleToggle() {
    setIsFlipped((prev) => !prev);
  }

  const progressPercent = Math.round((cardNumber / totalCards) * 100);

  return (
    <article className="flashcard-wrapper" aria-label={`Flashcard ${cardNumber} of ${totalCards}`}>
      <div className="flashcard-header">
        <span className="flashcard-counter">
          Flashcard {cardNumber} / {totalCards}
        </span>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={cardNumber}
          aria-valuemin={1}
          aria-valuemax={totalCards}
          aria-label={`${progressPercent}% complete`}
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <button
        type="button"
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleToggle}
        aria-expanded={isFlipped}
        aria-label={isFlipped ? 'Hide answer, show question' : 'Show answer'}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">Question</span>
            <p className="flashcard-content">{card.question}</p>
            <span className="flashcard-hint">Click to reveal answer</span>
          </div>
          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">Answer</span>
            <p className="flashcard-content">{card.answer}</p>
            <span className="flashcard-hint">Click to hide answer</span>
          </div>
        </div>
      </button>

      <div className="flashcard-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleToggle}
        >
          {isFlipped ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
    </article>
  );
}
