import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const baseURL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const REFRESH_URL: string = `${baseURL}/api/v1/auth/refresh`;
const AUTH_SKIP_URLS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/logout'
] as const;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint = AUTH_SKIP_URLS.some((url) =>
        originalRequest.url?.includes(url)
      );
      if (isAuthEndpoint) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          REFRESH_URL,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;

        if (!newAccessToken) throw new Error('No access token in response');

        const user = useAuthStore.getState().user;
        if (user) {
          useAuthStore.getState().setAuth(newAccessToken, user);
        } else {
          useAuthStore.setState({ accessToken: newAccessToken });
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
