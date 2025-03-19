'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { searchService } from '../services/searchServiceFactory';

import { useDebounce } from '@/hooks/useDebounce';

export function useSearch() {
  const [query, setQuery] = useState('');

  // Debounce the search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchProducts', debouncedQuery],
    queryFn: () => searchService.searchProducts({ query: debouncedQuery }),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const results = data || [];

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    hasResults: results.length > 0,
  };
}
