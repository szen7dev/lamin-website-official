'use client';

import { useQuery } from '@tanstack/react-query';

import { getIncomeExpense } from '../api/getIncomeExpense';

export const useGetIncomeExpense = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_INCOME_EXPENSE'],
    queryFn: () => getIncomeExpense(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    incomeExpense: data,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
