'use client';

import { useQuery } from '@tanstack/react-query';

import { getQuestionList } from '@/features/product/api/getQuestionList';
import { QuestionListParams } from '@/features/product/types/questionTypes';

/**
 * Hook for fetching and managing product questions
 * @param params - Parameters for fetching questions
 * @returns Object containing question list, loading state, and error
 */
export const useGetQuestionList = (params: QuestionListParams) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: [
      'PRODUCT_QUESTIONS',
      params.goodsId,
      params.page,
      params.limit,
      params.cursor,
      params.slug,
    ],
    queryFn: () => getQuestionList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.goodsId, // Only fetch if goodsId is provided
  });

  return {
    questionList: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
