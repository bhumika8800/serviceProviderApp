import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
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
    if (error.response?.status === 401) {
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
