import { useState } from 'react';

const EXAMPLE_PROMPTS = [
  'Explain binary search',
  'Teach me OS process scheduling',
  'Explain transformers in NLP',
];

const MAX_INPUT_LENGTH = 5000;

export default function PromptInput({ value, onChange, onSubmit, isLoading }) {
  const [validationError, setValidationError] = useState('');

  const charCount = value.length;
  const isOverLimit = charCount > MAX_INPUT_LENGTH;
  const isEmpty = !value.trim();
  const isDisabled = isLoading || isEmpty || isOverLimit;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Please enter a study topic or notes.');
      return;
    }
    if (trimmed.length > MAX_INPUT_LENGTH) {
      setValidationError(`Input is too long (${trimmed.length} characters). Maximum is ${MAX_INPUT_LENGTH}.`);
      return;
    }
    setValidationError('');
    onSubmit(trimmed);
  }

  function handleChange(e) {
    const newValue = e.target.value;
    onChange(newValue);
    if (validationError) {
      if (newValue.trim() && newValue.length <= MAX_INPUT_LENGTH) {
        setValidationError('');
      }
    }
  }

  function handleExampleClick(example) {
    onChange(example);
    if (validationError) setValidationError('');
  }

  return (
    <section className="prompt-section" aria-labelledby="prompt-heading">
      <div className="prompt-header">
        <h1 id="prompt-heading" className="app-title">AI Study Assistant</h1>
        <p className="app-tagline">Turn any topic into an interactive study session.</p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-form" noValidate>
        <label htmlFor="study-input" className="prompt-label">
          Study Topic or Notes
        </label>
        <textarea
          id="study-input"
          className={`prompt-textarea ${validationError || isOverLimit ? 'has-error' : ''}`}
          value={value}
          onChange={handleChange}
          placeholder="Paste your notes or enter a topic..."
          rows={5}
          disabled={isLoading}
          aria-describedby={validationError ? 'input-error input-count' : 'input-count'}
          aria-invalid={!!validationError || isOverLimit}
        />
        <div className="prompt-footer">
          <div className="prompt-meta">
            <span
              id="input-count"
              className={`char-count ${isOverLimit ? 'over-limit' : ''}`}
            >
              {charCount} / {MAX_INPUT_LENGTH}
            </span>
            {validationError && (
              <span id="input-error" className="validation-error" role="alert">
                {validationError}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-generate"
            disabled={isDisabled}
            aria-busy={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Study Set'}
          </button>
        </div>
      </form>

      <div className="examples-section">
        <p className="examples-label">Try an example:</p>
        <div className="examples-list" role="list">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              className="example-chip"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              role="listitem"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
