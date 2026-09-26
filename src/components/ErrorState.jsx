export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">
        {message || "We couldn't generate your study set. Please try again."}
      </p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
