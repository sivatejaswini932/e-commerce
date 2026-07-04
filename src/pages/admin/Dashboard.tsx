import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/Loading';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
};

type RecentOrder = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  profiles: { name: string | null } | null;
};

type TopProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Get counts
      const [productsRes, ordersRes, usersRes, pendingRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + o.total, 0) || 0;

      // Get this month's revenue
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: monthlyOrders } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', monthStart.toISOString());

      const monthlyRevenue = monthlyOrders?.reduce((sum, o) => sum + o.total, 0) || 0;

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`id, order_number, status, total, created_at, profiles (name)`)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get top products (by reviews count for now)
      const { data: topProducts } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .order('reviews_count', { ascending: false })
        .limit(5);

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalCustomers: usersRes.count || 0,
        pendingOrders: pendingRes.count || 0,
        totalRevenue,
        monthlyRevenue,
        recentOrders: (recentOrders || []) as RecentOrder[],
        topProducts: (topProducts || []) as TopProduct[]
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      changeType: 'up' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.2%',
      changeType: 'up' as const,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+3',
      changeType: 'up' as const,
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+15.3%',
      changeType: 'up' as const,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          #{order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {order.profiles?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Pending Orders</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Monthly Revenue</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${stats.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Top Products</h2>
              <Link
                to="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {stats.topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No products yet</p>
              ) : (
                stats.topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500">
                      {i + 1}
                    </span>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
