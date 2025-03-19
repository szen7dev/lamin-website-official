import type { HeightMeasurementService } from '../types/heightMeasurementTypes';

import { heightMeasurementMockService } from '../mocks/heightMeasurementMockService';

import { heightMeasurementRealService } from './heightMeasurementService';

import { isMockApi } from '@/config/apiConfig';

export function getHeightMeasurementService(): HeightMeasurementService {
  const service = isMockApi()
    ? heightMeasurementMockService
    : heightMeasurementRealService;

  console.log(
    `🔧 Height Measurement Service: ${isMockApi() ? 'MOCK' : 'REAL'}`,
  );

  return service;
}

// Tạo và export instance service
export const heightMeasurementService = getHeightMeasurementService();
