'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postActivateProduct } from '@/features/activate-product/api/postActivateProduct';
import { ActivateProductParams } from '@/features/activate-product/types/activate';
import { useToast } from '@/hooks/use-toast';

interface UsePostActivateProductOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}

export const usePostActivateProduct = (
  options: UsePostActivateProductOptions = {},
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, error, isError, isPending } = useMutation({
    mutationFn: (params: ActivateProductParams) => postActivateProduct(params),
    onSuccess: data => {
      toast({
        title: 'Thành công',
        description: 'Kích hoạt sản phẩm thành công',
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['GET_PRODUCT_LOT', data.sign],
      });
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: error => {
      console.error('Error activating product:', error.message);
      toast({
        title: 'Thất bại',
        description: 'Kích hoạt sản phẩm thất bại',
        variant: 'destructive',
      });
      if (options.onError) {
        options.onError(error);
      }
    },
  });

  return {
    mutate,
    mutateAsync,
    isError,
    isLoading: isPending,
    error,
  };
};
