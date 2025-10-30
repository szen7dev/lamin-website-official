import type { Metadata } from 'next';

import { TestingResultClient } from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Kết quả kiểm nghiệm',
    description:
      'Kết quả kiểm nghiệm chất lượng sản phẩm Lamin - Đảm bảo an toàn và hiệu quả cho sức khỏe của bạn.',
    keywords: [
      'kiểm nghiệm',
      'chứng nhận',
      'chất lượng sản phẩm',
      'lamin',
      'an toàn thực phẩm',
    ],
  });
}

export default function TestingResultPage() {
  return <TestingResultClient />;
}
