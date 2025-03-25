'use client';

import { use, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import ProductGallery from '@/features/product/components/ProductGallery';
import ProductInfo from '@/features/product/components/ProductInfo';
import ProductTabs from '@/features/product/components/ProductTabs';
import RelatedProducts from '@/features/product/components/RelatedProducts';
import ProductReviews from '@/features/product/components/ProductReviews';
import ProductFAQ from '@/features/product/components/ProductFAQ';
import ProductQA from '@/features/product/components/ProductQA';
import { mockProduct } from '@/features/product/mocks/productMockData';
import { useGetQuestionList } from '@/features/product/hooks';
import { ProductImage } from '@/features/product/types/productTypes';
import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { useAuth } from '@/hooks';
import { useGetVoucher } from '@/features/cart/hooks/useGetVoucher';
import { useGetGoodsInfoBySlug } from '@/features/product/hooks/useGetGoodsInfoBySlug';

export default function ProductDetailPage({
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
  const { productInfo, isLoading, error } = useGetGoodsInfoBySlug(slug);

  // Fetch good list by category ID - use optional chaining to handle undefined
  const { goodsList: relatedProductList, isLoading: isLoadingGoodsList } =
    useGetGoodsList({
      categoryID: productInfo?.category?._id,
      limit: 5,
      page: 1,
    });

  // Fetch questions for the product
  const { questionList, isLoading: isLoadingQuestions } = useGetQuestionList({
    slug: slug,
    limit: 10,
    page: 1,
  });

  // Always call the voucher hook
  const { data: vouchers = [], isLoading: isLoadingVouchers } = useGetVoucher({
    customerID: user?.id,
  });

  // Use useMemo for derived data instead of conditional variables
  const adaptedProduct = useMemo(() => {
    if (!productInfo) return null;

    return {
      ...productInfo,
      id: productInfo._id,
      _id: productInfo._id,
      name: productInfo.name,
      description: productInfo.description || mockProduct.description,
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
  if (error || (!isLoading && !productInfo)) {
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

  // Only return the fully rendered component when we have all data
  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Breadcrumb
            items={[
              { label: 'Trang Chủ', href: '/' },
              { label: 'Sản Phẩm', href: '/products' },
              {
                label:
                  typeof productInfo.category?.name === 'string'
                    ? productInfo.category.name
                    : 'Danh Mục',
                href: `/products/category/${typeof productInfo.category?.name === 'string' ? productInfo.category.name : 'all'}`,
              },
              { label: productInfo.name },
            ]}
          />
        </nav>

        {/* Product Detail Section */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 bg-white p-6 rounded-lg">
          {/* Left Column - Product Gallery */}
          <div>
            <ProductGallery
              images={adaptedProduct.images.map(img => ({
                id: img._id,
                url: img.path,
                alt: img.alt,
              }))}
            />
          </div>

          {/* Right Column - Product Info */}
          <div>
            <ProductInfo
              error={error}
              isLoading={isLoading}
              product={productInfo}
              vouchers={vouchers}
            />
          </div>
        </div>

        {/* Product Tabs Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <ProductTabs product={adaptedProduct} />
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold text-grayscale-90 mb-6">
            Câu hỏi thường gặp
          </h2>
          <ProductFAQ
            isLoading={isLoadingQuestions}
            product={adaptedProduct}
            questions={questionList}
          />
        </section>

        {/* Related Products Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-grayscale-90">
            Sản phẩm liên quan
          </h2>
          <RelatedProducts products={relatedProductList} />
        </section>

        {/* Reviews Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold text-grayscale-90 mb-6 border-b-2 pb-5">
            Đánh giá sản phẩm
          </h2>
          <ProductReviews productId={adaptedProduct.id || ''} />
        </section>

        {/* Q&A Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <ProductQA />
        </section>
      </div>
    </div>
  );
}
