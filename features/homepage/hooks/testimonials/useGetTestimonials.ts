'use client';

import type { Article } from '@/features/article/types/articleTypes';

import { useQuery } from '@tanstack/react-query';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

interface TestimonialsParams {
  limit?: number;
  optionSeller?: number;
  type?: number;
}

export function useGetTestimonials(params: TestimonialsParams = {}) {
  const {
    data: testimonials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_TESTIMONIALS', params.type, params.limit],
    queryFn: async () => {
      try {
        const queryParams = {
          limit: params.limit || 6,
          optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
          type: params.type || 2,
          select: 'title slug thumbnail summary createAt',
          populates: JSON.stringify({ path: 'thumbnail', select: 'path' }),
        };

        const response = await apiClient.get<Article[]>(
          '/api/medias',
          queryParams,
        );

        return response.data || [];
      } catch (error) {
        console.error('Error fetching testimonials:', error);

        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    testimonials,
    isLoading,
    error,
  };
}
