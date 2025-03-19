import type { MenuService } from '../types/menuTypes';

import { menuMockService } from '../mocks/menuMockService';

import { menuRealService } from './menuService';

import { isMockApi } from '@/config/apiConfig';

export function getMenuService(): MenuService {
  return isMockApi() ? menuMockService : menuRealService;
}

// Create and export the service instance
export const menuService = getMenuService();
