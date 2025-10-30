import type { Metadata } from 'next';

import { Suspense } from 'react';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import Loading from '@/app/loading';
import HealthNews from '@/features/homepage/components/HealthNews';
import ArticleProperty from '@/features/article/components/ArticleProperty';
import ArticleContactList from '@/features/article/components/ArticleContactList';
import { getMenuBySlug } from '@/features/menu/api/getMenuBySlug';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);

  try {
    const menuInfo = await getMenuBySlug({ slug });

    return generateSeoMetadata({
      title: menuInfo.name,
      description: `Cập nhật thông tin về ${menuInfo.name}, dinh dưỡng và lời khuyên từ chuyên gia y tế`,
      keywords: [
        'sức khỏe',
        menuInfo.name,
        'dinh dưỡng',
        'bài viết y tế',
        'lời khuyên sức khỏe',
      ],
    });
  } catch (error) {
    const formattedTag = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return generateSeoMetadata({
      title: formattedTag,
      description: `Cập nhật thông tin về ${formattedTag}`,
      keywords: ['sức khỏe', formattedTag],
    });
  }
}

export default async function DynamicMenuPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  const menuInfo = await getMenuBySlug({ slug });

  return (
    <div className="min-h-screen bg-white pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="mx-auto">
        {/* Breadcrumb */}
        <div className="container">
          <DynamicBreadcrumb />
        </div>

        {/* Featured Articles */}
        <section
          aria-labelledby="featured-articles"
          className="mb-6 sm:mb-10 w-full bg-white py-3">
          <Suspense fallback={<Loading />}>
            {/* Title Section */}
            <header className="mb-6 sm:mb-8 container">
              <h1 className="mb-1 sm:mb-2 text-3xl sm:text-3xl font-semibold text-grayscale-90">
                {menuInfo.name}
              </h1>
            </header>

            <div className="mb-6 sm:mb-8 container">
              <HealthNews haveHeader={false} haveSlug={true} />
            </div>
          </Suspense>
        </section>

        <div className="container grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12">
          {/* Main Content */}
          <section className="md:col-span-8">
            {/* Latest Articles */}
            <section aria-labelledby="latest-articles">
              <Suspense fallback={<Loading />}>
                <ArticleProperty />
              </Suspense>
            </section>
          </section>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            {/* Popular Articles */}
            <section
              aria-labelledby="popular-articles"
              className="mb-6 sm:mb-8 rounded-2xl bg-white shadow-sm border">
              <h2
                className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary p-4 sm:p-6 !pb-0"
                id="popular-articles">
                Đội ngũ chuyên môn
              </h2>
              <div className="w-full my-6 border-t border-gray-200 mt-0 mb-0" />

              <Suspense fallback={<Loading />}>
                <ArticleContactList />
              </Suspense>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
