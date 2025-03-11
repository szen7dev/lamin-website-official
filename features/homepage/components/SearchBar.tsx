'use client'

import { useState, useEffect, useRef } from 'react'

import SearchSuggestions from './SearchSuggestions'

import { useSearch } from '@/features/search/hooks/useSearch'

const CustomCircleX = () => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" fill="#404968" r="10" stroke="#404968" />
    <path d="m15 9-6 6" stroke="white" />
    <path d="m9 9 6 6" stroke="white" />
  </svg>
)

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { query, setQuery, results } = useSearch()

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        {query && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-grayscale-10">
            <CustomCircleX />
          </button>
        )}
      </div>

      <SearchSuggestions
        isVisible={isFocused && query.length > 0}
        query={query}
        results={results}
        onClose={() => setIsFocused(false)}
      />
    </div>
  )
}
