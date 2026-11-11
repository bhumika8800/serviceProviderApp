import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../config/env';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const sentAuthHeader = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && sentAuthHeader) {
      useAuthStore.getState().logout();
    }

    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
      return Promise.reject({
        message: isTimeout
          ? 'The server took too long to respond. Please try again.'
          : 'Unable to reach the server. Check your internet connection and that the backend is running.',
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        status: undefined,
      });
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    const code = error.response?.data?.code;
    const status = error.response?.status;

    return Promise.reject({ message, code, status });
  },
);

export default apiClient;
