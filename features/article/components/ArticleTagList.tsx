'use client';

import { useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Article } from '../types/articleTypes';

import { apiClient } from '@/services';

interface ArticleTagListProps {
  articlesTags: Article[];
  isLoading: boolean;
  error: any;
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function ArticleTagList({
  articlesTags,
  isLoading,
  error,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
}: ArticleTagListProps) {
  // Calculate the range of articles being displayed
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  // Ảnh bài viết đi qua bucket Trixgo `trx-main` — đang bị khoá private sau đợt "fix bảo mật" DO Spaces
  // (403 AccessDenied, xem s7-data-hub docs/infra.md §2b, 2026-08-19, chưa chốt phương án sửa tận gốc).
  // `article.thumbnail` vẫn CÓ (bài viết có khai ảnh), chỉ là tải file thật bị chặn — `next/image` không
  // tự thay ảnh vỡ, nên phải tự bắt lỗi tải rồi đổi sang logo Lamin tạm thời. Theo dõi bằng ID bài viết:
  // dùng chung một cờ "ảnh lỗi" cho cả danh sách sẽ ẩn nhầm ảnh đang tải tốt của bài khác.
  const [brokenThumbIds, setBrokenThumbIds] = useState<Set<string>>(new Set());

  const handlePrevious = () => {
    if (hasPrevPage && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

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
                  <div className="relative h-full md:w-1/4 p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      {article.thumbnail && !brokenThumbIds.has(article._id) ? (
                        <Image
                          alt={article.title || 'Article thumbnail'}
                          width={600}
                          height={600}
                          className="object-cover transition-transform duration-300 group-hover:scale-105 aspect-6/4"
                          src={apiClient.getFileUrl(article.thumbnail.path)}
                          onError={() =>
                            setBrokenThumbIds(prev => new Set(prev).add(article._id))
                          }
                        />
                      ) : article.thumbnail ? (
                        // Ảnh thật bị 403 — hiện logo Lamin tạm thay vì icon ảnh vỡ, tới khi bucket Trixgo
                        // mở lại quyền đọc công khai cho ảnh bài viết.
                        <div className="flex h-full w-full items-center justify-center bg-gray-50 rounded-lg p-6">
                          <Image
                            alt=""
                            aria-hidden="true"
                            width={120}
                            height={120}
                            className="object-contain opacity-70"
                            src="/images/Lamin_Logo_Colored.png"
                          />
                        </div>
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

      {/* Pagination Controls */}
      {articlesTags.length > 0 && totalRecords > 0 && (
        <div className="flex items-center justify-between mt-8 mb-4">
          {/* Range Text */}
          <div className="text-sm text-grayscale-60">
            {startIndex}-{endIndex} trong số {totalRecords}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevPage || isLoading}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  hasPrevPage && !isLoading
                    ? 'text-primary-50 hover:bg-primary-50/10 cursor-pointer'
                    : 'text-grayscale-30 cursor-not-allowed'
                }
              `}
              aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
              <span>Trước</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNextPage || isLoading}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  hasNextPage && !isLoading
                    ? 'text-primary-50 hover:bg-primary-50/10 cursor-pointer'
                    : 'text-grayscale-30 cursor-not-allowed'
                }
              `}
              aria-label="Next page">
              <span>Tiếp</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
