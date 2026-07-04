import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { supabase, Product, Review } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/Loading';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug || !supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select(`*, categories (id, name, slug)`)
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        setProduct(data as Product);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`*, profiles (name)`)
          .eq('product_id', data.id)
          .order('created_at', { ascending: false });

        if (reviewsData) setReviews(reviewsData as Review[]);

        if (data.category_id) {
          const { data: related } = await supabase
            .from('products')
            .select(`*, categories (name, slug)`)
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4);

          if (related) setRelatedProducts(related as Product[]);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user || !product) return;

    setAddingToCart(true);
    await addToCart(product, quantity);
    setAddingToCart(false);
  };

  const handleWishlist = async () => {
    if (!user || !product) return;

    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? [product.image_url, ...product.images].filter(Boolean)
    : [product.image_url];

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            {product.categories && (
              <>
                <span className="text-gray-400">/</span>
                <Link
                  to={`/products?category=${product.categories.slug}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {product.categories.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage] as string}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    {img && (
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories && (
              <Link
                to={`/products?category=${product.categories.slug}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {product.categories.name}
              </Link>
            )}

            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews_count} reviews)
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.description || 'No description available.'}
            </p>

            <div className="mt-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-12 text-center border-x border-gray-200 text-sm font-medium"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!user || product.stock === 0 || addingToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {addingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleWishlist}
                disabled={!user}
                className={`p-3 rounded-lg border transition-colors ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Free Shipping</span>
                <span className="text-xs text-gray-500">On orders over $50</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Secure Payment</span>
                <span className="text-xs text-gray-500">100% secure</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Easy Returns</span>
                <span className="text-xs text-gray-500">30 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                      {(review.profiles?.name || 'User')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.profiles?.name || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
