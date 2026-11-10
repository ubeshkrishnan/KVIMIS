import AsyncStorage from '@react-native-async-storage/async-storage';
export * from './network_helper';

export const getSecurityHeaders = () => {
  return {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  };
};

export const getAuthenticatedHeaders = async () => {
  const token = await AsyncStorage.getItem('api_token');
  const authHeaders = token
    ? {
        'Authorization': `Bearer ${token}`,
        'token': token,
        'Token': token,
        'api-token': token,
        'api_token': token,
      }
    : {};

  return {
    ...getSecurityHeaders(),
    ...authHeaders,
  };
};

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
    return response;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
