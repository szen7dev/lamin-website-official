'use client';

import type { SearchResult } from '@/features/search/types/searchTypes';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Search } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isVisible) return null;

  // Use searchQuery for the "View All" link if provided, otherwise fall back to query
  const queryForSearch = searchQuery || query;

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Search query header for mobile */}
        <div className="px-4 py-3 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary-40" />
          <span className="text-primary-40 font-medium">{query}</span>
        </div>

        {/* Search results for mobile */}
        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {results.map(result => (
                  <Link
                    key={result.id}
                    className="decoration-transparent flex items-center p-4 hover:bg-gray-50"
                    href={`/product/${result.slug}`}
                    onClick={onClose}>
                    <div className="w-16 h-16 mr-3 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                      {result.image ? (
                        <Image
                          alt={result.name}
                          className="w-full h-full object-contain"
                          height={64}
                          src={result.image}
                          width={64}
                        />
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                        {result.name}
                      </p>
                      {result.price && (
                        <div className="flex items-baseline">
                          <span className="text-base font-semibold text-gray-900">
                            {result.price.toLocaleString()}đ
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /{result.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Link for mobile - now directly after results */}
              <Link
                className="decoration-transparent flex items-center justify-center gap-1 p-4 text-primary-40 font-medium border-t border-gray-100"
                href={`/search?q=${encodeURIComponent(queryForSearch)}`}
                onClick={onClose}>
                Xem tất cả
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view
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
