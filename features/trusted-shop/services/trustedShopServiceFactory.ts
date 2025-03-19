import type { TrustedShopService } from '../types/trustedShopTypes';

import { trustedShopMockService } from '../mocks/trustedShopMockService';

import { trustedShopRealService } from './trustedShopService';

import { isMockApi } from '@/config/apiConfig';

export function getTrustedShopService(): TrustedShopService {
  return isMockApi() ? trustedShopMockService : trustedShopRealService;
}

// Create and export the service instance
export const trustedShopService = getTrustedShopService();
