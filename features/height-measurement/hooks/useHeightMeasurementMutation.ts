"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  submitHeightMeasurement,
  type HeightMeasurementFormData,
  type HeightMeasurementResult,
} from "@/services/mockHeightMeasurementService"

export function useHeightMeasurementMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (formData: HeightMeasurementFormData) => submitHeightMeasurement(formData),
    onSuccess: (data: HeightMeasurementResult) => {
      // Lưu kết quả vào cache
      queryClient.setQueryData(["heightMeasurement", data.id], data)

      router.push(`/height-measurement/results?id=${data.id}`)
    },
  })
}

// Hook để lấy kết quả đo cao từ cache
export function useHeightMeasurementResult(id: string | undefined) {
  const queryClient = useQueryClient()

  if (!id) return null

  // Lấy dữ liệu từ cache
  return queryClient.getQueryData<HeightMeasurementResult>(["heightMeasurement", id])
}

