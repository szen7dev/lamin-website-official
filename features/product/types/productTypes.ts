// Types for product feature
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  rating: number
  reviewCount: number
}

export interface ProductListParams {
  category?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductService {
  getProducts(params?: ProductListParams): Promise<ProductListResponse>
  getProductBySlug(slug: string): Promise<Product>
}

