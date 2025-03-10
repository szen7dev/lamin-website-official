import axios from "axios"
import type { ProductService, Product, ProductListParams, ProductListResponse } from "../types/productTypes"

export class ProductRealService implements ProductService {
  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const response = await axios.get("/api/products", { params })
    return response.data
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await axios.get(`/api/products/${slug}`)
    return response.data
  }
}

// Export a singleton instance
export const productRealService = new ProductRealService()

