'use client';

import type {
  HeightMeasurementFormData,
  HeightMeasurementResultData,
} from '@/features/height-measurement/types/heightMeasurementTypes';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postHeightMeasurement } from '../api/postHeightMeasurement';

export function useHeightMeasurementMutation() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (
      formData: HeightMeasurementFormData,
    ): Promise<HeightMeasurementResultData> => {
      try {
        console.log('🔄 Hook: Submitting data:', formData);
        const result = await postHeightMeasurement(formData);

        console.log('🔄 Hook: API Response Result:', result);

        return result;
      } catch (error) {
        console.error('🔄 Hook: Error in mutationFn:', error);
        throw error;
      }
    },

    onSuccess: (data: HeightMeasurementResultData) => {
      console.log('🔄 Hook: onSuccess triggered with data:', data);

      if (data && data._id) {
        const resultUrl = `/height-measurement/results/${data._id}`;

        console.log('🔄 Hook: Redirecting to:', resultUrl);
        router.push(resultUrl);
      } else {
        console.error('🔄 Hook: Success data is missing _id:', data);
      }
    },

    onError: error => {
      console.error('❌ Hook: Height measurement submission error:', error);
    },
  });

  const createHeightMeasurement = (formData: HeightMeasurementFormData) => {
    console.log('🔄 Hook: createHeightMeasurement called with:', formData);

    return mutation.mutate(formData);
  };

  return { createHeightMeasurement, ...mutation };
}
