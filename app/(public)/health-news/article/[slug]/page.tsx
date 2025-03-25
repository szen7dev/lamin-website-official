import type { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Check, Quote } from 'lucide-react';

import { articleService } from '@/features/article/services/articleServiceFactory';
import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import RelatedArticles from '@/features/article/components/RelatedArticles';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import TextSizeAdjuster from '@/features/article/components/TextSizeAdjuster';
import ArticleContent from '@/features/article/components/ArticleContent';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let seoData = {
    title: 'Bài Viết - Góc Sức Khỏe',
    description: 'Bài viết về sức khỏe và dinh dưỡng từ Elena Pharmacy',
  };

  try {
    const article = await articleService.getArticleBySlug(params.slug);

    if (article) {
      seoData = {
        title: article.title,
        description: article.excerpt,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return generateSeoMetadata(seoData);
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const articleSlug = params.slug;

  // Fetch data on the server
  const article = await articleService.getArticleBySlug(articleSlug);
  const relatedArticles = await articleService.getRelatedArticles(
    articleSlug,
    3,
  );

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb - Navigation path */}
        <DynamicBreadcrumb />

        <main className="mx-auto max-w-3xl">
          <article itemScope itemType="http://schema.org/Article">
            {/* Row 1: Article Title */}
            <header className="mb-6 mt-6">
              <h1
                className="text-2xl sm:text-3xl font-bold text-grayscale-90 leading-tight"
                itemProp="headline">
                {article.title}
              </h1>
              <meta content={article.author.name} itemProp="author" />
              <meta content={article.publishedAt} itemProp="datePublished" />
              {article.updatedAt && (
                <meta content={article.updatedAt} itemProp="dateModified" />
              )}
            </header>

            {/* Row 2: Meta Info and Text Size Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              {/* Date and Share */}
              <div className="flex items-center gap-4">
                <time className="text-[#6C757D]" dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
                <Button
                  className="flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2 text-white hover:bg-[#1877F2]/90"
                  size="sm"
                  variant="default">
                  <Facebook className="h-4 w-4" />
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
                  {article.excerpt}
                </p>
              </div>
            </blockquote>

            {/* Row 4: Article Content and Images */}
            <div className="mb-6 sm:mb-8">
              {/* Featured Image */}
              <figure className="mb-4 sm:mb-6 overflow-hidden rounded-lg">
                <div className="relative aspect-[16/9]">
                  <Image
                    fill
                    priority
                    alt={article.title}
                    className="object-cover"
                    itemProp="image"
                    src={article.thumbnailUrl || '/placeholder.svg'}
                  />
                </div>
                <figcaption className="mt-1 sm:mt-2 text-center text-xs sm:text-sm text-grayscale-60">
                  Elena mở rộng chi nhánh hoạt động
                </figcaption>
              </figure>

              {/* Article Content */}
              <ArticleContent content={article.content} />
            </div>

            {/* Author Info */}
            <footer className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-grayscale-20 bg-white p-6">
              <div className="flex items-center gap-4">
                <Image
                  alt={article.author.name}
                  className="rounded-full"
                  height={48}
                  src={article.author.avatarUrl || '/placeholder.svg'}
                  width={48}
                />
                <div>
                  <h3 className="font-medium text-grayscale-90">
                    {article.author.name}
                  </h3>
                  <p className="text-sm text-grayscale-60">
                    {article.author.role || 'Biên tập viên'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-success-5" />
                  <span className="text-success-5">Đã kiểm duyệt nội dung</span>
                </div>
                <p className="text-sm text-grayscale-60">
                  {article.author.experience ||
                    'Hơn 5 năm kinh nghiệm trong lĩnh vực quản lý nội dung số.'}
                </p>
              </div>
            </footer>

            {/* Row 6: Tags */}
            {article.tags.length > 0 && (
              <section aria-label="Chủ đề bài viết" className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-grayscale-70">
                    Chủ đề:
                  </span>
                  {article.tags.map(tag => (
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
          </article>

          {/* Row 7: Related Articles Section */}
          <section
            aria-labelledby="related-articles-heading"
            className="mt-8 sm:mt-12">
            <h2 className="sr-only" id="related-articles-heading">
              Bài viết liên quan
            </h2>
            <RelatedArticles articles={relatedArticles} />
          </section>
        </main>
      </div>
    </div>
  );
}
