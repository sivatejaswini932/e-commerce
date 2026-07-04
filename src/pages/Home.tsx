import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';
import { supabase, Product, Category } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loading';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!supabase) {
        setLoading(false);
        return;
      }

      const [featuredRes, trendingRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select(`*, categories (name, slug)`)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('products')
          .select(`*, categories (name, slug)`)
          .eq('is_trending', true)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('categories')
          .select('*')
          .order('name')
          .limit(6)
      ]);

      if (featuredRes.data) setFeaturedProducts(featuredRes.data as Product[]);
      if (trendingRes.data) setTrendingProducts(trendingRes.data as Product[]);
      if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: 'Easy Returns',
      description: '30-day hassle-free returns'
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: 'Best Quality',
      description: 'Premium products guaranteed'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Summer Sale Now Live
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Perfect Style
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-lg">
              Explore our curated collection of premium products. From trending essentials to timeless classics, find everything you need.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                Browse Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="mt-1 text-gray-500">Find exactly what you're looking for</p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="aspect-square relative">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-medium text-white">{category.name}</h3>
                </div>
              </Link>
            )) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-1 text-gray-500">Handpicked favorites for you</p>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold">Summer Sale</h2>
            <p className="mt-2 text-blue-100 text-lg">Get up to 50% off on selected items</p>
            <div className="mt-6 flex justify-center items-center gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">15</span>
                <span className="text-sm ml-1">Days</span>
              </div>
              <span className="text-2xl">:</span>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">08</span>
                <span className="text-sm ml-1">Hours</span>
              </div>
              <span className="text-2xl">:</span>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">42</span>
                <span className="text-sm ml-1">Mins</span>
              </div>
            </div>
            <Link
              to="/products?trending=true"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Sale
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              <p className="mt-1 text-gray-500">See what's popular right now</p>
            </div>
            <Link
              to="/products?trending=true"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : trendingProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900">Stay Updated</h2>
            <p className="mt-2 text-gray-500">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            <form className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
