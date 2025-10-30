import type { Metadata } from 'next';

import { AllProductsClient } from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Tất cả sản phẩm',
    description:
      'Khám phá tất cả sản phẩm chất lượng cao của Lamin - Giải pháp nâng chiều cao, tăng cường sức khỏe cho cả gia đình.',
    keywords: [
      'sản phẩm lamin',
      'sản phẩm nâng chiều cao',
      'thực phẩm chức năng',
      'dinh dưỡng',
      'sức khỏe',
    ],
  });
}

export default function AllProductsPage() {
  return <AllProductsClient />;
}
