"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  submitNutritionCheck,
  type NutritionCheckFormData,
  type NutritionCheckResult,
} from "@/services/mockNutritionCheckService"

export function useNutritionCheckMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (formData: NutritionCheckFormData) => submitNutritionCheck(formData),
    onSuccess: (data: NutritionCheckResult) => {
      // Lưu kết quả vào cache
      queryClient.setQueryData(["nutritionCheck", data.id], data)

      // Chuyển hướng đến trang kết quả
      router.push(`/nutrition-check/results?id=${data.id}`)
    },
  })
}

// Hook để lấy kết quả kiểm tra dinh dưỡng từ cache
export function useNutritionCheckResult(id: string | undefined) {
  const queryClient = useQueryClient()

  if (!id) return null

  // Lấy dữ liệu từ cache
  return queryClient.getQueryData<NutritionCheckResult>(["nutritionCheck", id])
}

