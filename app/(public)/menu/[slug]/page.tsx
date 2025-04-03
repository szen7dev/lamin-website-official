import { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import ProductList from '@/features/product/components/ProductList';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    return generateSeoMetadata({
      title: `Danh sách sản phẩm`,
      description: 'Xem danh sách sản phẩm',
      keywords: ['sản phẩm', 'danh sách', 'sản phẩm'],
    });
  } catch (error) {
    // Fallback metadata if product data can't be fetched
    return generateSeoMetadata({
      title: 'Danh sách sản phẩm',
      description: 'Xem danh sách sản phẩm',
    });
  }
}

export default async function ProductListPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  return <ProductList />;
}
