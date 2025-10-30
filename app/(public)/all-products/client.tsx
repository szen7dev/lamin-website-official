'use client';

import { useEffect, useState } from 'react';
import { ChevronsDown, Loader2 } from 'lucide-react';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import ProductGridCard from '@/features/product/components/ProductGridCard';
import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { Goods } from '@/features/search/types/goodsTypes';

export function AllProductsClient() {
  const [lastestID, setLastestID] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Goods[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Fetch products with cursor-based pagination
  const { goodsList, pagination, error, isLoading } = useGetGoodsList({
    usage: 2,
    optionSeller: 1,
    lastestID,
    limit: 12,
  });

  // Update products when new data arrives
  useEffect(() => {
    if (goodsList && goodsList.length > 0) {
      if (lastestID === '') {
        // First load - replace all products
        setAllProducts(goodsList);
      } else {
        // Load more - append new products
        setAllProducts(prev => [...prev, ...goodsList]);
      }

      // Check pagination.nextCursor for more data
      if (pagination?.nextCursor) {
        setHasMore(true);
      } else if (goodsList.length < 12) {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    } else if (goodsList && goodsList.length === 0) {
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [goodsList, pagination, lastestID]);

  // Handle load more click
  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    if (pagination?.nextCursor) {
      // Use nextCursor from pagination response
      setLastestID(pagination.nextCursor);
    } else if (goodsList.length > 0) {
      // Fallback: use last item's ID
      setLastestID(goodsList[goodsList.length - 1]._id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <DynamicBreadcrumb />

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-grayscale-90">
            Tất cả sản phẩm
          </h1>
          <p className="mt-2 text-sm sm:text-base text-grayscale-60">
            Khám phá bộ sưu tập sản phẩm chất lượng cao của Lamin
          </p>
        </div>

        {/* Loading State - First Load */}
        {isLoading && allProducts.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="mb-4 aspect-square rounded-3xl bg-gray-200" />
                <div className="mx-auto mb-2 h-10 w-full rounded bg-gray-200" />
                <div className="mx-auto h-6 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && allProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không thể tải sản phẩm
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {allProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {allProducts.map(product => (
                <ProductGridCard key={product._id} product={product} />
              ))}
            </div>

            {/* Load More Spinner */}
            {isLoadingMore && (
              <div className="flex justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !isLoadingMore && (
              <div className="text-center mt-8">
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all font-medium"
                  onClick={handleLoadMore}>
                  <ChevronsDown className="h-5 w-5" />
                  <span>Xem thêm</span>
                </button>
              </div>
            )}

            {/* No More Products Message */}
            {!hasMore && allProducts.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-sm text-grayscale-60">
                  Đã hiển thị tất cả sản phẩm ({allProducts.length} sản phẩm)
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && allProducts.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có sản phẩm
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Hiện tại chưa có sản phẩm nào.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
