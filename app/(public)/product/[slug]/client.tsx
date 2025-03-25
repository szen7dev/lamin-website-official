'use client';

import { Loader2 } from 'lucide-react';
import { Suspense, use, useMemo } from 'react';

import { useGetQuestionList } from '@/features';
import { useGetVoucher } from '@/features/cart/hooks/useGetVoucher';
import ProductDetail from '@/features/product/components/ProductDetail';
import { useGetGoodsInfoBySlug } from '@/features/product/hooks/useGetGoodsInfoBySlug';
import { ProductImage } from '@/features/product/types/productTypes';
import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { useAuth } from '@/hooks';
import Loading from '@/app/loading';

export function ProductDetailClient({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Ensure we call all hooks at the top level in the same order
  const { user } = useAuth();

  // Unwrap params using React.use() to handle the Promise
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const { slug } = unwrappedParams;

  console.log('ProductDetailPage slug:', slug);

  // Always call all data fetching hooks
  const {
    productInfo,
    isLoading: isLoadingProduct,
    error: errorProduct,
  } = useGetGoodsInfoBySlug(slug);

  // Fetch good list by category ID - use optional chaining to handle undefined
  const {
    goodsList: relatedProductList,
    error: errorGoodsList,
    isLoading: isLoadingGoodsList,
  } = useGetGoodsList({
    categoryID: productInfo?.category?._id,
    limit: 5,
    page: 1,
  });

  // Fetch questions for the product
  const {
    questionList,
    error: errorQuestions,
    isLoading: isLoadingQuestions,
  } = useGetQuestionList({
    slug: slug,
    limit: 10,
    page: 1,
  });

  // Always call the voucher hook
  const {
    data: vouchers = [],
    error: errorVouchers,
    isLoading: isLoadingVouchers,
  } = useGetVoucher({
    customerID: user?.id,
  });

  const isError =
    errorProduct || errorGoodsList || errorQuestions || errorVouchers;
  const isLoading =
    isLoadingProduct ||
    isLoadingGoodsList ||
    isLoadingQuestions ||
    isLoadingVouchers;

  // Use useMemo for derived data instead of conditional variables
  const adaptedProduct = useMemo(() => {
    if (!productInfo) return null;

    return {
      ...productInfo,
      id: productInfo._id,
      _id: productInfo._id,
      name: productInfo.name,
      description: productInfo.description,
      slug: productInfo.slug || '',
      ingredients: productInfo.ingredients || '',
      storage: productInfo.storage || '',
      usage: productInfo.usage || '',
      images:
        productInfo.images?.map((image: ProductImage) => ({
          _id: image._id,
          path: image.path,
          size: image.size || 0,
          alt: `${productInfo.name} - Image`,
        })) || [],
    };
  }, [productInfo]);

  // Now render based on component state
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D6EFD]" />
        <span className="ml-2 text-lg text-[#6B7280]">
          Đang tải thông tin sản phẩm...
        </span>
      </div>
    );
  }

  // Error state
  if (isError || (!isLoading && !productInfo)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="text-lg font-semibold">
            Không thể tải thông tin sản phẩm
          </p>
          <p className="mt-2">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
        </div>
      </div>
    );
  }

  // If no product or adapted product, return null
  if (!productInfo || !adaptedProduct) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetail
        adaptedProduct={adaptedProduct}
        isError={isError}
        isLoading={isLoading}
        productInfo={productInfo}
        questionList={questionList}
        relatedProductList={relatedProductList}
        vouchers={vouchers}
      />
    </Suspense>
  );
}
