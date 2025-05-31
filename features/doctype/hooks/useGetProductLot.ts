'use client';

import { useQuery } from '@tanstack/react-query';

import { getProductLot } from '@/features/doctype/api/getProductLot';
import {
  ProductLot,
  ProductLotParams,
} from '@/features/doctype/types/productLot';

export const useGetProductLot = (params: ProductLotParams) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['GET_PRODUCT_LOT', params.sign],
    queryFn: () => getProductLot(params),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.sign,
  });

  return {
    productLot: data || ({} as ProductLot),
    isLoading,
    isError,
    error,
    refetch,
  };
};
