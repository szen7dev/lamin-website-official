'use client';

import type {
  HeightMeasurementFormData,
  HeightMeasurementResultData,
} from '@/features/height-measurement/types/heightMeasurementTypes';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postHeightMeasurement } from '../api/postHeightMeasurement';

interface HeightMeasurementMutationOptions {
  contactID?: string;
}

export function useHeightMeasurementMutation(
  options?: HeightMeasurementMutationOptions,
) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (
      formData: HeightMeasurementFormData,
    ): Promise<HeightMeasurementResultData> => {
      try {
        // Add contactID to formData if it exists in options
        const dataToSubmit: HeightMeasurementFormData = {
          ...formData,
        };

        if (options?.contactID) {
          dataToSubmit.contactID = options.contactID;
        }

        const result = await postHeightMeasurement(dataToSubmit);

        return result;
      } catch (error) {
        console.error('🔄 Hook: Error in mutationFn:', error);
        throw error;
      }
    },

    onSuccess: (data: HeightMeasurementResultData) => {
      if (data && data._id) {
        const resultUrl = `/do-cao/ket-qua/${data._id}`;

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
    return mutation.mutate(formData);
  };

  return { createHeightMeasurement, ...mutation };
}
