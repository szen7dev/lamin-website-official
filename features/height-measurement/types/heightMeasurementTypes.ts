// Types for height measurement feature
export interface HeightMeasurementFormData {
  name: string
  birthDate: string
  weight: string
  height: string
  phone: string
  gender: "male" | "female"
}

export interface HeightMeasurementResult {
  id: string
  name: string
  birthDate: string
  weight: string
  height: string
  phone: string
  gender: "male" | "female"
  predictedHeight: number
  growthRate: number
  percentile: number
  analysisDate: string
  coach: string
  recommendations: string[]
  heightData: Array<{ age: number; height: number }>
}

export interface HeightMeasurementService {
  submitHeightMeasurement(data: HeightMeasurementFormData): Promise<HeightMeasurementResult>
}

