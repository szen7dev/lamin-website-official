'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Article } from '../types/articleTypes';

import { apiClient } from '@/services';
import { ChevronDoubleDown } from '@/components/icons';

interface ArticleTagListProps {
  articlesTags: Article[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  error: any;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ArticleTagList({
  articlesTags,
  isLoading,
  isLoadingMore = false,
  error,
  onLoadMore,
  hasMore = false,
}: ArticleTagListProps) {
  return (
    <>
      {/* Articles List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary-50" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          Không thể tải dữ liệu
        </div>
      ) : articlesTags.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-grayscale-60">
            Không tìm thấy bài viết nào thuộc chủ đề này.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-10 bg-white">
          {articlesTags.map((article, index) => (
            <Link
              key={`${article._id}-${index}`}
              className="block group decoration-transparent"
              href={`/bai-viet/${article.slug}`}>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  {/* Article Image */}
                  <div className="relative h-48 md:h-auto md:w-1/4 p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      {article.thumbnail ? (
                        <Image
                          fill
                          alt={article.title || 'Article thumbnail'}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          src={apiClient.getFileUrl(article.thumbnail.path)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 rounded-lg">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-4 md:p-6 md:w-3/4">
                    {/* Category Tag */}
                    {article.category && (
                      <div className="w-max rounded-full px-3 py-1 text-xs font-medium text-grayscale-40 bg-[#f0f0f0]">
                        {article.category.name}
                      </div>
                    )}
                    <h3 className="mb-2 text-lg font-semibold text-grayscale-90 line-clamp-2 group-hover:text-primary-50">
                      {article.title}
                    </h3>
                    <p className="text-sm text-grayscale-60 line-clamp-3 mb-2">
                      {article.summary || article.description}
                    </p>
                    <div className="flex items-center text-xs text-grayscale-50">
                      {article.createAt && (
                        <span>
                          {new Date(article.createAt).toLocaleDateString(
                            'vi-VN',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center my-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary-50" />
        </div>
      )}

      {/* Load More Button - if needed */}
      {articlesTags.length > 0 && hasMore && !isLoadingMore && (
        <div className="flex justify-center my-8">
          <button
            className="flex items-center justify-between gap-3 px-6 py-2 rounded-full text-grayscale-50 transition-colors hover:text-primary"
            onClick={onLoadMore}>
            <ChevronDoubleDown fill="currentColor" />
            Xem thêm
          </button>
        </div>
      )}
    </>
  );
}
