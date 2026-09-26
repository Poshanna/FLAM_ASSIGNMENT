import { validateResult } from './validateResult';

const API_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

let activeAbortController = null;

export async function generateStudySet(input) {
  if (activeAbortController) {
    activeAbortController.abort();
  }

  const abortController = new AbortController();
  activeAbortController = abortController;

  try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
      signal: abortController.signal,
    });

    if (activeAbortController !== abortController) {
      throw new DOMException('Aborted', 'AbortError');
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new ApiError('Could not read server response.', response.status);
    }

    if (!response.ok) {
      const message = data?.error || `Request failed (status ${response.status}).`;
      throw new ApiError(message, response.status);
    }

    const validation = validateResult(data);

    if (!validation.valid) {
      throw new ApiError(
        validation.error || 'Invalid response from server.',
        502
      );
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }

    if (err instanceof ApiError) {
      throw err;
    }

    if (
      typeof err === 'object' &&
      err !== null &&
      err.message === 'Failed to fetch'
    ) {
      throw new ApiError(
        'Cannot connect to server. Please check your connection.',
        0
      );
    }

    throw new ApiError(
      err?.message || 'An unexpected error occurred.',
      0
    );
  } finally {
    if (activeAbortController === abortController) {
      activeAbortController = null;
    }
  }
}

export function cancelActiveRequest() {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
}