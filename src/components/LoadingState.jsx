export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <h2 className="loading-title">Creating your study set...</h2>
      <p className="loading-subtitle">
        The AI is analyzing your topic and generating flashcards and quiz questions.
      </p>
      <div className="skeleton-cards" aria-hidden="true">
        <div className="skeleton skeleton-card"></div>
        <div className="skeleton skeleton-card"></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    </div>
  );
}
