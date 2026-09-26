export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">📚</div>
      <h2 className="empty-title">Welcome to AI Study Assistant</h2>
      <p className="empty-subtitle">
        Enter a study topic or paste your notes above to generate interactive flashcards
        and a multiple-choice quiz instantly.
      </p>
      <ul className="empty-features">
        <li>🎯 Generate personalized flashcards on any topic</li>
        <li>✅ Test your knowledge with a quiz</li>
        <li>🔁 Retake only the questions you missed</li>
        <li>📱 Works great on your phone too</li>
      </ul>
    </div>
  );
}
