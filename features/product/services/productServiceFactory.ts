import type { ProductService } from '../types/productTypes';

import { productMockService } from '../mocks/productMockService';

import { productRealService } from './productService';

import { isMockApi } from '@/config/apiConfig';

export function getProductService(): ProductService {
  return isMockApi() ? productMockService : productRealService;
}

// Create and export the service instance
export const productService = getProductService();
