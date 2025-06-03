'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateEvent } from '@/features/vng-event/api/updateEvent';

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateEventAsync,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_EVENT_LIST'] });
      toast.success('Cập nhật sự kiện thành công');
    },
    onError: () => {
      toast.error('Cập nhật sự kiện thất bại');
    },
  });

  return {
    updateEventAsync,
    isLoading,
    error,
  };
};
