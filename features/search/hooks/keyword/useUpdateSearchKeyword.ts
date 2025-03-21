'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSearchKeyword } from '@/features/search/api/search-keyword/updateSearchKeywordList'
import { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient'

/**
 * Hook for updating search keyword popularity
 * @param optionSeller - Option seller ID
 * @returns Object containing update function and loading state
 */
export const useUpdateSearchKeyword = (optionSeller: number = DEFAULT_OPTION_SELLER) => {
  const queryClient = useQueryClient()

  const {
    mutate: updateKeyword,
    isPending,
    error,
  } = useMutation({
    mutationFn: (keyword: string) => updateSearchKeyword(keyword, optionSeller),
    onSuccess: () => {
      // Invalidate the search keywords query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['SEARCH_KEYWORD_LIST', optionSeller] })
    },
  })

  return {
    updateKeyword,
    isUpdating: isPending,
    error,
  }
} 