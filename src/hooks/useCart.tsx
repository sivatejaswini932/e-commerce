import { useContext, createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase, CartItem, Product } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user || !supabase) {
      setItems([]);
      return;
    }

    setLoading(true);
    const { data, err } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          *,
          categories (name, slug)
        )
      `)
      .eq('user_id', user.id);

    if (!err && data) {
      setItems(data as CartItem[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity = 1): Promise<boolean> => {
    if (!user) {
      error('Please sign in', 'You need to be signed in to add items to your cart');
      return false;
    }

    if (!supabase) {
      error('Connection error', 'Unable to connect to the database');
      return false;
    }

    const existingItem = items.find(item => item.product_id === product.id);

    if (existingItem) {
      await updateQuantity(product.id, existingItem.quantity + quantity);
      success('Cart updated', `${product.name} quantity updated`);
    } else {
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity
        });

      if (insertError) {
        error('Failed to add item', insertError.message);
        return false;
      }

      await fetchCart();
      success('Added to cart', `${product.name} added to your cart`);
    }
    return true;
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !supabase) return;

    const item = items.find(i => i.product_id === productId);
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!deleteError) {
      setItems(items.filter(item => item.product_id !== productId));
      if (item?.products?.name) {
        success('Removed from cart', `${item.products.name} removed`);
      }
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user || !supabase) return;

    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!updateError) {
      setItems(items.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const clearCart = async () => {
    if (!user || !supabase) return;

    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (!clearError) {
      setItems([]);
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.products?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
