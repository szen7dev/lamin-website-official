import axios from "axios"
import type {
  HeightMeasurementFormData,
  HeightMeasurementResult,
  HeightMeasurementService,
} from "../types/heightMeasurementTypes"

export class HeightMeasurementRealService implements HeightMeasurementService {
  async submitHeightMeasurement(data: HeightMeasurementFormData): Promise<HeightMeasurementResult> {
    const response = await axios.post("/api/height-measurement", data)
    return response.data
  }
}

// Export a singleton instance
export const heightMeasurementRealService = new HeightMeasurementRealService()

