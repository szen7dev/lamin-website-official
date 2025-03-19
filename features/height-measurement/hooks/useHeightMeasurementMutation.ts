'use client';

import type {
  HeightMeasurementFormData,
  HeightMeasurementResult,
} from '../types/heightMeasurementTypes';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { heightMeasurementService } from '../services/heightMeasurementServiceFactory';

// Hook để gửi form đo cao
export function useHeightMeasurementMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: HeightMeasurementFormData) => {
      console.log(
        '🔄 Hook: Submitting height measurement form data:',
        formData,
      );

      return heightMeasurementService.submitHeightMeasurement(formData);
    },

    onSuccess: (data: HeightMeasurementResult) => {
      console.log('✅ Hook: Height measurement submission successful:', data);

      // Lưu kết quả vào cache
      queryClient.setQueryData(['heightMeasurement', data.id], data);
      console.log('💾 Hook: Saved result to cache with key:', [
        'heightMeasurement',
        data.id,
      ]);

      // Chuyển hướng đến trang kết quả
      const resultUrl = `/height-measurement/results?id=${data.id}`;

      console.log('🔀 Hook: Redirecting to:', resultUrl);
      router.push(resultUrl);
    },

    onError: error => {
      console.error('❌ Hook: Height measurement submission error:', error);
    },
  });
}

// Hook để lấy kết quả đo cao từ cache hoặc API
export function useHeightMeasurementResult(id: string | undefined) {
  const queryClient = useQueryClient();

  console.log('🔍 Hook: Getting height measurement result for ID:', id);

  // Kiểm tra cache trước
  const cachedData = queryClient.getQueryData<HeightMeasurementResult>([
    'heightMeasurement',
    id,
  ]);

  if (cachedData) {
    console.log('💾 Hook: Found cached data for ID:', id, cachedData);
  } else {
    console.log('💾 Hook: No cached data found for ID:', id);
  }

  // Sử dụng useQuery để lấy dữ liệu từ API nếu không có trong cache
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['heightMeasurement', id],
    queryFn: () => {
      console.log(
        '🔄 Hook: Fetching height measurement data from API for ID:',
        id,
      );

      return heightMeasurementService.getHeightMeasurementById(id!);
    },
    enabled: !!id, // Chỉ gọi API khi có id
    staleTime: 5 * 60 * 1000, // 5 phút
    initialData: cachedData,
    onSuccess: data => {
      console.log(
        '✅ Hook: Successfully fetched height measurement data:',
        data,
      );
    },
    onError: error => {
      console.error('❌ Hook: Error fetching height measurement data:', error);
    },
  });

  console.log('🔄 Hook: Current height measurement result state:', {
    data,
    isLoading,
    isError,
    error,
    source: cachedData ? 'CACHE' : data ? 'API' : 'NONE',
  });

  return data;
}

// Hook để lấy lịch sử đo cao
export function useHeightMeasurementHistory(contactID: string | undefined) {
  console.log(
    '🔍 Hook: Getting height measurement history for contact:',
    contactID,
  );

  return useQuery({
    queryKey: ['heightMeasurementHistory', contactID],
    queryFn: () => {
      console.log(
        '🔄 Hook: Fetching height measurement history from API for contact:',
        contactID,
      );

      return heightMeasurementService.getHeightMeasurementsByContact(
        contactID!,
      );
    },
    enabled: !!contactID, // Chỉ gọi API khi có contactID
    staleTime: 5 * 60 * 1000, // 5 phút
    onSuccess: data => {
      console.log(
        '✅ Hook: Successfully fetched height measurement history:',
        data,
      );
    },
    onError: error => {
      console.error(
        '❌ Hook: Error fetching height measurement history:',
        error,
      );
    },
  });
}
