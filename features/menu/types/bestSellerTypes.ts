/**
 * Represents a single best seller product
 */
export interface BestSellerItem {
  _id: string;
  name: string;
  sellingUnitprice: number;
  unit: string;
  thumbnail: {
    _id: string;
    path: string;
  };
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

/**
 * Parameters for best seller API requests
 */
export interface BestSellerParams {
  limit?: number;
  optionSeller?: number;
  status?: number;
  page?: number;
  populates?: string | Record<string, any>;
  category?: string;
  [key: string]: any;
}

/**
 * Raw API response structure from the best seller endpoint
 */
export type BestSellerResponse =
  | {
      error: boolean;
      data: {
        listRecords: BestSellerItem[];
        metadata?: {
          totalCount?: number;
          limit?: number;
          page?: number;
          totalPages?: number;
        };
      };
    }
  | {
      error: boolean;
      data: {
        data: {
          listRecords: BestSellerItem[];
          metadata?: {
            totalCount?: number;
            limit?: number;
            page?: number;
            totalPages?: number;
          };
        };
      };
    }
  | {
      error: boolean;
      listRecords: BestSellerItem[];
      metadata?: {
        totalCount?: number;
        limit?: number;
        page?: number;
        totalPages?: number;
      };
    }
  | BestSellerItem[];
