"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { cartService } from "@/services/cartService"

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

type Cart = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

type CartContextType = {
  cart: Cart
  loading: boolean
  addToCart: (productId: string, quantity: number) => Promise<Cart>
  removeFromCart: (itemId: string) => Promise<Cart>
  updateQuantity: (itemId: string, quantity: number) => Promise<Cart>
  clearCart: () => Promise<Cart>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await cartService.getCart()
        setCart(cartData)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (productId: string, quantity: number) => {
    const updatedCart = await cartService.addToCart(productId, quantity)
    setCart(updatedCart)
    return updatedCart
  }

  const removeFromCart = async (itemId: string) => {
    const updatedCart = await cartService.removeCartItem(itemId)
    setCart(updatedCart)
    return updatedCart
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    const updatedCart = await cartService.updateCartItem(itemId, quantity)
    setCart(updatedCart)
    return updatedCart
  }

  const clearCart = async () => {
    const updatedCart = await cartService.clearCart()
    setCart(updatedCart)
    return updatedCart
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}

