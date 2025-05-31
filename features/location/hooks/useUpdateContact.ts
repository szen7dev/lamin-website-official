'use client';

import type {
  Coach,
  UpdateContactParams,
} from '@/features/homepage/types/coachTypes';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateLocation } from '@/features/location/api/updateLocation';

/**
 * Hook for updating coach contact/location info by contactID
 * @returns Mutation handler for updating contact
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const {
    mutate: updateContact,
    isPending: isUpdating,
    isError,
    error,
    isSuccess,
    data: updatedCoach,
  } = useMutation<Coach, Error, UpdateContactParams>({
    mutationFn: updateLocation,
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['GET_COACH_DETAIL', data._id] as const,
      });
    },
    onError: err => {
      console.error('Failed to update contact:', err);
    },
  });

  return {
    updateContact,
    isUpdating,
    isError,
    error,
    isSuccess,
    updatedCoach,
  };
};
