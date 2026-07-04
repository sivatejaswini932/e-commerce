import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List
} from 'lucide-react';
import { supabase, Product, Category } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loading';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const priceRange = searchParams.get('price') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const isFeatured = searchParams.get('featured') === 'true';
  const isTrending = searchParams.get('trending') === 'true';

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200+' }
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Highest Rated', value: 'rating' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data as Category[]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      if (!supabase) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from('products')
        .select(`*, categories (name, slug)`);

      if (categoryFilter) {
        const category = categories.find(c => c.slug === categoryFilter);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (isFeatured) {
        query = query.eq('is_featured', true);
      }

      if (isTrending) {
        query = query.eq('is_trending', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data) {
        let filteredData = data as Product[];

        if (searchQuery) {
          const search = searchQuery.toLowerCase();
          filteredData = filteredData.filter(
            p =>
              p.name.toLowerCase().includes(search) ||
              p.description?.toLowerCase().includes(search)
          );
        }

        if (priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(Number);
          if (max) {
            filteredData = filteredData.filter(p => p.price >= min && p.price <= max);
          } else {
            filteredData = filteredData.filter(p => p.price >= min);
          }
        }

        switch (sortBy) {
          case 'price-asc':
            filteredData.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredData.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredData.sort((a, b) => b.rating - a.rating);
            break;
        }

        setProducts(filteredData);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [searchQuery, categoryFilter, priceRange, sortBy, isFeatured, isTrending, categories]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [searchQuery, categoryFilter, priceRange !== 'all', isFeatured, isTrending, sortBy !== 'newest'].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isFeatured ? 'Featured Products' : isTrending ? 'Trending Now' : 'All Products'}
          </h1>
          <p className="mt-2 text-gray-500">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', null)}
                    className={`block text-sm ${!categoryFilter ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => updateFilter('category', category.slug)}
                      className={`block text-sm ${categoryFilter === category.slug ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => updateFilter('price', range.value === 'all' ? null : range.value)}
                      className={`block text-sm ${priceRange === range.value ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => updateFilter('featured', e.target.checked ? 'true' : null)}
                      className="rounded text-blue-600"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={e => updateFilter('trending', e.target.checked ? 'true' : null)}
                      className="rounded text-blue-600"
                    />
                    Trending
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => updateFilter('sort', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                    >
                      <Grid3X3 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                    >
                      <List className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                : products.length === 0
                  ? (
                    <div className="col-span-full text-center py-16">
                      <div className="text-gray-400 mb-4">
                        <SlidersHorizontal className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search query.</p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )
                  : products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { updateFilter('category', null); setShowFilters(false); }}
                    className={`block text-sm ${!categoryFilter ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => { updateFilter('category', category.slug); setShowFilters(false); }}
                      className={`block text-sm ${categoryFilter === category.slug ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => { updateFilter('price', range.value === 'all' ? null : range.value); setShowFilters(false); }}
                      className={`block text-sm ${priceRange === range.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-black text-white font-medium rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
