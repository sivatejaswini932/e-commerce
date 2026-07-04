import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, Eye } from 'lucide-react';
import { supabase, Profile, Order } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/Loading';

type CustomerWithOrders = Profile & {
  orders?: Order[];
  total_spent?: number;
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithOrders | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profiles) {
      const customersWithOrders = await Promise.all(
        profiles.map(async (profile) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', profile.id);

          const totalSpent = orders?.reduce((sum, o) => sum + o.total, 0) || 0;

          return {
            ...profile,
            orders: orders || [],
            total_spent: totalSpent
          };
        })
      );

      setCustomers(customersWithOrders as CustomerWithOrders[]);
    }

    setLoading(false);
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">{customers.length} customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-medium text-gray-600">
                    {(customer.name || customer.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name || 'Unnamed'}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                {customer.is_admin && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{customer.orders?.length || 0}</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    ${customer.total_spent?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-xs text-gray-500">Total Spent</div>
                </div>
              </div>

              {customer.phone && (
                <p className="text-sm text-gray-500 mb-4">{customer.phone}</p>
              )}

              <button
                onClick={() => setSelectedCustomer(customer)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCustomer.name || 'Unnamed Customer'}
                </h2>
                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Order History</h3>
                {selectedCustomer.orders?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.orders?.map(order => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">#{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedCustomer.orders?.length || 0}
                  </div>
                  <div className="text-sm text-blue-700">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedCustomer.total_spent?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-green-700">Total Spent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
