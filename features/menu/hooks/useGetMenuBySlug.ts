'use client';

import { useQuery } from '@tanstack/react-query';

import { getMenuBySlug } from '../api/getMenuBySlug';

/**
 * Hook for fetching detailed goods info by slug
 * @param slug - slug of the goods to fetch
 * @returns Object containing goods info, loading state, and error
 */
export const useGetMenuBySlug = (slug: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_MENU_BY_SLUG', slug],
    queryFn: () => getMenuBySlug({ slug }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug, // Only fetch if slug is provided
  });

  return {
    menuInfo: data,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
