import { useAuthStore } from '@/stores/authStore';
import { useDashboardStats } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Utensils,
  ListTree,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

const StatCard = ({ title, value, icon, description, isLoading, className = '' }: StatCardProps) => {
  return (
    <div className={`hover:shadow-md transition-all duration-200 p-6 bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useDashboardStats();

  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat datang, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ini adalah dashboard admin FoodMart.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pesanan"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          description="Dari pesanan yang selesai"
          isLoading={isLoading}
        />
        <StatCard
          title="Pesanan Pending"
          value={stats?.pendingOrders ?? 0}
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          description="Menunggu diproses"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Pelanggan"
          value={stats?.totalCustomers ?? 0}
          icon={<Users className="h-5 w-5 text-purple-600" />}
          isLoading={isLoading}
        />
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Status Pesanan</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending"
            value={stats?.pendingOrders ?? 0}
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
            isLoading={isLoading}
            className="border-l-4 border-l-yellow-400"
          />
          <StatCard
            title="Processing"
            value={stats?.processingOrders ?? 0}
            icon={<Loader2 className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
            className="border-l-4 border-l-blue-400"
          />
          <StatCard
            title="Completed"
            value={stats?.completedOrders ?? 0}
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            isLoading={isLoading}
            className="border-l-4 border-l-green-400"
          />
          <StatCard
            title="Cancelled"
            value={stats?.cancelledOrders ?? 0}
            icon={<XCircle className="h-5 w-5 text-red-500" />}
            isLoading={isLoading}
            className="border-l-4 border-l-red-400"
          />
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Platform</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Menu"
            value={stats?.totalFoods ?? 0}
            icon={<Utensils className="h-5 w-5 text-orange-500" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Kategori"
            value={stats?.totalCategories ?? 0}
            icon={<ListTree className="h-5 w-5 text-teal-500" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Pelanggan"
            value={stats?.totalCustomers ?? 0}
            icon={<Users className="h-5 w-5 text-purple-500" />}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
