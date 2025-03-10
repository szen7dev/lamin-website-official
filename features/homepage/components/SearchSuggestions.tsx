'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  unit: string
}

interface SearchSuggestionsProps {
  query: string
  results: SearchResult[]
  isVisible: boolean
  onClose: () => void
}

export default function SearchSuggestions({
  query,
  results,
  isVisible,
  onClose,
}: SearchSuggestionsProps) {
  if (!isVisible) return null

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-[8px] bg-white shadow-lg">
      {/* Search Query Header */}
      <div className="flex items-center gap-2 border-b border-grayscale-20 p-4">
        <div className="flex items-center justify-center rounded-full">
          <Search className="h-4 w-4 text-primary-5" size={32} />
        </div>
        <span className="text-primary-5">{query}</span>
      </div>

      {/* Search Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {results.map(result => (
          <Link
            key={result.id}
            href={`/products/${result.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-grayscale-5 decoration-transparent"
            onClick={onClose}>
            <Image
              src={result.image || '/placeholder.svg'}
              alt={result.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex flex-col flex-1 items-start justify-between">
              <p className="line-clamp-2 flex-1 text-sm text-grayscale-50">{result.name}</p>
              <div className="whitespace-nowrap text-right">
                <span className="font-semibold text-base text-grayscale-90">
                  {result.price.toLocaleString()}đ
                </span>
                <span className="text-xs font-normal text-grayscale-90">/{result.unit}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        className="flex items-center justify-center gap-1 border-t border-grayscale-20 p-3 text-sm text-primary-5 decoration-transparent"
        onClick={onClose}>
        Xem tất cả
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
