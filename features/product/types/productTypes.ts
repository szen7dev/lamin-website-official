export interface ProductImage {
  _id: string;
  path: string;
  size: number;
  alt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  specification?: string;
}

export interface ProductPromotion {
  id: string;
  type: 'discount' | 'gift' | 'other';
  title: string;
  description: string;
  discountPercent?: number;
  validUntil?: string;
}

export interface Product {
  // Core identification fields
  sign: string;
  id?: string;
  _id?: string; // API field
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;

  // Image fields
  images: Array<ProductImage>;
  thumbnail?: string;

  // Classification fields
  code?: string;
  registrationNumber?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  categoryId?: string;

  // Pricing and variant fields
  variants?: ProductVariant[];
  currentVariant?: ProductVariant;

  // API pricing fields
  sellingUnitprice: number;
  listedUnitprice: number;
  unitprice: number;
  unitPrice: number;
  unitPrice2?: number;
  unitPrice3?: number;
  unitPrice4?: number;
  discount?: number;
  discountRate?: number;

  // Origin and manufacturer fields
  brand?: string;
  company?: CompanyInfo;
  origin?: string;
  manufacturer?: string;
  manufacturingCountry?: string;

  // Product details
  specification?: string;
  usage?: string | number;
  ingredients?: string;
  ingredientsDescription?: string;
  storage?: string;
  dosageForm?: string;
  unit?: string;
  unitNote?: string;
  features?: string;
  benefits?: string;
  instructions?: string;
  sideEffects?: string;
  warnings?: string;

  // Status fields
  status?: number;
  inStock?: boolean;

  // Metrics
  rating?: number;
  numberOfRating?: number;
  reviewCount?: number;
  amountComment?: number;
  commentCount?: number;
  rewardPoints?: number;
  quantitySold?: number;

  // Additional fields
  tags?: string[];
  promotions?: ProductPromotion[];
  note?: string;

  // API-specific fields
  fundas?: any[];
  level?: number;
  type?: number;
  subtype?: number;
  size?: number;
  nods?: number;
  amountChilds?: number;
  convertQuantity?: number;
  quantity?: number;
  weight?: number;
  state?: number;
  belongSystem?: number;
  template?: number;
  forCustomer?: number;
  duration?: number;
  userCreate?: string;
  userUpdate?: UserUpdateInfo;
  modifyAt?: string;
  author?: string;
  namecv?: string;
  createAt?: string;
  date?: string;
  __v?: number;
  expired?: string;
}

export interface CompanyInfo {
  _id: string;
  name: string;
  image: string;
}

export interface UserUpdateInfo {
  _id: string;
  image: string;
  fullname: string;
  position: {
    _id: string;
    name: string;
  };
}

export interface ProductListParams {
  category?: string;
  search?: string;
  sort?:
    | 'price-asc'
    | 'price-desc'
    | 'name-asc'
    | 'name-desc'
    | 'rating-asc'
    | 'rating-desc';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductReview {
  id: string;
  rating: number;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
  likes: number;
  verified: boolean;
}

export interface ProductQuestion {
  id: string;
  question: string;
  answer: string;
  author: {
    name: string;
  };
  createdAt: string;
  answered: boolean;
}

export interface ProductService {
  getProducts(params?: ProductListParams): Promise<ProductListResponse>;
  getProductBySlug(slug: string): Promise<Product>;
}

export interface ProductResponse {
  error: boolean;
  data: Product;
  status: number;
}
