import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/Loading';

type DailyStats = {
  date: string;
  orders: number;
  revenue: number;
};

type ProductStats = {
  id: string;
  name: string;
  sold: number;
  revenue: number;
};

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    newCustomers: 0
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
  const [topCategories, setTopCategories] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);

    // Calculate date range
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total stats
    const { data: orders } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', startDate.toISOString());

    const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0;
    const totalOrders = orders?.length || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // New customers
    const { count: newCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    setStats({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      newCustomers: newCustomers || 0
    });

    // Daily stats
    const dailyMap = new Map<string, { orders: number; revenue: number }>();
    orders?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      const current = dailyMap.get(date) || { orders: 0, revenue: 0 };
      dailyMap.set(date, {
        orders: current.orders + 1,
        revenue: current.revenue + order.total
      });
    });

    const dailyData: DailyStats[] = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);

    setDailyStats(dailyData);

    // Top products by order items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, price')
      .gte('created_at', startDate.toISOString());

    const productMap = new Map<string, { name: string; sold: number; revenue: number }>();
    orderItems?.forEach(item => {
      if (!item.product_id) return;
      const current = productMap.get(item.product_id) || {
        name: item.product_name,
        sold: 0,
        revenue: 0
      };
      productMap.set(item.product_id, {
        name: item.product_name,
        sold: current.sold + item.quantity,
        revenue: current.revenue + item.price * item.quantity
      });
    });

    const topProductsData = Array.from(productMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        sold: data.sold,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopProducts(topProductsData);

    setLoading(false);
  };

  const maxRevenue = Math.max(...dailyStats.map(d => d.revenue), 1);
  const maxOrders = Math.max(...dailyStats.map(d => d.orders), 1);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your store's performance</p>
        </div>

        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  12%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  8%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.avgOrderValue.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  15%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.newCustomers}</h3>
              <p className="text-sm text-gray-500">New Customers</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Revenue Over Time</h2>

              <div className="h-64 flex items-end gap-2">
                {dailyStats.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                ) : (
                  dailyStats.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(day.revenue / maxRevenue) * 200}px` }}
                        title={`$${day.revenue.toFixed(2)}`}
                      />
                      <span className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Orders Over Time</h2>

              <div className="h-64 flex items-end gap-2">
                {dailyStats.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                ) : (
                  dailyStats.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(day.orders / maxOrders) * 200}px` }}
                        title={`${day.orders} orders`}
                      />
                      <span className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>

            {topProducts.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 py-3">Product</th>
                      <th className="text-right text-xs font-medium text-gray-500 py-3">Sold</th>
                      <th className="text-right text-xs font-medium text-gray-500 py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((product, i) => (
                      <tr key={product.id}>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-500">
                              {i + 1}
                            </span>
                            <span className="font-medium text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-gray-600">{product.sold}</td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          ${product.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
