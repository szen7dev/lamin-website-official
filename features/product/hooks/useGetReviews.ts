'use client';

import { useQuery } from '@tanstack/react-query';

import { getCommentsByProductID } from '../api/getReviews';
import { ProductReviewParams, ProductReview } from '../types/productTypes';

export function useGetCommentsByProductID(params: ProductReviewParams) {
  return useQuery<ProductReview[]>({
    queryKey: ['productReviews', params.goodsID, params.type],
    queryFn: () => getCommentsByProductID(params),
    enabled: !!params.goodsID,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
