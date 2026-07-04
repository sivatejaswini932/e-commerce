import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await addToCart(product);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
              Featured
            </span>
          )}
          {product.is_trending && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
              Trending
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-lg shadow-md transition-colors ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!user || product.stock === 0}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories && (
          <span className="text-xs font-medium text-blue-600">
            {product.categories.name}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews_count})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compare_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
