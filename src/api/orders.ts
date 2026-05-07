import { axiosInstance } from './axiosInstance';
import type { GetOrdersParams, UpdateOrderStatusParams, Order } from '@/types/order';
import type { ApiResponse } from '@/types/api';

const ORDERS_ENDPOINTS = {
  GET_ALL: '/api/v1/admin/orders',
  GET_BY_ID: '/api/v1/orders/:id',
  UPDATE_STATUS: '/api/v1/orders/:id/status',
} as const;

export const ordersApi = {
  getOrders: async (params: GetOrdersParams) => {
    const { status, ...rest } = params;

    const queryParams = { ...rest, ...(status && status !== 'ALL' ? { status } : {}) };
    const { data } = await axiosInstance.get<ApiResponse<Order[]>>(ORDERS_ENDPOINTS.GET_ALL, { params: queryParams });
    return data;
  },

  getOrderById: async (id: string) => {
    const endpoint = ORDERS_ENDPOINTS.GET_BY_ID.replace(":id", id);
    const { data } = await axiosInstance.get<ApiResponse<Order>>(endpoint);
    return data;
  },

  updateOrderStatus: async ({ id, status }: UpdateOrderStatusParams) => {
    const endpoint = ORDERS_ENDPOINTS.UPDATE_STATUS.replace(':id', id);
    const { data } = await axiosInstance.patch<ApiResponse<Order>>(endpoint, { status });
    return data;
  }
};
