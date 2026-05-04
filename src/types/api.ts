export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
