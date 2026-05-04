import { axiosInstance } from './axiosInstance';
import type { ApiResponse, AuthResponse, User } from '@/types/api';

const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  getMe: '/api/v1/auth/me',
  logout: '/api/v1/auth/logout',
} as const;

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await axiosInstance.post(AUTH_ENDPOINTS.login, { email, password });
    return data;
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get(AUTH_ENDPOINTS.getMe);
    return data;
  },
  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post(AUTH_ENDPOINTS.logout);
    return data;
  },
};
