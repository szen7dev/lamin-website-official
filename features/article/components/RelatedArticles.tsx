'use client';

import type { Article } from '../types/articleTypes';

import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/services';

interface RelatedArticlesProps {
  articles?: Article[];
  isLoading?: boolean;
}

export default function RelatedArticles({
  articles = [],
  isLoading = false,
}: RelatedArticlesProps) {
  // Section Header - always shown
  const header = (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-5">
        <FileText className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-grayscale-90">
        Các bài viết liên quan
      </h2>
    </div>
  );

  // If loading, show skeleton
  if (isLoading) {
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
                <div className="relative h-16 w-16 flex-shrink-0">
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
  if (articles.length === 0) {
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
    <div className="space-y-6">
      {header}
      {/* Article Cards */}
      <div className="space-y-4">
        {articles.map(article => (
          <article
            key={article._id}
            className="overflow-hidden rounded-lg border border-grayscale-20 bg-white hover:shadow-md">
            <Link
              className="flex gap-4 decoration-transparent"
              href={`/health-news/article/${article.slug}`}>
              {/* Article Image */}
              <div className="relative h-16 w-16 flex-shrink-0">
                {article.thumbnail ? (
                  <Image
                    fill
                    alt={article.title || 'Thumbnail'}
                    className="object-cover rounded-lg"
                    sizes="64px"
                    src={apiClient.getFileUrl(article.thumbnail.path)}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg">
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                )}
              </div>
              {/* Article Content */}
              <div className="flex flex-col justify-center py-3 pr-4 flex-grow">
                <span className="mb-2 inline-block rounded-md bg-primary-5/10 px-3 py-1 text-sm text-primary-40">
                  Truyền Thông
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
