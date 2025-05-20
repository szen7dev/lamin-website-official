'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Article } from '../types/articleTypes';

import { formatDate } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/services';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  isLoading?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'default',
  isLoading = false,
}: ArticleCardProps) {
  // If loading or no article data is provided, show skeleton
  if (isLoading || !article) {
    if (variant === 'featured') {
      return (
        <article className="group relative">
          <div className="relative aspect-[16/9] w-full">
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <Skeleton className="h-7 w-full rounded mb-2" />
            <Skeleton className="h-7 w-3/4 rounded" />
            <div className="mt-2">
              <Skeleton className="h-5 w-full rounded mb-1" />
              <Skeleton className="h-5 w-full rounded mb-1" />
              <Skeleton className="h-5 w-3/4 rounded" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32 rounded" />
            </div>
          </div>
        </article>
      );
    }

    if (variant === 'compact') {
      return (
        <article className="group">
          <div className="decoration-transparent flex gap-4">
            <div className="relative h-20 w-32 flex-shrink-0">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-full rounded mb-1" />
              <Skeleton className="h-5 w-3/4 rounded mb-2" />
              <div className="mt-1 flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </div>
        </article>
      );
    }

    // Default variant skeleton
    return (
      <article className="group">
        <div className="relative aspect-[4/3] w-full">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <Skeleton className="h-6 w-full rounded mb-1" />
          <Skeleton className="h-6 w-3/4 rounded mb-2" />
          <div className="mt-2">
            <Skeleton className="h-4 w-full rounded mb-1" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </article>
    );
  }

  const { title, slug, summary, thumbnail, createAt, description, _id } =
    article;

  // Format date safely
  const formatDateSafely = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateString = date instanceof Date ? date.toISOString() : String(date);

    return formatDate(dateString);
  };

  if (variant === 'featured') {
    return (
      <article className="group relative">
        <Link
          className="decoration-transparent block"
          href={`/bai-viet/${slug}`}>
          <div className="relative aspect-[16/9] w-full">
            {thumbnail ? (
              <Image
                fill
                alt={title ? title : _id}
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={apiClient.getFileUrl(thumbnail.path)}
              />
            ) : (
              <div className="w-full h-full rounded-t-lg">
                <Skeleton className="w-full h-full rounded-t-lg" />
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-3">
              <time className="text-sm text-grayscale-50" dateTime={createAt}>
                {formatDateSafely(createAt)}
              </time>
              <span className="text-sm text-grayscale-50">5 phút đọc</span>
            </div>
            <h3 className="line-clamp-2 text-xl font-semibold text-grayscale-90 group-hover:text-primary-40">
              {title}
            </h3>
            <p className="mt-2 line-clamp-3 text-grayscale-60">
              {summary || description}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group">
        <Link
          className="decoration-transparent flex gap-4"
          href={`/bai-viet/${slug}`}>
          <div className="relative h-20 w-32 flex-shrink-0">
            {thumbnail ? (
              <Image
                fill
                alt={title ? title : _id}
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                src={apiClient.getFileUrl(thumbnail.path)}
              />
            ) : (
              <div className="w-full h-full rounded-lg">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            )}
          </div>
          <div>
            <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-grayscale-50">
              <time dateTime={createAt}>{formatDateSafely(createAt)}</time>
              <span>•</span>
              <span>5 phút đọc</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group">
      <Link className="decoration-transparent block" href={`/bai-viet/${slug}`}>
        <div className="relative aspect-[4/3] w-full">
          {thumbnail ? (
            <Image
              fill
              alt={title ? title : _id}
              className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
              src={apiClient.getFileUrl(thumbnail.path)}
            />
          ) : (
            <div className="w-full h-full rounded-lg">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2">
            <time className="text-xs text-grayscale-50" dateTime={createAt}>
              {formatDateSafely(createAt)}
            </time>
          </div>
          <h3 className="line-clamp-2 font-medium text-grayscale-90 group-hover:text-primary-40">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-grayscale-60">
            {summary || description}
          </p>
        </div>
      </Link>
    </article>
  );
}
