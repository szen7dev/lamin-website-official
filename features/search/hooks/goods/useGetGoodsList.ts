'use client';

import { useQuery } from '@tanstack/react-query';

import { getGoodsList } from '@/features/search/api/goods/getGoodsList';
import { getStoreGoodsList } from '@/features/product/api/storeCatalog';
import { GoodsListParams } from '@/features/search/types/goodsTypes';

export const useGetGoodsList = (params: GoodsListParams = {}) => {
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['GOODS_LIST', params],
    queryFn: async () => {
      // Gian hàng s7 TRƯỚC — hook này là nguồn của bốn màn: Tất cả sản phẩm · ô tìm kiếm · ProductList ·
      // sản phẩm liên quan. Chuyển một chỗ là cả bốn cùng đổi, và cùng nhịp với trang chủ/trang chi tiết
      // vốn đã đọc từ s7 (khác nhịp thì liên kết theo slug sẽ 404).
      //
      // `null` = chưa cấu hình gian hàng, s7 không với tới được, HOẶC đang lọc theo danh mục/menu mà s7
      // chưa có khái niệm đó → giữ nguyên nguồn cũ.
      const fromStore = await getStoreGoodsList(params);

      return fromStore ?? getGoodsList(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled:
      !!params.keyword ||
      !!params.categoryID ||
      !!params.menuSlug ||
      !!params.lastestID ||
      !!params.usage ||
      !!params.optionSeller,
  });

  return {
    goodsList: result?.data || [],
    pagination: result?.pagination,
    isLoading,
    error,
    refetch,
    hasResults: (result?.data || []).length > 0,
  };
};
