import { create } from 'zustand';
import type { User } from '@/types/api';
import { authApi } from '@/api/auth';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),

  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),

  initAuth: async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data) {
        const currentToken = get().accessToken;
        if (currentToken) {
          get().setAuth(currentToken, response.data);
        }
      }
    } catch {
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
