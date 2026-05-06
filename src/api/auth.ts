import { axiosInstance } from './axiosInstance';
import type { ApiResponse, AuthResponse, User } from '@/types/api';

const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  getMe: '/api/v1/auth/me',
  logout: '/api/v1/auth/logout',
} as const;

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.login, { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await axiosInstance.get<ApiResponse<User>>(AUTH_ENDPOINTS.getMe);
    return data;
  },
  logout: async () => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(AUTH_ENDPOINTS.logout);
    return data;
  },
};
