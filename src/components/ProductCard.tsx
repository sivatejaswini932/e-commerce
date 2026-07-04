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
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
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
          {product.is_featured && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
              Featured
            </span>
          )}

          {product.is_trending && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-lg shadow ${
            inWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`}
          />
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!user}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg text-sm flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600">
            {product.rating || 5}
          </span>
        </div>

        <div className="mt-3">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price}
          </span>
        </div>
      </div>
    </Link>
  );
}