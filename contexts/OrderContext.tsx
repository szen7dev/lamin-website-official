'use client';

import type React from 'react';

import { createContext, useContext, useState } from 'react';

/**
 * Type definition for order information that needs to be shared between pages
 */
export interface OrderInfo {
  orderId: string;
  total: number;
  subtotal: number;
  directDiscount: number;
  voucherDiscount: number;
  pointsDiscount: number;
  shippingFee: number;
  savedAmount: number;
  loyaltyPoints: number;
}

type OrderContextType = {
  orderInfo: OrderInfo | null;
  setOrderInfo: (orderInfo: OrderInfo) => void;
  clearOrderInfo: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Provider component for the OrderContext
 */
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orderInfo, setOrderInfoState] = useState<OrderInfo | null>(null);

  // Set order information
  const setOrderInfo = (info: OrderInfo) => {
    setOrderInfoState(info);

    // Optionally store in localStorage for persistence across page refreshes
    try {
      localStorage.setItem('orderInfo', JSON.stringify(info));
    } catch (error) {
      console.error('Failed to save order info to localStorage:', error);
    }
  };

  // Clear order information
  const clearOrderInfo = () => {
    setOrderInfoState(null);
    try {
      localStorage.removeItem('orderInfo');
    } catch (error) {
      console.error('Failed to remove order info from localStorage:', error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orderInfo,
        setOrderInfo,
        clearOrderInfo,
      }}>
      {children}
    </OrderContext.Provider>
  );
}

/**
 * Hook to use the OrderContext
 */
export function useOrder() {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }

  return context;
}
