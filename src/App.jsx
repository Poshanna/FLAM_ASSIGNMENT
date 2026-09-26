import { useState, useCallback, useEffect, useRef } from 'react';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import ResultView from './components/ResultView';
import { generateStudySet, cancelActiveRequest } from './lib/api';

const AppStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(AppStatus.IDLE);
  const [studySet, setStudySet] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastInput, setLastInput] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      cancelActiveRequest();
    };
  }, []);

  const handleGenerate = useCallback(async (input) => {
    const thisRequestId = ++requestIdRef.current;
    setLastInput(input);
    setStatus(AppStatus.LOADING);
    setStudySet(null);
    setErrorMessage('');

    try {
      const result = await generateStudySet(input);
      if (requestIdRef.current !== thisRequestId) {
        return;
      }
      setStudySet(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      if (requestIdRef.current !== thisRequestId) {
        return;
      }
      setErrorMessage(err?.message || 'Something went wrong.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastInput) {
      handleGenerate(lastInput);
    }
  }, [lastInput, handleGenerate]);

  const handleNewTopic = useCallback(() => {
    setStatus(AppStatus.IDLE);
    setStudySet(null);
    setErrorMessage('');
    setInputValue('');
    setLastInput('');
  }, []);

  function renderMainContent() {
    switch (status) {
      case AppStatus.LOADING:
        return <LoadingState />;
      case AppStatus.ERROR:
        return <ErrorState message={errorMessage} onRetry={handleRetry} />;
      case AppStatus.SUCCESS:
        return (
          <ResultView studySet={studySet} onNewTopic={handleNewTopic} />
        );
      case AppStatus.IDLE:
      default:
        return <EmptyState />;
    }
  }

  return (
    <div className="app">
      <div className="app-container">
        <PromptInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleGenerate}
          isLoading={status === AppStatus.LOADING}
        />
        <main className="app-main">{renderMainContent()}</main>
      </div>
      <footer className="app-footer">
        <p>
          Powered by Gemini AI · Built for learning
        </p>
      </footer>
    </div>
  );
}
