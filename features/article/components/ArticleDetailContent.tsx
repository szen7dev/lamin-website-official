'use client';

import { notFound, useParams } from 'next/navigation';
import { Check, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useGetArticleDetail, useGetArticleList } from '../hooks';

import TextSizeAdjuster from './TextSizeAdjuster';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';

import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/button';
import { FacebookIcon } from '@/components/icons';
import { apiClient } from '@/services';

export default function ArticleDetailContent() {
  const { slug } = useParams();
  const { article, isLoading, error } = useGetArticleDetail({
    slug: slug as string,
  });
  const {
    articles: articleList,
    isLoading: isLoadingList,
    error: errorList,
  } = useGetArticleList();

  if (isLoading || isLoadingList) {
    return <Skeleton className="h-5 w-full rounded" />;
  }

  if (error || errorList) {
    return <div className="text-red-500">Error fetching article</div>;
  }
  console.log('article', article);

  // If article is not found, redirect to 404 page
  if (!article) {
    notFound();
  }

  // Format date safely
  const formatDateSafely = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateString = date instanceof Date ? date.toISOString() : String(date);

    return formatDate(dateString);
  };

  return (
    <div className="article-detail-content">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Date and Share */}
        <div className="flex items-center gap-4">
          <time
            className="text-[#6C757D]"
            dateTime={
              article?.createAt ? new Date(article.createAt).toISOString() : ''
            }>
            {formatDateSafely(article?.createAt)}
          </time>
          <Button
            className="flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2 text-white hover:bg-[#1877F2]/90"
            size="sm"
            variant="default">
            <FacebookIcon className="h-4 w-4" />
            <span>Chia sẻ</span>
          </Button>
        </div>

        {/* Text Size Controls */}
        <TextSizeAdjuster />
      </div>

      {/* Row 3: Article Excerpt */}
      <blockquote className="mb-8 rounded-lg bg-[#F8F9FA] p-6">
        <div className="flex">
          <Quote className="h-10 w-10 flex-shrink-0 text-primary-20 opacity-40" />
          <p className="ml-4 text-[#6C757D]" itemProp="description">
            {article?.summary || article?.description}
          </p>
        </div>
      </blockquote>

      {/* Row 4: Article Content and Images */}
      <div className="mb-6 sm:mb-8">
        {/* Featured Image */}
        <figure className="mb-4 sm:mb-6 overflow-hidden rounded-lg">
          <div className="relative aspect-[16/9]">
            {article?.thumbnail ? (
              <Image
                fill
                priority
                alt={article.title || 'Thumbnail'}
                className="object-cover"
                itemProp="image"
                sizes="(max-width: 768px) 100vw, 80vw"
                src={apiClient.getFileUrl(article.thumbnail.path)}
              />
            ) : (
              <div className="w-full h-full">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            )}
          </div>
          <figcaption className="mt-1 sm:mt-2 text-center text-xs sm:text-sm text-grayscale-60">
            {article?.caption || 'Lamin mở rộng chi nhánh hoạt động'}
          </figcaption>
        </figure>

        {/* Article Content */}
        <ArticleContent content={article?.content || article?.description} />
      </div>

      {/* Author Info */}
      <footer className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-grayscale-20 bg-white p-6">
        <div className="flex items-center gap-4">
          <Image
            alt="Author"
            className="rounded-full"
            height={48}
            src="/placeholder.svg"
            width={48}
          />
          <div>
            <h3 className="font-medium text-grayscale-90">Lamin Pharmacy</h3>
            <p className="text-sm text-grayscale-60">Biên tập viên</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <Check className="h-4 w-4 text-success-5" />
            <span className="text-success-5">Đã kiểm duyệt nội dung</span>
          </div>
          <p className="text-sm text-grayscale-60">
            Hơn 5 năm kinh nghiệm trong lĩnh vực quản lý nội dung số.
          </p>
        </div>
      </footer>

      {/* Row 6: Tags */}
      {article?.tags && article.tags.length > 0 && (
        <section aria-label="Chủ đề bài viết" className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-grayscale-70">
              Chủ đề:
            </span>
            {article.tags.map((tag: string) => (
              <Link
                key={tag}
                className="decoration-transparent rounded-full bg-grayscale-10 px-2 sm:px-3 py-1 text-xs sm:text-sm text-grayscale-70 hover:bg-grayscale-20"
                href={`/health-news?tag=${tag}`}>
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {articleList && articleList.length > 0 && (
        <aside className="mb-8">
          <RelatedArticles articles={articleList} />
        </aside>
      )}
    </div>
  );
}
