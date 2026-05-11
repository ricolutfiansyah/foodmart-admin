import axios from 'axios';
import { axiosInstance } from './axiosInstance';
import type { ApiResponse, AuthResponse, User } from '@/types/api';
import { API_URL } from '@/constants/config';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  refresh: '/auth/refresh',
  getMe: '/auth/me',
  logout: '/auth/logout',
} as const;

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(`${API_URL}${AUTH_ENDPOINTS.login}`, { email, password });
    return data;
  },
  refresh: async () => {
    const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${API_URL}${AUTH_ENDPOINTS.refresh}`,
      {},
      { withCredentials: true }
    );
    return data;
  },
  getMe: async () => {
    const { data } = await axiosInstance.get<ApiResponse<User>>(`${API_URL}${AUTH_ENDPOINTS.getMe}`);
    return data;
  },
  logout: async () => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(`${API_URL}${AUTH_ENDPOINTS.logout}`);
    return data;
  },
};
