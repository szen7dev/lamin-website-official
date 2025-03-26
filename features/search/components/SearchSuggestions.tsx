'use client';

import type { SearchResult } from '@/features/search/types/searchTypes';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Search } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

interface SearchSuggestionsProps {
  query: string;
  searchQuery?: string; // The actual query used for search (may differ from display query due to debouncing)
  results: SearchResult[];
  isVisible: boolean;
  onClose: () => void;
}

export default function SearchSuggestions({
  query,
  searchQuery,
  results,
  isVisible,
  onClose,
}: SearchSuggestionsProps) {
  if (!isVisible) return null;

  // Use searchQuery for the "View All" link if provided, otherwise fall back to query
  const queryForSearch = searchQuery || query;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg bg-white shadow-lg">
      {/* Search Query Header */}
      <div className="flex items-center gap-3 border-b border-grayscale-20 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-5/10">
          <Search className="h-4 w-4 text-primary-40" />
        </div>
        <span className="text-primary-50">{query}</span>
      </div>

      {/* Search Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {results.length > 0 ? (
          results.map(result => (
            <Link
              key={result.id}
              className="decoration-transparent flex items-center gap-4 px-4 py-3 transition-colors border-t-2 hover:bg-grayscale-5 hover:no-underline"
              href={{
                pathname: `/product/${result.slug}`,
              }}
              onClick={onClose}>
              <div className="relative h-14 w-24 flex-shrink-0">
                {result.image ? (
                  <Image
                    alt={result.name}
                    className="object-cover rounded-lg"
                    height={100}
                    src={result.image}
                    width={57}
                  />
                ) : (
                  <Skeleton className="h-full w-full rounded-lg" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="line-clamp-2 text-sm font-medium text-grayscale-50">
                  {result.name}
                </p>
                {result.price && (
                  <div className="mt-1">
                    <span className="font-semibold text-base text-grayscale-90">
                      {result.price.toLocaleString()}đ
                    </span>
                    <span className="text-xs text-grayscale-90">
                      /{result.unit}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-grayscale-50">
            Không tìm thấy kết quả phù hợp
          </div>
        )}
      </div>

      {/* View All Link */}
      {results.length > 0 && (
        <Link
          className="decoration-transparent flex items-center justify-center gap-1 border-t border-grayscale-20 p-3 text-sm text-primary-40 hover:bg-grayscale-5"
          href={`/search?q=${encodeURIComponent(queryForSearch)}`}
          onClick={onClose}>
          Xem tất cả
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
