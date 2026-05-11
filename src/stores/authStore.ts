import { create } from 'zustand';
import type { User } from '@/types/api';
import { authApi } from '@/api/auth';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token, user) => set({ accessToken: token, user, isAuthenticated: true }),

  setAccessToken: (token) => set({ accessToken: token }),

  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),

  initAuth: async () => {
    const hasHint = Cookies.get('auth_hint') === '1';
    if (!hasHint) {
      set({ isLoading: false });
      return;
    }

    try {
      const refreshResponse = await authApi.refresh();
      if (refreshResponse.success && refreshResponse.data?.accessToken) {
        set({ accessToken: refreshResponse.data.accessToken });
      } else {
        throw new Error('Refresh failed');
      }

      // 2. Baru ambil data user dengan token yang valid
      const meResponse = await authApi.getMe();
      if (meResponse.success && meResponse.data) {
        set({ user: meResponse.data, isAuthenticated: true });
      }
    } catch (error) {
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
