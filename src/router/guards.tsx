import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'ADMIN') return <Navigate to="/unauthorized" replace />;
    return <>{children}</>;
};