'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createFund } from '@/features/vng-event/api/createFund';
import { Fund, FundUpsertParams } from '@/features/vng-event/types/fund';

export const useCreateFund = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Fund, Error, FundUpsertParams>({
    mutationFn: createFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_FUND_LIST'] });
    },
  });

  return {
    createFund: mutation.mutate,
    createFundAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
