'use client';

import { useQuery } from '@tanstack/react-query';

import { getBestSellingCombo } from '../../api/combo/getBestSellingCombo';
import { GetSaledComboParams } from '../../types/comboTypes';

/**
 * Custom hook to fetch saled combo products for the homepage
 * @param params Query parameters for the API request
 * @returns Combo products data and loading state
 */
export function useGetBestSellingCombo(params: GetSaledComboParams = {}) {
  const {
    data: combos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_BEST_SELLING_COMBO', params],
    queryFn: () => getBestSellingCombo(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    combos,
    isLoading,
    error,
  };
}
