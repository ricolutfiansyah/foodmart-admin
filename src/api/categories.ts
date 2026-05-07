import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

const CATEGORIES_ENDPOINTS = {
  GET_ALL: '/api/v1/categories',
  GET_BY_ID: '/api/v1/categories/:id',
  CREATE: '/api/v1/categories',
  UPDATE: '/api/v1/categories/:id',
  DELETE: '/api/v1/categories/:id',
} as const;

export const categoriesApi = {
  getCategories: async () => {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>(CATEGORIES_ENDPOINTS.GET_ALL);
    return data;
  },
  getCategoryById: async (id: string) => {
    const endpoint = CATEGORIES_ENDPOINTS.GET_BY_ID.replace(":id", id);
    const { data } = await axiosInstance.get<ApiResponse<Category>>(endpoint);
    return data;
  },
  createCategory: async (payload: CreateCategoryInput) => {
    const { data } = await axiosInstance.post<ApiResponse<Category>>(CATEGORIES_ENDPOINTS.CREATE, payload);
    return data;
  },
  updateCategory: async (id: string, payload: UpdateCategoryInput) => {
    const endpoint = CATEGORIES_ENDPOINTS.UPDATE.replace(':id', id);
    const { data } = await axiosInstance.patch<ApiResponse<Category>>(endpoint, payload);
    return data;
  },
  deleteCategory: async (id: string) => {
    const endpoint = CATEGORIES_ENDPOINTS.DELETE.replace(':id', id);
    const { data } = await axiosInstance.delete<ApiResponse<void>>(endpoint);
    return data;
  }
};
