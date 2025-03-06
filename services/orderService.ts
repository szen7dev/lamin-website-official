import api from "./api"

export const orderService = {
  getOrders: async () => {
    const response = await api.get("/orders")
    return response.data
  },
  getOrderById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  },
  createOrder: async (orderData: any) => {
    const response = await api.post("/orders", orderData)
    return response.data
  },
}

