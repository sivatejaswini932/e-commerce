import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail } from 'lucide-react';
import { Order } from '../lib/supabase';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order] = useState<Order | null>(
    (location.state as { order?: Order })?.order || null
  );

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. We'll send you an email confirmation shortly.
        </p>

        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Order #{order.order_number}</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Total</span>
              <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-900">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
          >
            View Order History
          </Link>
          <Link
            to="/products"
            className="w-full py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
