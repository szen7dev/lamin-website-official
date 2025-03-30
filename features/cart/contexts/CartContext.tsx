'use client';

import type { CartItem } from '../types/cartTypes';
import type React from 'react';

import { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Keys for React Query
const CART_QUERY_KEY = 'cart';

// Helper functions for localStorage
const getCartFromStorage = (): { items: CartItem[]; expiry: number } | null => {
  try {
    const savedCartData = localStorage.getItem('cart');

    if (!savedCartData) return null;

    const cartData = JSON.parse(savedCartData);

    // Check if the cart data is still valid (not expired)
    if (cartData.expiry && new Date().getTime() < cartData.expiry) {
      return cartData;
    }

    // Clear expired cart data
    localStorage.removeItem('cart');

    return null;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);

    return null;
  }
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    const cartData = {
      items,
      expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 1 day from now
    };

    localStorage.setItem('cart', JSON.stringify(cartData));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateUnit: (id: string, unit: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Use React Query to fetch and cache cart data
  const { data: cartData } = useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: () => {
      const storedData = getCartFromStorage();

      return (
        storedData || {
          items: [],
          expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
        }
      );
    },
    staleTime: 24 * 60 * 60 * 1000, // 1 day
    gcTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const items = cartData?.items || [];

  // Mutations for cart operations
  const updateCartMutation = useMutation({
    mutationFn: async (newItems: CartItem[]) => {
      saveCartToStorage(newItems);

      return {
        items: newItems,
        expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
      };
    },
    onSuccess: result => {
      queryClient.setQueryData([CART_QUERY_KEY], result);
    },
  });

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const addItem = useCallback(
    (item: CartItem) => {
      setIsLoading(true);
      try {
        const validItem = {
          ...item,
          quantity: Math.max(1, Math.floor(item.quantity) || 1),
        };

        const existingItemIndex = items.findIndex(i => i.id === validItem.id);
        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          newItems = [...items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + validItem.quantity,
          };
        } else {
          newItems = [...items, validItem];
        }

        updateCartMutation.mutate(newItems);
      } finally {
        setIsLoading(false);
      }
    },
    [items, updateCartMutation],
  );

  const removeItem = useCallback(
    (id: string) => {
      setIsLoading(true);
      try {
        const newItems = items.filter(item => item.id !== id);

        updateCartMutation.mutate(newItems);
      } finally {
        setIsLoading(false);
      }
    },
    [items, updateCartMutation],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      setIsLoading(true);
      try {
        const validQuantity = Math.max(1, Math.floor(quantity) || 1);
        const newItems = items.map(item =>
          item.id === id ? { ...item, quantity: validQuantity } : item,
        );

        updateCartMutation.mutate(newItems);
      } finally {
        setIsLoading(false);
      }
    },
    [items, updateCartMutation],
  );

  const updateUnit = useCallback(
    (id: string, unit: string) => {
      setIsLoading(true);
      try {
        const newItems = items.map(item =>
          item.id === id ? { ...item, unit } : item,
        );

        updateCartMutation.mutate(newItems);
      } finally {
        setIsLoading(false);
      }
    },
    [items, updateCartMutation],
  );

  const clearCart = useCallback(() => {
    setIsLoading(true);
    try {
      updateCartMutation.mutate([]);
    } finally {
      setIsLoading(false);
    }
  }, [updateCartMutation]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        updateUnit,
        clearCart,
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
