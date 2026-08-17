import { Metadata } from 'next';

import { ProductDetailClient } from './client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { getGoodsInfoBySlug } from '@/features/product/api/getGoodsInfoBySlug';
import { slugify } from '@/features/product/api/storeCatalog';
import { fetchStoreProductsOnServer } from '@/lib/s7-store';
import { apiClient } from '@/services';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Fetch the product data server-side for metadata
    const resolvedParams = await Promise.resolve(params);
    const { slug } = resolvedParams;

    // Gian hàng s7 TRƯỚC, đúng nhịp với phần thân trang. Nếu thẻ tiêu đề/mô tả còn lấy từ backend cũ thì
    // sản phẩm chỉ có trên s7 sẽ ra trang mang tiêu đề mặc định — Google đọc đúng cái đó.
    const wanted = decodeURIComponent(slug);
    const rows = await fetchStoreProductsOnServer();
    const hit = rows?.find((p) => (p.slug || slugify(p.name)) === wanted);

    if (hit) {
      // Mô tả có thể chứa thẻ HTML (`description` bên s7 cho phép định dạng) — thẻ meta là văn bản thuần,
      // gỡ thẻ trước khi cắt, nếu không đoạn tóm tắt sẽ hiện `<p>` giữa kết quả tìm kiếm.
      const moTa = (hit.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

      return generateSeoMetadata({
        title: hit.name,
        description: moTa ? `${moTa.substring(0, 150)}...` : 'Thông tin chi tiết về sản phẩm',
        keywords: ['sản phẩm', 'chi tiết', hit.name],
        // Ảnh bên s7 đã là địa chỉ đầy đủ, KHÔNG bọc `getFileUrl` (hàm đó ghép thêm gốc CDN vào trước).
        image: hit.images?.[0],
      });
    }

    const productInfo = await getGoodsInfoBySlug(slug);

    return generateSeoMetadata({
      title: `${productInfo.name}`,
      description: productInfo.note
        ? `${productInfo.note.substring(0, 150)}...`
        : 'Thông tin chi tiết về sản phẩm',
      keywords: ['sản phẩm', 'chi tiết', 'sản phẩm', productInfo.name],
      image: apiClient.getFileUrl(productInfo.images?.[0]?.path),
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
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  // This is a server component that renders the client component
  return <ProductDetailClient params={{ slug }} />;
}
