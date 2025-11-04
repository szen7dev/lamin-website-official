'use client';

import type {
  HeightMeasurementFormData,
  HeightMeasurementResultData,
} from '@/features/height-measurement/types/heightMeasurementTypes';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postHeightMeasurement } from '../api/postHeightMeasurement';

interface HeightMeasurementMutationOptions {
  onSuccess?: (data: HeightMeasurementResultData) => void;
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
        const dataToSubmit: HeightMeasurementFormData = {
          ...formData,
        };

        const result = await postHeightMeasurement(dataToSubmit);

        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },

    onSuccess: (data: HeightMeasurementResultData) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else if (data && data._id) {
        const resultUrl = `/do-cao/ket-qua/${data._id}`;

        router.push(resultUrl);
      } else {
        console.error('Success data is missing _id:', data);
      }
    },

    onError: error => {
      console.error('Height measurement submission error:', error);
    },
  });

  const createHeightMeasurement = (formData: HeightMeasurementFormData) => {
    return mutation.mutate(formData);
  };

  return { createHeightMeasurement, ...mutation };
}
