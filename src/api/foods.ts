import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Food, CreateFoodInput, UpdateFoodInput } from '@/types/food';

export const foodsApi = {
  getFoods: (params?: { categoryId?: string; search?: string }) =>
    axiosInstance.get<ApiResponse<Food[]>>('/api/v1/foods', { params }).then(res => res.data),

  getFood: (id: string) =>
    axiosInstance.get<ApiResponse<Food>>(`/api/v1/foods/${id}`).then(res => res.data),

  createFood: (data: CreateFoodInput) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    formData.append('isAvailable', data.isAvailable ? 'true' : '');
    formData.append('categoryId', data.categoryId);
    if (data.image) formData.append('image', data.image);

    return axiosInstance.post<ApiResponse<Food>>('/api/v1/foods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  updateFood: (id: string, data: UpdateFoodInput) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.stock !== undefined) formData.append('stock', String(data.stock));
    if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable ? 'true' : '');
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    if (data.image) formData.append('image', data.image);

    return axiosInstance.patch<ApiResponse<Food>>(`/api/v1/foods/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  deleteFood: (id: string) =>
    axiosInstance.delete<ApiResponse<void>>(`/api/v1/foods/${id}`).then(res => res.data),
};
