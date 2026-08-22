import type { Metadata } from 'next';

import { Suspense } from 'react';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { getArticleDetail } from '@/features/article/api/getArticleDetail';
import { toArticle } from '@/features/article/api/storeArticles';
import ArticleDetailContent from '@/features/article/components/ArticleDetailContent';
import { apiClient } from '@/services';
import { fetchStorePostDetailOnServer } from '@/lib/s7-store';

// Nguồn mới: s7-data-hub (tính năng #4). Gọi TRỰC TIẾP s7 ở đây (bỏ qua cầu nối `/api/cua-hang/*`): cầu
// nối tồn tại để phục vụ TRÌNH DUYỆT (CORS, giấu địa chỉ backend nội bộ); mã chạy trên server thì vốn đã
// ở phía trong — giống hệt cách `product/[slug]/page.tsx` gọi `fetchStoreProductsOnServer`.
// `null` = gian hàng chưa cấu hình / không có bài này → rơi về nguồn cũ api.trixgo.com.
async function loadArticle(slug: string) {
  const s7 = await fetchStorePostDetailOnServer(slug);
  if (s7) return toArticle(s7);

  return getArticleDetail({ slug });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Ensure params is ready
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  let seoData = {
    title: 'Bài Viết - Góc Sức Khỏe',
    description: 'Bài viết về sức khỏe và dinh dưỡng từ Lamin',
    image: '',
  };

  try {
    const article = await loadArticle(slug);

    if (article) {
      seoData = {
        title: article.title,
        description: article.summary || article.description,
        image: apiClient.getFileUrl(article.thumbnail.path),
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return generateSeoMetadata(seoData);
}

// Skeleton loader for article detail
function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        <DynamicBreadcrumb />

        <section className="mx-auto max-w-3xl">
          <article>
            {/* Title Skeleton */}
            <header className="mb-6 mt-6">
              <Skeleton className="h-10 w-full rounded mb-2" />
              <Skeleton className="h-10 w-3/4 rounded" />
            </header>

            {/* Meta Info Skeleton */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
              <Skeleton className="h-8 w-32 rounded" />
            </div>

            {/* Excerpt Skeleton */}
            <div className="mb-8 rounded-lg bg-[#F8F9FA] p-6">
              <div className="flex">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="ml-4 w-full">
                  <Skeleton className="h-5 w-full rounded mb-2" />
                  <Skeleton className="h-5 w-full rounded mb-2" />
                  <Skeleton className="h-5 w-3/4 rounded" />
                </div>
              </div>
            </div>

            {/* Featured Image Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg">
                <div className="relative aspect-[16/9]">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <Skeleton className="mt-2 h-4 w-1/2 mx-auto rounded" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-2/3 rounded" />
              </div>
            </div>

            {/* Author Info Skeleton */}
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-grayscale-20 bg-white p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 rounded mb-2" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-48 rounded mb-2" />
                <Skeleton className="h-4 w-64 rounded" />
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

// Main page component
export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const article = await loadArticle(slug);

  return (
    <section className="md:py-8">
      <div className="container mx-auto">
        {/* Breadcrumb - Navigation path */}
        <DynamicBreadcrumb name={`${article?.title}`} />
      </div>
      <div className="container mx-auto mb-12">
        <article>
          <Suspense fallback={<ArticleDetailSkeleton />}>
            <ArticleDetailContent article={article} />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
