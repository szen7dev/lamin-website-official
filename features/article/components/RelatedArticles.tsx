'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetArticleList } from '../hooks';

import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/services';
import { NewspaperIcon } from '@/components/icons';

export default function RelatedArticles() {
  const {
    articles: articleList,
    isLoading: isLoadingList,
    error: errorList,
  } = useGetArticleList({
    populates: {
      path: 'author category thumbnail userUpdate position tags name',
      select: '_id name fullname image path size note position',
    },
    select: 'category title',
  });

  if (isLoadingList) {
    return <Skeleton className="h-5 w-full rounded" />;
  }

  if (errorList) {
    return <div className="text-red-500">Error fetching articles</div>;
  }

  // Section Header - always shown
  const header = (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded">
        <NewspaperIcon />
      </div>
      <h2 className="text-lg font-semibold text-grayscale-90">
        Các bài viết liên quan
      </h2>
    </div>
  );

  // If loading, show skeleton
  if (isLoadingList) {
    return (
      <div className="space-y-6">
        {header}
        {/* Skeleton Article Cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-lg border border-grayscale-20 bg-white">
              <div className="flex gap-4">
                {/* Skeleton Image */}
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                {/* Skeleton Content */}
                <div className="flex flex-col justify-center py-3 pr-4 flex-grow">
                  <Skeleton className="mb-2 h-6 w-24 rounded-md" />
                  <Skeleton className="h-5 w-full rounded mb-1" />
                  <Skeleton className="h-5 w-3/4 rounded" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // If no articles and not loading
  if (articleList.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <div className="py-4 text-center">
          <p className="text-grayscale-60">Không có bài viết liên quan.</p>
        </div>
      </div>
    );
  }

  // If articles are available
  return (
    <div className="space-y-4">
      {header}
      {/* Article Cards */}
      <div className="space-y-4">
        {articleList.slice(1, 4).map(article => (
          <article
            key={article._id}
            className="overflow-hidden hover:bg-gray-50 rounded-sm py-2">
            <Link
              className="flex justify- gap-6 items-center decoration-transparent"
              href={`/chuyen-trang-suc-khoe/bai-viet/${article.slug}`}>
              {/* Article Image */}
              <div className="relative h-20 w-32 flex-shrink-0 rounded-sm overflow-hidden">
                {article.thumbnail ? (
                  <Image
                    alt={article.title || 'Thumbnail'}
                    className="object-cover h-20 w-32 rounded-sm"
                    height={80}
                    src={apiClient.getFileUrl(article.thumbnail.path)}
                    width={128}
                  />
                ) : (
                  <div className="w-full h-full">
                    <Skeleton className="w-full h-full rounded-sm" />
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="flex flex-col flex-grow justify-between">
                <span className="mb-2 w-max rounded-full bg-grayscale-10 px-2 sm:px-3 py-1 text-xs sm:text-sm text-grayscale-40">
                  {article.category.name}
                </span>
                <h3 className="line-clamp-2 text-base font-medium text-grayscale-90 group-hover:text-primary-40">
                  {article.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
