import type { AuthService } from '../types/authTypes';

import { authRealService } from './authService';

export function getAuthService(): AuthService {
  return authRealService;
}

// Create and export the service instance
export const authService = getAuthService();
