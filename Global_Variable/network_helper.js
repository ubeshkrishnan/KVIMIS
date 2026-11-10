import { Url } from './api_link';

/**
 * Checks whether an error is a network connectivity failure.
 */
export const isNetworkError = (error) => {
  if (!error) return false;
  const message = error.message || String(error);
  return (
    message.includes('Network request failed') ||
    message.includes('Failed to fetch') ||
    message.includes('Network Error') ||
    message.includes('timeout') ||
    error.name === 'AbortError' ||
    error.name === 'TypeError'
  );
};

/**
 * Basic network connectivity check.
 * Tries a lightweight 204 endpoint or the API URL with a short timeout.
 * Returns true if connected to internet, false otherwise.
 */
export const checkInternetConnection = async (timeoutMs = 3500) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Google generate_204 is the standard lightweight Android/web captive portal check
    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);
    return response.status === 204 || response.ok;
  } catch (err) {
    // If the 204 check fails (e.g. blocked domain), fallback to checking the app's base URL
    try {
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 2500);
      const fallbackResponse = await fetch(Url, {
        method: 'HEAD',
        signal: fallbackController.signal,
      });
      clearTimeout(fallbackTimeout);
      return fallbackResponse.status < 500;
    } catch (fallbackErr) {
      return false;
    }
  }
};

