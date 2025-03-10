'use client'

import type React from 'react'

import { createContext, useState, useEffect } from 'react'

import { cartService } from '@/services/cartService'

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await cartService.getCart()

        setItems(cart.items)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addItem = async (productId: string, quantity: number) => {
    setIsLoading(true)
    try {
      const response = await cartService.addToCart(productId, quantity)

      setItems(response.items)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    setIsLoading(true)
    try {
      const response = await cartService.removeFromCart(itemId)

      setItems(response.items)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true)
    try {
      const response = await cartService.updateCartItem(itemId, quantity)

      setItems(response.items)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      const response = await cartService.clearCart()

      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

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
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  )
}
