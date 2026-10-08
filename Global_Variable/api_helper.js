import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSecurityHeaders = () => {
  return {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  };
};

export const authenticatedFetch = async (url, options = {}) => {
  const token = await AsyncStorage.getItem('api_token');
  
  const headers = {
    ...getSecurityHeaders(),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
