'use client';

import Link from 'next/link';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { useGetDocumentList } from '@/features/documents/hooks/useGetDocumentList';
import { apiClient } from '@/services/api/apiClient';
import Image from 'next/image';

export function TestingResultClient() {
  const { documents, isLoading, error } = useGetDocumentList({
    limit: 10,
    populates: JSON.stringify({
      path: 'files',
      select: 'nameOrg path',
    }),
    select: 'name sign files',
    parentID: '68fb0b489c154000126eec5e',
  });

  return (
    <div className="min-h-screen bg-white pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <DynamicBreadcrumb />

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-grayscale-90">
            Kết quả kiểm nghiệm
          </h1>
          <p className="mt-2 text-sm sm:text-base text-grayscale-60">
            LaminGrow
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="mb-4 h-8 w-64 rounded bg-gray-200" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-full rounded bg-gray-200" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không thể tải tài liệu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        )}

        {/* Documents List */}
        {!isLoading && !error && documents.length > 0 && (
          <div className="space-y-8">
            {documents.map(document => (
              <div key={document._id} className="border-b border-gray-200 pb-6">
                {/* Document Category Header */}
                <div className="mb-4 flex items-center gap-3">
                  {/* Folder Icon */}
                  <svg
                    className="h-6 w-6 text-gray-600 flex-shrink-0"
                    fill="#666"
                    stroke="#666"
                    strokeWidth={2}
                    viewBox="0 0 24 24">
                    <path
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {document.name}
                  </h2>
                </div>

                {/* PDF Files List */}
                {document.files && document.files.length > 0 && (
                  <div className="ml-9 space-y-3">
                    {document.files.map(file => (
                      <Link
                        key={file._id}
                        className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                        href={apiClient.getFileUrl(file.path)}
                        rel="noopener noreferrer"
                        target="_blank">
                        {/* PDF Icon */}
                        <Image
                          alt="PDF"
                          className="w-5 h-5"
                          height={20}
                          src="/images/pdf-icon.png"
                          width={20}
                        />
                        <span className="text-sm group-hover:underline">
                          {file.nameOrg}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có tài liệu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Hiện tại chưa có tài liệu nào.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
