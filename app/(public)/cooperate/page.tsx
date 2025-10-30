import type { Metadata } from 'next';

import { CooperateClient } from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Cơ hội kinh doanh',
    description:
      'Trở Thành Đại Lý LaminGrow - Thương hiệu Cốm canxi sữa hướng đích xương cao cấp',
    keywords: [
      'đại lý lamin',
      'cơ hội kinh doanh',
      'kinh doanh lamin',
      'trở thành đại lý',
      'đối tác lamin',
    ],
  });
}

export default function CooperatePage() {
  return <CooperateClient />;
}
