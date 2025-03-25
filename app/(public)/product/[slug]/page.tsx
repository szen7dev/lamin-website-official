import { Metadata } from 'next';

import { ProductDetailClient } from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { getGoodsInfoBySlug } from '@/features/product/api/getGoodsInfoBySlug';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  try {
    // Fetch the product data server-side for metadata
    const { slug } = params;

    const productInfo = await getGoodsInfoBySlug(slug);

    return generateSeoMetadata({
      title: `${productInfo.name}`,
      description: productInfo.note
        ? `${productInfo.note.substring(0, 150)}...`
        : 'Thông tin chi tiết về sản phẩm',
      keywords: ['sản phẩm', 'chi tiết', 'sản phẩm', productInfo.name],
    });
  } catch (error) {
    // Fallback metadata if product data can't be fetched
    return generateSeoMetadata({
      title: 'Thông tin sản phẩm',
      description: 'Thông tin chi tiết về sản phẩm',
    });
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // This is a server component that renders the client component
  return <ProductDetailClient params={{ slug: params.slug }} />;
}
