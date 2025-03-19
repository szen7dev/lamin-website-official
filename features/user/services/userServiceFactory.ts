import type { UserService } from '../types/userTypes';

import { userMockService } from '../mocks/userMockService';

import { userRealService } from './userService';

import { isMockApi } from '@/config/apiConfig';

export function getUserService(): UserService {
  return isMockApi() ? userMockService : userRealService;
}

// Create and export the service instance
export const userService = getUserService();
