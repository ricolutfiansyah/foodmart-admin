import { useAuth } from './hooks/useAuth';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function AppInitializer() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <RouterProvider router={router} />;
}