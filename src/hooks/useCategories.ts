import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/category';
import { toast } from 'sonner';
import type { ApiAxiosError } from '@/types/api';

const CATEGORIES_KEY = 'categories' as const;

const getErrorMessage = (error: ApiAxiosError): string => {
  if (!error.response) return 'Koneksi terputus';

  switch (error.response.status) {
    case 401: return 'Sesi habis, silakan login ulang';
    case 403: return 'Anda tidak memiliki akses';
    case 404: return 'Data tidak ditemukan';
    case 409: return 'Data sudah ada';
    case 500: return 'Server sedang bermasalah';
    case 503: return 'Server maintenance';
    default: return error.response.data?.message || 'Terjadi kesalahan';
  }
};

export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: async () => {
      const response = await categoriesApi.getCategories();
      return response.data;
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [CATEGORIES_KEY, id],
    queryFn: async () => {
      const response = await categoriesApi.getCategoryById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error: ApiAxiosError) => {
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error: ApiAxiosError) => {
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      queryClient.removeQueries({ queryKey: [CATEGORIES_KEY, deletedId] });
    },
    onError: (error: ApiAxiosError) => {
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });
};
