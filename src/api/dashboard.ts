import { axiosInstance } from './axiosInstance';
import type { DashboardStats } from '@/types/dashboard';
import type { ApiResponse } from '@/types/api';

const DASHBOARD_ENDPOINTS = {
  GET_STATS: '/api/v1/admin/dashboard-stats',
} as const;

export const dashboardApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get<ApiResponse<DashboardStats>>(DASHBOARD_ENDPOINTS.GET_STATS);
    return data;
  },
};
