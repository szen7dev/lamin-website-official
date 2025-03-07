import axios from "axios"
import type { NutritionCheckFormData, NutritionCheckResult, NutritionCheckService } from "../types/nutritionCheckTypes"

export class NutritionCheckRealService implements NutritionCheckService {
  async submitNutritionCheck(data: NutritionCheckFormData): Promise<NutritionCheckResult> {
    const response = await axios.post("/api/nutrition-check", data)
    return response.data
  }
}

// Export a singleton instance
export const nutritionCheckRealService = new NutritionCheckRealService()

