'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { heightMeasurementService } from '../services/heightMeasurementServiceFactory'
import type {
  HeightMeasurementFormData,
  HeightMeasurementResult,
} from '../types/heightMeasurementTypes'

export function useHeightMeasurementMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (formData: HeightMeasurementFormData) =>
      heightMeasurementService.submitHeightMeasurement(formData),
    onSuccess: (data: HeightMeasurementResult) => {
      // Save result to cache
      queryClient.setQueryData(['heightMeasurement', data.id], data)

      router.push(`/height-measurement/results?id=${data.id}`)
    },
  })
}

// Hook to get height measurement result from cache
export function useHeightMeasurementResult(id: string | undefined) {
  const queryClient = useQueryClient()

  if (!id) return null

  // Get data from cache
  return queryClient.getQueryData<HeightMeasurementResult>(['heightMeasurement', id])
}
