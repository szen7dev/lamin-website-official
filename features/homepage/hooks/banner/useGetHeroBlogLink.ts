'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

interface HeroBlogParams {
  categoryID: string;
  limit?: number;
  optionSeller?: number;
  itemIndex?: number; // Which item to get (0 = first, 1 = second, etc.)
}

interface BlogPost {
  _id: string;
  slug: string;
  name?: string;
  title?: string;
}

export function useGetHeroBlogLink(params: HeroBlogParams) {
  const itemIndex = params.itemIndex ?? 0; // Default to first item

  const {
    data: blogSlug,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_HERO_BLOG_LINK', params.categoryID, itemIndex],
    queryFn: async () => {
      try {
        const queryParams = {
          limit: params.limit || 2,
          optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
          categoryID: params.categoryID,
          select: 'slug',
        };

        const response = await apiClient.get<BlogPost[]>(
          '/api/medias',
          queryParams,
        );

        const blogs = response.data || [];

        // Return the slug of the specified blog post by index
        return blogs.length > itemIndex ? blogs[itemIndex].slug : null;
      } catch (error) {
        console.error('Error fetching hero blog link:', error);

        return null;
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    blogSlug,
    isLoading,
    error,
  };
}
