import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import { PublicRoute, PrivateRoute } from './guards';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Placeholder routes for navigation links
      { path: 'categories', element: <div className="p-4">Categories Placeholder</div> },
      { path: 'foods', element: <div className="p-4">Foods Placeholder</div> },
      { path: 'orders', element: <div className="p-4">Orders Placeholder</div> },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
          <p className="text-lg text-gray-700">Akses Ditolak</p>
        </div>
      </div>
    ),
  },
]);
