'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useGetNews } from '../hooks/news/useGetNews';

import { apiClient } from '@/services/api/apiClient';
import { NewspaperIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { useGetArticleTagList } from '@/features/article/hooks/useGetArticleTagList';

interface HealthNewsProps {
  haveHeader?: boolean;
  haveSlug?: boolean;
}

export default function HealthNews({
  haveHeader = true,
  haveSlug = false,
}: HealthNewsProps) {
  const { news, isLoading: isNewsLoading } = useGetNews();

  const slug = usePathname()?.replace(/^\/+|\/+$/g, '');
  const { articlesTags, isLoading: isTagLoading } = useGetArticleTagList({
    menuSlug: slug,
    limit: 5,
    option: 1,
  });
  const isLoading = isNewsLoading || isTagLoading;
  const articlesDisplay = haveSlug ? articlesTags : news;

  // Separate main article (first item) from related articles
  const mainArticle =
    articlesDisplay && articlesDisplay.length > 0 ? articlesDisplay[0] : null;
  const relatedArticles =
    articlesDisplay && articlesDisplay.length > 1
      ? articlesDisplay.slice(1)
      : [];

  // Helper function to get image URL
  const getImageUrl = (thumbnail?: { path?: string }) => {
    if (!thumbnail?.path) return '/placeholder.svg';

    return apiClient.getFileUrl(thumbnail.path);
  };

  // Helper function to create article URL
  const getArticleUrl = (article: any) => {
    return article?.slug
      ? `/bai-viet/${article.slug}`
      : '/chuyen-trang-suc-khoe';
  };

  if (isLoading) {
    return (
      <section aria-labelledby="health-news-title" className="animate-pulse">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-6 w-20 rounded bg-gray-200" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="aspect-[16/9] w-full rounded-lg bg-gray-200" />
            <div className="mt-4 h-6 w-32 rounded bg-gray-200" />
            <div className="mt-2 h-8 w-full rounded bg-gray-200" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-24 w-36 rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="mt-2 h-10 w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="health-news-title">
      {haveHeader && (
        <div className="mb-6 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <NewspaperIcon />

            <h2
              className="text-lg font-semibold text-grayscale-90"
              id="health-news-title">
              Góc Sức Khỏe
            </h2>
          </div>
          <div className="h-5">
            <Separator
              className="h-full bg-grayscale-30"
              orientation="vertical"
            />
          </div>
          <Link
            className="flex items-center gap-1 text-primary-40 font-normal text-sm hover:underline decoration-transparent"
            href="/chuyen-trang-suc-khoe">
            Xem thêm
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Article */}
        {mainArticle ? (
          <article className="md:col-span-2 decoration-transparent">
            <Link
              className="decoration-transparent group block"
              href={getArticleUrl(mainArticle)}>
              <figure className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  fill
                  alt={mainArticle.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  src={getImageUrl(mainArticle.thumbnail)}
                />
              </figure>
              <div className="mb-2 flex items-center gap-3">
                {mainArticle.category && (
                  <span className="rounded-full bg-[#f0f0f0] px-2 py-2 text-xs font-medium text-grayscale-40">
                    {mainArticle.category.name}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-grayscale-90 group-hover:text-primary-40">
                {mainArticle.title}
              </h3>
            </Link>
          </article>
        ) : (
          <div className="md:col-span-2">
            <p className="text-grayscale-50">Không có bài viết nào</p>
          </div>
        )}

        {/* Related Articles */}
        <aside className="space-y-4">
          {relatedArticles.length > 0 ? (
            relatedArticles.map(article => (
              <article
                key={article._id}
                className="group decoration-transparent">
                <Link
                  className="decoration-transparent flex gap-3"
                  href={getArticleUrl(article)}>
                  <figure className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      fill
                      alt={article.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="128px"
                      src={getImageUrl(article.thumbnail)}
                    />
                  </figure>
                  <div className="flex-1">
                    {article.category && (
                      <span className="mb-1 inline-block rounded-full bg-[#f0f0f0] px-2 py-1 text-xs font-medium text-grayscale-40">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-grayscale-50">Không có bài viết liên quan</p>
          )}
        </aside>
      </div>
    </section>
  );
}
