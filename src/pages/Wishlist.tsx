import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/Loading';

export default function Wishlist() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product: NonNullable<typeof items[0]['products']>) => {
    await addToCart(product);
    await removeFromWishlist(product.id);
  };

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">
            Save your favorite products to view them later.
          </p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
              >
                <Link
                  to={`/product/${item.products?.slug}`}
                  className="block aspect-square bg-gray-100 relative overflow-hidden"
                >
                  {item.products?.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  {item.products?.categories && (
                    <span className="text-xs font-medium text-blue-600">
                      {item.products.categories.name}
                    </span>
                  )}
                  <Link
                    to={`/product/${item.products?.slug}`}
                    className="block mt-1 font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                  >
                    {item.products?.name}
                  </Link>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.products?.price.toFixed(2)}
                    </span>
                    {item.products?.compare_price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.products.compare_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => item.products && handleMoveToCart(item.products)}
                      disabled={!item.products || item.products.stock === 0}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {item.products?.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
