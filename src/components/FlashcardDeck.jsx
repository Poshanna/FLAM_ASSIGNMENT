import { useState, useEffect } from 'react';
import Flashcard from './Flashcard';

export default function FlashcardDeck({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = flashcards.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [flashcards]);

  const currentCard = flashcards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCards - 1;

  function goPrev() {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function goNext() {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function restart() {
    setCurrentIndex(0);
  }

  return (
    <section className="flashcard-deck" aria-labelledby="flashcards-heading">
      <header className="section-header">
        <h2 id="flashcards-heading" className="section-title">
          📇 Flashcards
        </h2>
        <span className="section-badge">{totalCards} cards</span>
      </header>

      <Flashcard
        key={currentIndex}
        card={currentCard}
        cardNumber={currentIndex + 1}
        totalCards={totalCards}
      />

      <div className="deck-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous flashcard"
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-restart"
          onClick={restart}
          aria-label="Restart flashcards from beginning"
        >
          ⟳ Restart
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next flashcard"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
