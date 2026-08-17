'use client';

import type { Goods } from '@/features/search/types/goodsTypes';

import { useQuery } from '@tanstack/react-query';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';
import { getStoreCatalog } from '@/features/product/api/storeCatalog';

interface ProductsParams {
  limit?: number;
  usage?: number;
  optionSeller?: number;
}

export function useGetProducts(params: ProductsParams = {}) {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_PRODUCTS', params.usage, params.limit],
    queryFn: async () => {
      // NGUỒN MỚI: gian hàng s7-data-hub. `null` = gian hàng chưa được cấu hình (chưa cấp
      // `S7_STORE_TOKEN`) hoặc s7 không với tới được → rơi xuống nguồn cũ bên dưới.
      // Chính việc CÓ cấu hình token hay không là công tắc bật/tắt của cả đợt chuyển đổi.
      // Mảng RỖNG thì vẫn dùng: rỗng nghĩa là chưa ai bật `on_web` cho sản phẩm nào — một vấn đề dữ liệu
      // cần nhìn thấy, không phải thứ nên che đi bằng cách lặng lẽ hiện hàng của backend cũ.
      const fromStore = await getStoreCatalog();
      if (fromStore) return fromStore.slice(0, params.limit || 6);

      try {
        const queryParams = {
          limit: params.limit || 6,
          usage: params.usage || 2,
          optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
          select: 'name slug thumbnail sellingUnitprice listedUnitprice',
          populates: JSON.stringify({ path: 'thumbnail', select: 'path' }),
        };

        const response = await apiClient.get<Goods[]>(
          '/api/item/goods',
          queryParams,
        );

        return response.data || [];
      } catch (error) {
        console.error('Error fetching products:', error);

        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    products,
    isLoading,
    error,
  };
}
