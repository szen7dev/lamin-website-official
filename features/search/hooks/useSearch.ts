"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { searchService } from "../services/searchServiceFactory"
import type { SearchResult } from "../types/searchTypes"

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Debounce the search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await searchService.searchProducts({ query: debouncedQuery })
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"))
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    hasResults: results.length > 0,
  }
}

