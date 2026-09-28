import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://gdpebackend.vercel.app';
export const API_URL = `${BASE_URL}/api`;
export const TOKEN_STORAGE_KEY = '@gdpe_user_token';
export const USER_STORAGE_KEY = '@gdpe_user_profile';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Accept': 'application/json',
  },
});

// Automatically attach JWT token to every request if present
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Error reading auth token from storage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format and handle errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Prepend backend base URL to relative file paths (e.g. /uploads/image.jpg)
 */
export const getFullImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

export const saveAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getStoredAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
};

export default apiClient;
