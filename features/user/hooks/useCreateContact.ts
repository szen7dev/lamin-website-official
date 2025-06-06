import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateContactParams } from '../types/userTypes';
import { createContact } from '../api/createContact';

import { useToast } from '@/hooks/use-toast';

export function useCreateContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<any, Error, CreateContactParams>({
    mutationFn: (params: CreateContactParams) => createContact(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
      toast({
        title: 'Thành công',
        description: 'Tạo liên hệ thành công',
        variant: 'success',
      });
    },
    onError: error => {
      console.error('Error creating contact:', error);
      toast({
        title: 'Thất bại',
        description: 'Tạo liên hệ thất bại',
        variant: 'destructive',
      });
    },
  });
}
