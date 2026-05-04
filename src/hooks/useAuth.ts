import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.getMe();
        if (response.success && response.data) {
          const currentToken = useAuthStore.getState().accessToken;
          if (currentToken) {
            useAuthStore.getState().setAuth(currentToken, response.data);
          }
        }
      } catch {
        useAuthStore.getState().logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return { isLoading };
};
