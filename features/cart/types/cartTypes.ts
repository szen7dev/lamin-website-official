export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  originalPrice: number; // Make this optional to avoid the toLocaleString error
  inStockQuantity?: number;
  salesoff?: number;
  quantity: number;
  unit: string;
  image?: string;
  discount?: number;
  slug?: string;
  amount?: number;
}
