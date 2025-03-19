'use client';

import type { Product } from '../types/productTypes';

import { useQuery } from '@tanstack/react-query';

import { mockRelatedProducts } from '../mocks/productMockData';

// This will be replaced with real API call later
const fetchRelatedProducts = async (productId: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockRelatedProducts;
};

export function useRelatedProducts(productId: string | undefined) {
  return useQuery({
    queryKey: ['relatedProducts', productId],
    queryFn: () => fetchRelatedProducts(productId as string),
    enabled: !!productId,
  });
}
