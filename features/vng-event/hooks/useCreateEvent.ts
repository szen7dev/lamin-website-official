'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createEvent } from '@/features/vng-event/api/createEvent';
import { Event, EventUpsertParams } from '@/features/vng-event/types/event';
import { useToast } from '@/hooks/use-toast';

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation<Event, Error, EventUpsertParams>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_EVENT_LIST'] });
      toast({
        title: 'Tạo sự kiện thành công',
        description: 'Hãy tạo thêm phần thu/chi trong danh sách quyên góp',
        variant: 'success',
      });
      router.push('/vng-event/donate-list');
    },
  });

  return {
    createEvent: mutation.mutate,
    createEventAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
