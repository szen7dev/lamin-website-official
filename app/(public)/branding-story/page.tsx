import type { Metadata } from 'next';

import { Suspense } from 'react';

import BrandingStoryClient from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import Loading from '@/app/loading';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Câu Chuyện Thương Hiệu',
    description:
      'Khám phá hành trình phát triển thương hiệu LaminGrow - Biểu tượng của sự đổi mới trong ngành thực phẩm bảo vệ sức khỏe đại trạng. Từ tâm huyết cá nhân đến sứ mệnh khoa học.',
    keywords: [
      'câu chuyện thương hiệu',
      'LaminGrow',
      'thực phẩm bảo vệ sức khỏe',
      'synbiotic',
      'đại trạng',
      'nghiên cứu khoa học',
      'chất lượng',
    ],
  });
}

export default function BrandStoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BrandingStoryClient />
    </Suspense>
  );
}
