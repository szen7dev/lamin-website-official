'use client';

import type { ProductQuestion } from '../types/productTypes';

import { useQuery } from '@tanstack/react-query';

import { mockQuestions } from '../mocks/productMockData';

// This will be replaced with real API call later
const fetchQuestions = async (
  productId: string,
): Promise<ProductQuestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockQuestions;
};

export function useProductQuestions(productId: string | undefined) {
  return useQuery({
    queryKey: ['productQuestions', productId],
    queryFn: () => fetchQuestions(productId as string),
    enabled: !!productId,
  });
}
