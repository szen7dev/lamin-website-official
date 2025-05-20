'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { Search, Star } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useGetTrustedStore } from '@/features/homepage';
import apiClient from '@/services/api/apiClient';
import { cn } from '@/lib/utils';

export default function StoreList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastestID, setLastestID] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [prevCursorStack, setPrevCursorStack] = useState<string[]>([]);
  const debounceSearch = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 8;

  const { trustedStore, isLoading, response } = useGetTrustedStore({
    populates: {
      path: 'thumbnail area3 area2 area1',
      select: 'path name',
    },
    select: 'name sign location address rating numberOfRating',
    limit: itemsPerPage,
    keyword: submittedSearchTerm,
    lastestID,
    internal: 2,
  });

  useEffect(() => {
    const cursor = response?.data?.nextCursor || response?.nextCursor || '';

    setNextCursor(cursor);
  }, [response]);

  useEffect(() => {
    return () => {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
    };
  }, []);

  const handleSearch = () => {
    setLastestID('');
    setPrevCursorStack([]);
    setSubmittedSearchTerm(searchTerm.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (debounceSearch.current) {
      clearTimeout(debounceSearch.current);
    }
    debounceSearch.current = setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
      handleSearch();
    }
  };

  const handlePrev = () => {
    if (prevCursorStack.length > 0) {
      const previousID = prevCursorStack[prevCursorStack.length - 1];

      setPrevCursorStack(prev => prev.slice(0, -1));
      setLastestID(previousID);
    }
  };

  const handleNext = () => {
    if (nextCursor) {
      setPrevCursorStack(prev => [...prev, lastestID]);
      setLastestID(nextCursor);
    }
  };

  return (
    <>
      {/* Search Section */}
      <section className="container mx-auto mb-12">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center">
            {/* Search Icon Button */}
            <button
              aria-label="Tìm kiếm"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-grayscale-40 hover:text-grayscale-60 z-10"
              type="button"
              onClick={handleSearch}>
              <Search className="h-5 w-5" />
            </button>
            {/* Input field */}
            <Input
              className="pl-10 py-6 text-base rounded-2xl bg-white w-full"
              placeholder="Tìm kiếm các cửa hàng trên toàn quốc..."
              type="text"
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </section>

      {/* Stores Grid Section */}
      <section className="container mx-auto mb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
              <div
                key={item}
                className="animate-pulse rounded-xl bg-white shadow-sm">
                <div className="h-48 rounded-t-xl bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : trustedStore.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trustedStore.map(store => {
              const imageUrl = store.thumbnail?.path
                ? apiClient.getFileUrl(store.thumbnail.path)
                : '/placeholder.svg';

              return (
                <Link
                  key={store._id}
                  className="block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow decoration-transparent"
                  href={`/he-thong-cua-hang/${store._id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      fill
                      alt={store.name}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={imageUrl}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mt-1">
                      <span>
                        <Star className="h-4 w-4 fill-[#FFB200] text-[#FFB200]" />
                      </span>
                      <span className="text-xs font-normal text-grayscale-90">
                        {store.rating?.toFixed(1) || '0.0'}{' '}
                        <span className="text-primary">
                          ({store.numberOfRating || 0} đánh giá)
                        </span>
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-black truncate">
                      {store.name}
                    </h3>
                    <p className="text-xs font-normal text-[#657384] mt-2 line-clamp-1 h-4">
                      {[
                        store.address,
                        store?.area1?.name,
                        store?.area2?.name,
                        store?.area3?.name,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Chưa có địa chỉ'}
                    </p>
                    <div className="mt-4 w-full">
                      <div className="text-center py-2 px-4 bg-primary text-white rounded-md">
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="text-[#4A4F63]">
              Không tìm thấy cửa hàng phù hợp với từ khóa &ldquo;{searchTerm}
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
