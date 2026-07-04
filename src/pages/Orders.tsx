import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ChevronRight } from 'lucide-react';
import { supabase, Order, OrderItem } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/Loading';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { order_items?: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as (Order & { order_items?: OrderItem[] })[]);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="px-4 sm:px-6 pb-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {order.order_items?.slice(0, 4).map((item, i) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-white overflow-hidden"
                    >
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          {item.product_name[0]}
                        </div>
                      )}
                    </div>
                  ))}
                  {order.order_items && order.order_items.length > 4 && (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                      +{order.order_items.length - 4}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  {expandedOrder === order.id ? 'Hide' : 'View'} Details
                  <ChevronRight className={`h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && order.order_items && (
                <div className="border-t border-gray-100 p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-900">
                        {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
