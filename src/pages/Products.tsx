import { useState, useEffect } from 'react';
import { Product, supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.log("Supabase not connected");
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*');

      console.log("DATA =", data);
      console.log("ERROR =", error);

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Products...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="text-gray-600 mt-2">
            {products.length} Products Available
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-2">
              Check your Supabase products table.
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        )}
      </div>
    </div>
  );
}