import { useContext, createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase, WishlistItem, Product } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

type WishlistContextType = {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user || !supabase) {
      setItems([]);
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          *,
          categories (name, slug)
        )
      `)
      .eq('user_id', user.id);

    if (!fetchError && data) {
      setItems(data as WishlistItem[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product: Product): Promise<boolean> => {
    if (!user) {
      error('Please sign in', 'You need to be signed in to add items to your wishlist');
      return false;
    }

    if (!supabase) {
      error('Connection error', 'Unable to connect to the database');
      return false;
    }

    const { error: insertError } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: product.id
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return true;
      }
      error('Failed to add item', insertError.message);
      return false;
    }

    await fetchWishlist();
    success('Added to wishlist', `${product.name} added to your wishlist`);
    return true;
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user || !supabase) return;

    const item = items.find(i => i.product_id === productId);
    const { error: deleteError } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!deleteError) {
      setItems(items.filter(item => item.product_id !== productId));
      if (item?.products?.name) {
        success('Removed from wishlist', `${item.products.name} removed`);
      }
    }
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
