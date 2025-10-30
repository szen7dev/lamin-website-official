import { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientArticleTagList } from './client';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import Loading from '@/app/loading';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { getMenuBySlug } from '@/features/menu/api/getMenuBySlug';

// Dynamic metadata generation based on slug
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const menuInfo = await getMenuBySlug({ slug });

  return generateSeoMetadata({
    title: `${menuInfo.name}`,
    description: `Khám phá các bài viết về chủ đề ${menuInfo.name} tại Elela. Cập nhật thông tin mới nhất về sức khỏe và dinh dưỡng.`,
    keywords: ['sức khỏe', menuInfo.name, 'bài viết', 'tư vấn sức khỏe'],
  });
}

export default async function ArticleTagPage({
  params,
}: {
  params: { slug: string };
}) {
  // Access the slug directly from params
  const { slug } = await Promise.resolve(params);
  const menuInfo = await getMenuBySlug({ slug });

  return (
    <section className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        <DynamicBreadcrumb name={menuInfo.name} />

        {/* Article Tag List Component */}
        <Suspense fallback={<Loading />}>
          <ClientArticleTagList slug={slug} />
        </Suspense>
      </div>
    </section>
  );
}
