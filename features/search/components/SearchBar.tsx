'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Search, X } from 'lucide-react';
import Link from 'next/link';
import { router } from 'next/client';

import SearchSuggestions from './SearchSuggestions';

// Import the new hooks
import { useGetSearchKeywordList } from '@/features/search/hooks/keyword/useGetSearchKeywordList';
import { useUpdateSearchKeyword } from '@/features/search/hooks/keyword/useUpdateSearchKeyword';
import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { FileInfo } from '@/features/search/types/goodsTypes';
import apiClient from '@/services/api/apiClient';
import { Button } from '@/components/ui/button';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Get top search keywords
  const { keywords } = useGetSearchKeywordList();

  // Update keyword popularity when user searches
  const { updateKeyword } = useUpdateSearchKeyword();

  // Implement debouncing for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // Get search results when debounced query changes
  const { goodsList, isLoading: isLoadingResults } = useGetGoodsList(
    debouncedQuery ? { keyword: debouncedQuery, limit: 5 } : {},
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      updateKeyword(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  // Handle key press (Enter to search)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        {!query && (
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-grayscale-50" />
        )}
        <input
          className="h-12 w-full rounded-lg border-none bg-white pl-12 pr-20 text-base text-grayscale-90 shadow-sm placeholder:text-grayscale-40 focus:outline-none focus:ring-2 focus:ring-primary-20"
          placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              className="rounded-full p-1 hover:bg-grayscale-10"
              size="sm"
              variant="ghost"
              onClick={() => setQuery('')}>
              <X className="h-5 w-5 text-grayscale-50" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}

          <Button
            className="rounded-full p-2"
            size="sm"
            variant="ghost"
            onClick={() => {}}>
            <Mic className="h-5 w-5 text-primary-40" />
            <span className="sr-only">Voice search</span>
          </Button>
        </div>

        {isLoadingResults && debouncedQuery && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-40 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Top search keywords */}
      {isFocused && !query && keywords.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 font-medium text-grayscale-90">
            Tra cứu hàng đầu
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.slice(0, 8).map(keyword => (
              <Link
                key={keyword.keyword}
                className="rounded-full bg-grayscale-5 px-4 py-2 text-sm text-grayscale-90 hover:bg-grayscale-10"
                href={`/search?q=${encodeURIComponent(keyword.keyword)}`}
                onClick={() => {
                  updateKeyword(keyword.keyword);
                  setIsFocused(false);
                }}>
                {keyword.keyword}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search results suggestions */}
      <SearchSuggestions
        isVisible={isFocused && query.length > 0}
        query={query}
        results={goodsList.map(item => {
          // Safely handle the image URL
          let imageUrl = '';

          if (item.images && item.images.length > 0) {
            if (typeof item.images[0] === 'string') {
              // If image is a string, use apiClient.getFileUrl to ensure valid URL
              imageUrl = apiClient.getFileUrl(item.images[0]);
            } else {
              // If image is an object with path or url property
              const fileInfo = item.images[0] as FileInfo;

              if (fileInfo && fileInfo.path) {
                imageUrl = apiClient.getFileUrl(fileInfo.path);
              } else if (fileInfo && fileInfo.url) {
                imageUrl = apiClient.getFileUrl(fileInfo.url);
              }
            }
          } else if (item.thumbnail) {
            // Some items may have a thumbnail field instead
            imageUrl = apiClient.getFileUrl(item.thumbnail);
          }

          return {
            id: item._id,
            name: item.name,
            price: item.sellingUnitprice,
            image: imageUrl || '/placeholder.svg',
            unit: item.unit || 'Hộp',
            slug: item.slug,
          };
        })}
        searchQuery={debouncedQuery || query}
        onClose={() => setIsFocused(false)}
      />
    </div>
  );
}
