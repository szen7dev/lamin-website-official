'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

import { useGetCoach } from '@/features/coach-experts/hooks/useGetCoach';
import { apiClient } from '@/services/api/apiClient';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export default function CoachesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [lastestID, setLastestID] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [prevCursorStack, setPrevCursorStack] = useState<string[]>([]);
  const debounceSearch = useRef<NodeJS.Timeout | null>(null);

  const { coaches, pagination, isLoading } = useGetCoach({
    select: 'image name field position',
    limit: 9,
    keyword: submittedSearchTerm,
    lastestID,
    type: 3,
  });

  // Effect to update nextCursor when response changes
  useEffect(() => {
    const cursor = pagination?.nextCursor || '';

    setNextCursor(cursor);
  }, [pagination]);

  useEffect(() => {
    return () => {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
    };
  }, []);

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
    setLastestID('');
    setPrevCursorStack([]); // Reset cursor history on new search
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (debounceSearch.current) {
      clearTimeout(debounceSearch.current);
    }
    debounceSearch.current = setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
      handleSearch();
    }
  };

  // Handle Previous button click
  const handlePrev = () => {
    if (prevCursorStack.length > 0) {
      const previousID = prevCursorStack[prevCursorStack.length - 1];

      setPrevCursorStack(prev => prev.slice(0, -1)); // Remove last cursor from stack
      setLastestID(previousID); // Set lastestID to the popped cursor
    }
  };

  // Handle Next button click
  const handleNext = () => {
    if (nextCursor) {
      setPrevCursorStack(prev => [...prev, lastestID]); // Add current cursor to stack
      setLastestID(nextCursor); // Set lastestID to the next cursor
    }
  };

  return (
    <>
      {/* Search Section */}
      <section className="container mx-auto mb-12">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <button
              aria-label="Tìm kiếm"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-grayscale-40 hover:text-grayscale-60 z-10"
              type="button"
              onClick={handleSearch}>
              <Search className="h-5 w-5" />
            </button>
            <Input
              className="pl-10 py-6 text-base rounded-2xl bg-white"
              placeholder="Tìm kiếm đội ngũ chuyên môn..."
              type="text"
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </section>

      {/* Coaches Grid Section */}
      <section className="container mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-1 bg-primary" />
          <h2 className="text-lg font-semibold text-black">
            Đội ngũ chuyên môn
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="animate-pulse rounded-xl bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="h-4 w-28 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : coaches.length > 0 ? (
          <div className="flex flex-col space-y-6">
            {/* Group coaches into rows of 3 (or fewer for the last row) */}
            {Array.from({ length: Math.ceil(coaches.length / 3) }).map(
              (_, rowIndex) => {
                const startIdx = rowIndex * 3;
                const rowCoaches = coaches.slice(startIdx, startIdx + 3);

                return (
                  <div key={`row-${rowIndex}`} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {rowCoaches.map(coach => {
                        // Get image URL using apiClient.getContactImageUrl
                        const imageUrl = coach.image
                          ? apiClient.getContactImageUrl(coach.image)
                          : '/placeholder.svg';

                        return (
                          <Link
                            key={coach._id}
                            className="block rounded-xl p-6 transition-shadow hover:shadow-md hover:bg-[#F8F9FE] decoration-transparent"
                            href={`/doi-ngu-chuyen-mon/${coach._id}`}>
                            <div className="flex items-center gap-4">
                              <Image
                                alt={coach.name}
                                className="rounded-full object-cover"
                                height={80}
                                src={imageUrl}
                                width={80}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-sm text-[#4A4F63]">
                                  {coach.field &&
                                  typeof coach.field === 'object' &&
                                  'name' in coach.field
                                    ? coach.field.name
                                    : 'Chuyên gia'}
                                </span>
                                <h3 className="text-base font-semibold text-grayscale-90 truncate">
                                  {coach.name}
                                </h3>
                                <span className="text-xs text-primary">
                                  {coach.position?.name || 'Chuyên gia'}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="text-[#4A4F63]">
              Không tìm thấy chuyên gia phù hợp với từ khóa &ldquo;{searchTerm}
              &rdquo;
            </p>
          </div>
        )}
      </section>

      {/* Pagination Section */}
      {(prevCursorStack.length > 0 || nextCursor) && (
        <section className="container mx-auto mb-12 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn({
                    'pointer-events-none opacity-50':
                      prevCursorStack.length === 0,
                  })}
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    handlePrev();
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={cn({
                    'pointer-events-none opacity-50': !nextCursor,
                  })}
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    handleNext();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      )}
    </>
  );
}
