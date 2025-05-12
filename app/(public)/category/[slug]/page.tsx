import { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import ProductList from '@/features/product/components/ProductList';
import { getMenuBySlug } from '@/features/menu/api/getMenuBySlug';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    return generateSeoMetadata({
      title: `Danh sách sản phẩm`,
      description: 'Xem danh sách sản phẩm',
      keywords: ['sản phẩm', 'danh sách'],
    });
  } catch (error) {
    // Fallback metadata if product list can't be fetched
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
  const menuInfo = await getMenuBySlug({ slug });

  return <ProductList menuInfo={menuInfo} params={{ slug }} />;
}
