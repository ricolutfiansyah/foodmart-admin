import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Selamat datang, {user?.name || 'Admin'}! 👋
      </h1>
      <p className="text-muted-foreground text-lg">
        Ini adalah dashboard admin FoodMart.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">Rp 0</p>
        </div>
      </div>
    </div>
  );
}
