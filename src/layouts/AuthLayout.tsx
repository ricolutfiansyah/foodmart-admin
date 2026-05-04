import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">FoodMart Admin</h1>
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
