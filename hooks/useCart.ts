"use client"

import { useState, useEffect } from "react"
import { cartService } from "@/services/cartService"

export function useCart() {
  const [cart, setCart] = useState({ items: [] })
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

  const clearCart = async () => {
    const updatedCart = await cartService.clearCart()
    setCart(updatedCart)
    return updatedCart
  }

  return { cart, loading, addToCart, removeFromCart, clearCart }
}

