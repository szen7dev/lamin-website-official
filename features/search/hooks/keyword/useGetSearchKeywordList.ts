'use client'

import { useQuery } from '@tanstack/react-query'
import { getSearchKeywordList } from '@/features/search/api/search-keyword/getSearchKeywordList'
import { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient'

/**
 * Hook for fetching search keyword list
 * @param optionSeller - Option seller ID
 * @returns Object containing search keywords and loading state
 */
export const useGetSearchKeywordList = (optionSeller: number = DEFAULT_OPTION_SELLER) => {
  const {
    data: keywords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['SEARCH_KEYWORD_LIST', optionSeller],
    queryFn: () => getSearchKeywordList(optionSeller),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    keywords,
    isLoading,
    error,
  }
}
