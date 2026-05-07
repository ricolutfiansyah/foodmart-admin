import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { ordersApi } from '@/api/orders';
import type { GetOrdersParams, UpdateOrderStatusParams } from '@/types/order';

export const useOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderStatusParams) => ordersApi.updateOrderStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error?.response?.data?.message || 'Gagal memperbarui status pesanan';
      toast.error(message);
    },
  });
};