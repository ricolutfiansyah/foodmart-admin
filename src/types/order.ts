export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  foodId: string;
  quantity: number;
  priceAtOrder: string;
  food: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalPrice: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus | 'ALL';
  search?: string;
}

export interface UpdateOrderStatusParams {
  id: string;
  status: OrderStatus;
}
