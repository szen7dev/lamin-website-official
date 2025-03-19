import type {
  TrustedShopService,
  TrustedShop,
  TrustedShopListParams,
  TrustedShopListResponse,
} from '../types/trustedShopTypes';

import axios from 'axios';

export class TrustedShopRealService implements TrustedShopService {
  async getTrustedShops(
    params?: TrustedShopListParams,
  ): Promise<TrustedShopListResponse> {
    const response = await axios.get('/api/trusted-shops', { params });

    return response.data;
  }

  async getTrustedShopBySlug(slug: string): Promise<TrustedShop> {
    const response = await axios.get(`/api/trusted-shops/${slug}`);

    return response.data;
  }
}

// Export a singleton instance
export const trustedShopRealService = new TrustedShopRealService();
