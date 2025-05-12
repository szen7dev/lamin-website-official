import { Thumbnail } from '@/types';

/**
 * Simple FileInfo interface to avoid dependency on external module
 */
export interface FileInfo {
  _id: string;
  url?: string;
  name?: string;
  mimetype?: string;
  size?: number;
  path?: string;
}

/**
 * Goods item data structure
 */
export interface Goods {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  variants?: GoodsVariant[];
  currentVariant?: GoodsVariant;
  sign?: string;
  unit?: string;
  sellingUnitprice: number;
  listedUnitprice?: number;
  images?: FileInfo[]; // Can be either FileInfo objects or image URLs/IDs
  category?: any;
  categoryID?: string;
  tags?: string[];
  status: number;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: Thumbnail;
}

export interface GoodsVariant {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  specification?: string;
}

/**
 * Interface for goods list query parameters
 */
export interface GoodsListParams {
  optionSeller?: number;
  usage?: number;
  keyword?: string;
  categoryID?: string;
  limit?: number;
  page?: number;
  status?: number;
  menuSlug?: string;
  lastestID?: string;
}
