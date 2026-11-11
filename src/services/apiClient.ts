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

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    const code = error.response?.data?.code;
    const status = error.response?.status;

    return Promise.reject({ message, code, status });
  },
);

export default apiClient;
