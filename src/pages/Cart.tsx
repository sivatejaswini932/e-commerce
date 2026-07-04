import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/Loading';

export default function Cart() {
  const navigate = useNavigate();
  const { items, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Image */}
                      <Link
                        to={`/product/${item.products?.slug}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                      >
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            {item.products?.categories && (
                              <Link
                                to={`/products?category=${item.products.categories.slug}`}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                              >
                                {item.products.categories.name}
                              </Link>
                            )}
                            <Link
                              to={`/product/${item.products?.slug}`}
                              className="block mt-1 font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                            >
                              {item.products?.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={e => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-x border-gray-200 text-sm font-medium"
                            />
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity >= (item.products?.stock || 0)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {item.products?.compare_price && (
                              <div className="text-sm text-gray-400 line-through">
                                ${(item.products.compare_price * item.quantity).toFixed(2)}
                              </div>
                            )}
                            <div className="font-semibold text-gray-900">
                              ${((item.products?.price || 0) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {subtotal >= 50 ? 'Free' : '$5.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    ${(total + (subtotal >= 50 ? 0 : 5.99)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                disabled={loading || items.length === 0}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/products"
                className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
