'use client';

import type { CartItem } from '../types/cartTypes';
import type React from 'react';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Keys for React Query
const CART_QUERY_KEY = 'CART';

// Helper functions for localStorage (SSR safe)
const getCartFromStorage = (): { items: CartItem[]; expiry: number } | null => {
  if (typeof window === 'undefined') return null;
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
  if (typeof window === 'undefined') return;
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
  isCartDropdownVisible: boolean;
  showCartDropdown: () => void;
  hideCartDropdown: (delay?: number) => void;
  cartAnimationFlag: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isCartDropdownVisible, setCartDropdownVisible] = useState(false);
  const [cartAnimationFlag, setCartAnimationFlag] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const addItem = useCallback(
    (item: CartItem) => {
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
    },
    [items, updateCartMutation],
  );

  const removeItem = useCallback(
    (id: string) => {
      const newItems = items.filter(item => item.id !== id);

      updateCartMutation.mutate(newItems);
    },
    [items, updateCartMutation],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const validQuantity = Math.max(1, Math.floor(quantity) || 1);
      const newItems = items.map(item =>
        item.id === id ? { ...item, quantity: validQuantity } : item,
      );

      updateCartMutation.mutate(newItems);
    },
    [items, updateCartMutation],
  );

  const updateUnit = useCallback(
    (id: string, unit: string) => {
      const newItems = items.map(item =>
        item.id === id ? { ...item, unit } : item,
      );

      updateCartMutation.mutate(newItems);
    },
    [items, updateCartMutation],
  );

  const clearCart = useCallback(() => {
    updateCartMutation.mutate([]);
  }, [updateCartMutation]);

  const showCartDropdown = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear any existing timeout
    }
    setCartDropdownVisible(true);
    setCartAnimationFlag(true);
  }, []);

  const hideCartDropdown = useCallback((delay: number = 300) => {
    setCartAnimationFlag(false);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setCartDropdownVisible(false);
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      isLoading: updateCartMutation.isPending,
      addItem,
      removeItem,
      updateQuantity,
      updateUnit,
      clearCart,
      isCartDropdownVisible,
      showCartDropdown,
      hideCartDropdown,
      cartAnimationFlag,
    }),
    [
      items,
      totalItems,
      totalPrice,
      updateCartMutation.isPending,
      addItem,
      removeItem,
      updateQuantity,
      updateUnit,
      clearCart,
      isCartDropdownVisible,
      showCartDropdown,
      hideCartDropdown,
      cartAnimationFlag,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
