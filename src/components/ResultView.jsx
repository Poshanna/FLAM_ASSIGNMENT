import FlashcardDeck from './FlashcardDeck';
import Quiz from './Quiz';

export default function ResultView({ studySet, onNewTopic }) {
  const { title, difficulty, flashcards, quiz } = studySet;

  function getDifficultyClass() {
    switch (difficulty) {
      case 'Beginner':
        return 'difficulty-beginner';
      case 'Intermediate':
        return 'difficulty-intermediate';
      case 'Advanced':
        return 'difficulty-advanced';
      default:
        return '';
    }
  }

  return (
    <section className="result-view" aria-labelledby="study-set-title">
      <header className="study-set-header">
        <div className="study-set-title-row">
          <h1 id="study-set-title" className="study-set-title">
            {title}
          </h1>
          <span className={`difficulty-badge ${getDifficultyClass()}`}>
            {difficulty}
          </span>
        </div>
        {onNewTopic && (
          <button
            type="button"
            className="btn btn-secondary btn-new-topic"
            onClick={onNewTopic}
          >
            + New Topic
          </button>
        )}
      </header>

      <FlashcardDeck flashcards={flashcards} />
      <Quiz questions={quiz} />
    </section>
  );
}
