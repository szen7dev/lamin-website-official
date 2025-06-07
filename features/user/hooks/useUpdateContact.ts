import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateContactParams } from '../types/userTypes';
import { updateContact } from '../api/updateContact';

import { useToast } from '@/hooks/use-toast';

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<any, Error, UpdateContactParams>({
    mutationFn: (params: UpdateContactParams) => updateContact(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_USER_CONTACT'],
      });
      toast({
        title: 'Thành công',
        description: 'Cập nhật liên hệ thành công',
        variant: 'success',
      });
    },
    onError: error => {
      console.error('Error updating contact:', error);
      toast({
        title: 'Thất bại',
        description: 'Cập nhật liên hệ thất bại',
        variant: 'destructive',
      });
    },
  });
}
