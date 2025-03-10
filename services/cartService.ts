import api from './api'

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },
  addToCart: async (productId: string, quantity: number) => {
    const response = await api.post('/cart/items', { productId, quantity })
    return response.data
  },
  removeFromCart: async (itemId: string) => {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },
}
