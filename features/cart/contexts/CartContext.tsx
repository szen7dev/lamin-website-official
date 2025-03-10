'use client'

import type React from 'react'

import { createContext, useContext, useState } from 'react'

type CartItem = {
  id: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (id: string) => {
    setItems(prev => [...prev, { id, quantity: 1 }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
