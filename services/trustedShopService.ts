import api from './api'

export const trustedShopService = {
  getTrustedShops: async (params?: any) => {
    const response = await api.get('/trusted-shops', { params })
    return response.data
  },
  getTrustedShopBySlug: async (slug: string) => {
    const response = await api.get(`/trusted-shops/${slug}`)
    return response.data
  },
}
