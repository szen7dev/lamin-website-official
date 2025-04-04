import { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { getGoodsInfoBySlug } from '@/features/product/api/getGoodsInfoBySlug';
import ProductList from '@/features/product/components/ProductList';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  try {
    // Fetch the product data server-side for metadata
    const resolvedParams = await Promise.resolve(searchParams);

    //Future SEO with search
    return generateSeoMetadata({
      title: 'Tìm kiếm sản phẩm',
      description: 'Tìm kiếm sản phẩm',
      keywords: ['sản phẩm', 'tìm kiếm'],
    });
  } catch (error) {
    // Fallback metadata if product data can't be fetched
    return generateSeoMetadata({
      title: 'Tìm kiếm sản phẩm',
      description: 'Tìm kiếm sản phẩm',
    });
  }
}

export default async function ProductDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await Promise.resolve(searchParams);

  // This is a server component that renders the client component
  return <ProductList searchParams={resolvedParams} />;
}
