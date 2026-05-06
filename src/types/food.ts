export interface Food {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imageKey?: string;
  isAvailable: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateFoodInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
  image?: File;
}

export interface UpdateFoodInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isAvailable?: boolean;
  categoryId?: string;
  image?: File;
}