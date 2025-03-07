import { isMockApi } from "@/config/apiConfig"
import { heightMeasurementMockService } from "../mocks/heightMeasurementMockService"
import { heightMeasurementRealService } from "./heightMeasurementService"
import type { HeightMeasurementService } from "../types/heightMeasurementTypes"

export function getHeightMeasurementService(): HeightMeasurementService {
  return isMockApi() ? heightMeasurementMockService : heightMeasurementRealService
}

// Create and export the service instance
export const heightMeasurementService = getHeightMeasurementService()

