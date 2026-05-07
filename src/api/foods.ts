import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Food, CreateFoodInput, UpdateFoodInput } from '@/types/food';

export const foodsApi = {
  getFoods: async (params?: { categoryId?: string; search?: string }) => {
    const { data } = await axiosInstance.get<ApiResponse<Food[]>>('/api/v1/foods', { params });
    return data
  },

  getFood: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<Food>>(`/api/v1/foods/${id}`);
    return data
  },

  createFood: async (input: CreateFoodInput) => {
    const formData = new FormData();
    formData.append('name', input.name);
    if (input.description) formData.append('description', input.description);
    formData.append('price', String(input.price));
    formData.append('stock', String(input.stock));
    formData.append('isAvailable', input.isAvailable ? 'true' : '');
    formData.append('categoryId', input.categoryId);
    if (input.image) formData.append('image', input.image);

    const { data } = await axiosInstance.post<ApiResponse<Food>>('/api/v1/foods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  updateFood: async (id: string, input: UpdateFoodInput) => {
    const formData = new FormData();
    if (input.name) formData.append('name', input.name);
    if (input.description !== undefined) formData.append('description', input.description);
    if (input.price !== undefined) formData.append('price', String(input.price));
    if (input.stock !== undefined) formData.append('stock', String(input.stock));
    if (input.isAvailable !== undefined) formData.append('isAvailable', input.isAvailable ? 'true' : '');
    if (input.categoryId) formData.append('categoryId', input.categoryId);
    if (input.image) formData.append('image', input.image);

    const { data } = await axiosInstance.patch<ApiResponse<Food>>(`/api/v1/foods/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data;
  },

  deleteFood: async (id: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/api/v1/foods/${id}`)
    return data;
  }
};
