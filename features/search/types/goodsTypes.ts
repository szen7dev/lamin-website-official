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
  sign?: string;
  unit?: string;
  sellingUnitprice: number;
  listedUnitprice?: number;
  images?: FileInfo[] | string[]; // Can be either FileInfo objects or image URLs/IDs
  category?: any;
  categoryID?: string;
  tags?: string[];
  status: number;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
}

/**
 * Interface for goods list query parameters
 */
export interface GoodsListParams {
  optionSeller?: number;
  usage?: number;
  keyword?: string; // Used for search functionality
  categoryID?: string;
  limit?: number;
  page?: number;
  status?: number;
}
