'use client';

import { notFound, useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { useGetArticleDetail } from '../hooks';

import TextSizeAdjuster from './TextSizeAdjuster';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';

import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  CalendarIcon,
  CheckIcon,
  FacebookPngIcon,
  QuoteIcon,
} from '@/components/icons';
import { apiClient } from '@/services';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function ArticleDetailContent({ article }: { article: any }) {
  const { slug } = useParams();
  const { isLoading, error } = useGetArticleDetail({
    slug: slug as string,
    populates: {
      path: 'author category thumbnail userUpdate position tags name',
      select: '_id name fullname image path size note position slug',
    },
  });
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (isLoading) {
    return <Skeleton className="h-5 w-full rounded" />;
  }

  if (error) {
    return <div className="text-red-500">Error fetching article</div>;
  }

  // If article is not found, redirect to 404 page
  if (!article) {
    notFound();
  }

  // Format date safely
  const formatDateSafely = (dateInput?: string | Date) => {
    if (!dateInput) return '';

    return formatDate(dateInput);
  };

  const handleShareToFacebook = () => {
    const url = `${window.location.origin}${pathname}`;

    // First copy the URL to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Show toast notification for successful copy
        toast({
          title: 'URL đã được sao chép!',
          description:
            'URL đã được sao chép vào clipboard và mở Facebook để chia sẻ.',
        });

        // Then open Facebook share dialog
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(article?.title || 'Bài viết hay')}`;

        window.open(shareUrl, '_blank', 'width=600,height=400');
      })
      .catch(err => {
        toast({
          title: 'Không thể sao chép URL',
          description:
            'Đã xảy ra lỗi khi sao chép URL, nhưng vẫn mở Facebook để chia sẻ.',
          variant: 'destructive',
        });

        // Still try to open Facebook share dialog even if copy fails
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(article?.title || 'Bài viết hay')}`;

        window.open(shareUrl, '_blank', 'width=600,height=400');
      });
  };

  return (
    <div className="article-detail-content bg-white rounded-2xl px-4 py-6 sm:px-0 sm:py-0">
      <div className="px-6 md:my-6">
        {/* Article Title */}
        <h1 className="mb-4 text-3xl font-medium text-grayscale-90 sm:text-3xl">
          {article?.title}
        </h1>

        {/* Date, Share and Text Size Controls - Responsive layout */}
        <div className="mb-6">
          {/* Mobile View: Date and Text Size Adjuster on one row, Share button below */}
          <div className="block md:hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#6C757D]">
                <CalendarIcon className="h-4 w-4" />
                <time
                  className="text-sm font-medium"
                  dateTime={
                    article?.createAt
                      ? new Date(article.createAt).toISOString()
                      : ''
                  }>
                  {formatDateSafely(article?.createAt)}
                </time>
              </div>
              <TextSizeAdjuster className="scale-90 origin-right" />
            </div>
            <div>
              <Button
                className="flex items-center gap-2 rounded-sm bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                size={'sm'}
                variant="default"
                onClick={handleShareToFacebook}>
                <FacebookPngIcon className="w-[20px] h-[20px]" />
                <span className="text-xs font-medium">Chia sẻ</span>
              </Button>
            </div>
          </div>

          {/* Desktop View: All elements on one row */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#6C757D]">
                <CalendarIcon className="h-4 w-4" />
                <time
                  className="text-sm font-medium"
                  dateTime={
                    article?.createAt
                      ? new Date(article.createAt).toISOString()
                      : ''
                  }>
                  {formatDateSafely(article?.createAt)}
                </time>
              </div>
              <Button
                className="flex items-center gap-2 rounded-sm bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                size={'sm'}
                variant="default"
                onClick={handleShareToFacebook}>
                <FacebookPngIcon className="w-[20px] h-[20px]" />
                <span className="text-xs font-medium">Chia sẻ</span>
              </Button>
            </div>
            <TextSizeAdjuster />
          </div>
        </div>

        {/* Article Summary */}
        <blockquote className="mb-12">
          <div
            className="px-6 py-7 rounded-2xl bg-[#F1F3F5] text-gray-700 relative"
            style={{ boxShadow: '6px 6px 0px 0px #DDE3E9' }}>
            <p className="text-grayscale-90 font-normal text-base">
              {article?.summary || article?.description}
            </p>
            <QuoteIcon className="absolute -top-1 left-5" />
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
              {article?.title}
            </figcaption>
          </figure>

          {/* Article Content */}
          <ArticleContent content={article?.content || article?.description} />
        </div>

        {/* Author Info */}
        <footer className="mb-8 flex flex-col sm:flex-row-reverse items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {article?.userUpdate?.image ? (
              <Image
                alt={article.userUpdate.fullname || 'Author'}
                className="rounded-full"
                height={48}
                src={apiClient.getUserImageUrl(article.userUpdate.image)}
                width={48}
              />
            ) : (
              <Image
                alt="Author"
                className="rounded-full"
                height={48}
                src="/placeholder.svg"
                width={48}
              />
            )}
            <div>
              <h3 className="font-medium text-grayscale-90">
                {article?.userUpdate?.fullname || 'Lamin'}
              </h3>
              {/* <p className="text-sm text-grayscale-60">
                {article?.userUpdate?.position || 'Biên tập viên'}
              </p> */}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-end items-center gap-2 text-sm flex-row-reverse">
              <CheckIcon />
              <em className="text-grayscale-90 text-sm font-normal">
                Đã kiểm duyệt nội dung
              </em>
            </div>
            {/* <em className="text-sm text-grayscale-60">
              {article?.userUpdate?.note ||
                'Hơn 5 năm kinh nghiệm trong lĩnh vực quản lý nội dung số.'}
            </em> */}
          </div>
        </footer>

        <Separator className="my-6" />

        {/* Tags */}
        {article?.tags && article.tags.length > 0 && (
          <section aria-label="Chủ đề bài viết" className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-grayscale-70">
                Chủ đề:
              </span>
              {article.tags.map((tag: any) => (
                <Link
                  key={tag._id || tag}
                  className="decoration-transparent rounded-full bg-grayscale-10 px-2 sm:px-3 py-1 text-xs sm:text-sm text-grayscale-40 hover:bg-grayscale-20"
                  href={`/chu-de/${tag.slug}`}>
                  {tag.name || tag}
                </Link>
              ))}
            </div>
          </section>
        )}

        <Separator className="my-6" />

        {/* Related Articles */}
        <aside className="mb-8">
          <RelatedArticles />
        </aside>
      </div>
    </div>
  );
}
