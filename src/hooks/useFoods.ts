import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodsApi } from '@/api/foods';
import type { CreateFoodInput, Food, UpdateFoodInput } from '@/types/food';
import { toast } from 'sonner';
import type { ApiAxiosError, ApiResponse } from '@/types/api';
import { getErrorMessage } from '@/lib/utils';

interface UpdateFoodContext {
  id: string;
  previousFood: Food | null;
}

export const useFoods = (params?: { categoryId?: string; search?: string }) => {
  return useQuery({
    queryKey: ['foods', params],
    queryFn: () => foodsApi.getFoods(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
};

export const useFood = (id: string) => {
  return useQuery({
    queryKey: ['foods', id],
    queryFn: () => foodsApi.getFood(id),
    enabled: !!id,
  });
};

export const useCreateFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodInput) => foodsApi.createFood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
    onError: (error: ApiAxiosError) => {
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFoodInput }) => foodsApi.updateFood(id, data),
    onMutate: async ({ id, data }): Promise<UpdateFoodContext> => {
      await queryClient.cancelQueries({ queryKey: ['foods'] });

      const previousFoods = queryClient.getQueryData<ApiResponse<Food[]>>(['foods']);
      const previousFood = previousFoods?.data?.find((f) => f.id === id);


      queryClient.setQueryData<ApiResponse<Food[]>>(['foods'], (oldData) => {
        if (!oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((food) =>
            food.id === id ? { ...food, ...data } : food
          ),
        };
      });

      return { id, previousFood };
    },
    onError: (error: ApiAxiosError, _, context) => {
      if (context?.previousFood) {
        queryClient.setQueryData<ApiResponse<Food[]>>(['foods'], (oldData) => {
          if (!oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((food) =>
              food.id === context.id ? context.previousFood : food
            )
          };
        });
      }
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    }
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foodsApi.deleteFood(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      queryClient.removeQueries({ queryKey: ['foods', deletedId] });
    },
    onError: (error: ApiAxiosError) => {
      if (error.response?.status === 400 && error.response.data?.errors) {
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });
};
