import AsyncStorage from '@react-native-async-storage/async-storage';
export * from './network_helper';

/**
 * Standard security headers for all HTTP requests.
 */
export const getSecurityHeaders = () => {
  return {
    'Accept': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
  };
};

/**
 * Retrieves stored API token and constructs authentication headers safely.
 */
export const getAuthenticatedHeaders = async () => {
  let token = null;
  try {
    token = await AsyncStorage.getItem('api_token');
  } catch (err) {
    token = null;
  }

  const isValidToken =
    token &&
    typeof token === 'string' &&
    token !== 'null' &&
    token !== 'undefined' &&
    token.trim().length > 0;

  const authHeaders = isValidToken
    ? {
        'Authorization': `Bearer ${token.trim()}`,
        'token': token.trim(),
        'Token': token.trim(),
        'api-token': token.trim(),
        'api_token': token.trim(),
      }
    : {};

  return {
    ...getSecurityHeaders(),
    ...authHeaders,
  };
};

/**
 * Optional handler triggered when any API returns 401 Unauthorized or 403 Forbidden.
 */
let onUnauthorizedCallback = null;
export const setOnUnauthorizedHandler = (callback) => {
  onUnauthorizedCallback = callback;
};

/**
 * Safe logger for development: prevents throwing RedBox errors in React Native.
 */
export const logError = (context, error) => {
  if (__DEV__) {
    console.warn(`[${context}]`, error?.message || error);
  }
};

/**
 * Authenticated fetch with automatic token injection, timeout, and 401 detection.
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = await getAuthenticatedHeaders();
  const timeoutMs = options.timeout || 15000;

  let timeoutId;
  let signal = options.signal;
  if (!signal && typeof AbortController !== 'undefined') {
    const controller = new AbortController();
    signal = controller.signal;
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    // Detect expired token
    if (response && (response.status === 401 || response.status === 403)) {
      if (__DEV__) {
        console.warn(`[Auth 401/403] Session invalid or expired at: ${url}`);
      }
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    return response;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
