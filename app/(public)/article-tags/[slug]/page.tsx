import { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientArticleTagList } from './client';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import Loading from '@/app/loading';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

// Dynamic metadata generation based on slug
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);

  // Format the slug for display (convert hyphens to spaces and capitalize)
  const formattedTag = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return generateSeoMetadata({
    title: `${formattedTag} - Bài viết sức khỏe`,
    description: `Khám phá các bài viết về chủ đề ${formattedTag} tại Elela. Cập nhật thông tin mới nhất về sức khỏe và dinh dưỡng.`,
    keywords: ['sức khỏe', formattedTag, 'bài viết', 'tư vấn sức khỏe'],
  });
}

export default async function ArticleTagPage({
  params,
}: {
  params: { slug: string };
}) {
  // Access the slug directly from params
  const { slug } = await Promise.resolve(params);

  return (
    <section className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        <DynamicBreadcrumb />

        {/* Article Tag List Component */}
        <Suspense fallback={<Loading />}>
          <ClientArticleTagList slug={slug} />
        </Suspense>
      </div>
    </section>
  );
}
