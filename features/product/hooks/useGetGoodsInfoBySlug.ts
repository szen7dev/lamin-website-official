'use client';

import { useQuery } from '@tanstack/react-query';

import { Product } from '@/features/product/types/productTypes';
import { getGoodsInfoBySlug } from '@/features/product/api/getGoodsInfoBySlug';
import { getStoreProductBySlug } from '@/features/product/api/storeCatalog';

/**
 * Hook for fetching detailed goods info by slug
 * @param slug - slug of the goods to fetch
 * @returns Object containing goods info, loading state, and error
 */
export const useGetGoodsInfoBySlug = (slug: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_GOODS_INFO_BY_SLUG', slug],
    queryFn: async () => {
      // Gian hàng s7 TRƯỚC. Bắt buộc phải đi cùng nhịp với danh sách sản phẩm: danh sách đã dựng liên kết
      // bằng slug của s7, nếu trang chi tiết vẫn tra backend cũ thì mọi liên kết đó đều 404.
      // `null` = chưa cấu hình gian hàng, s7 không với tới được, hoặc không có sản phẩm nào khớp slug →
      // rơi về nguồn cũ, đúng như trước.
      const fromStore = await getStoreProductBySlug(slug);

      return fromStore ?? getGoodsInfoBySlug(slug);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug, // Only fetch if slug is provided
  });

  return {
    productInfo: data as Product,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
