// Types for cart feature
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  itemId: string
  quantity: number
}

export interface CartService {
  getCart(): Promise<Cart>
  addToCart(productId: string, quantity: number): Promise<Cart>
  removeFromCart(itemId: string): Promise<Cart>
  updateCartItem(itemId: string, quantity: number): Promise<Cart>
  clearCart(): Promise<Cart>
}

