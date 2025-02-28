import api from "./api"

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart")
    return response.data
  },
  addToCart: async (productId: string, quantity: number) => {
    const response = await api.post("/cart/items", { productId, quantity })
    return response.data
  },
  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    return response.data
  },
  removeCartItem: async (itemId: string) => {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },
  clearCart: async () => {
    const response = await api.delete("/cart")
    return response.data
  },
}

