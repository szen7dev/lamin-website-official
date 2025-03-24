'use client';

import { use, useEffect, useState } from 'react';
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
import { useGetGoodsInfo, useGetQuestionList } from '@/features/product/hooks';
import { Product } from '@/features/product/types/productTypes';
import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Unwrap params using React.use() to handle the Promise
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const { slug } = unwrappedParams;

  // We'll use this state to store the goodsId once we look it up or get it from the API
  const [goodsId, setGoodsId] = useState<string>('');
  const [isLoadingId, setIsLoadingId] = useState(true);

  // In a real implementation, you would fetch the goodsId by slug first
  // For now, we'll simulate a lookup and use our example ID
  useEffect(() => {
    // Simulate API call to get goodsId from slug
    const fetchGoodsIdBySlug = async () => {
      try {
        // In a real implementation, this would be an API call
        // await apiClient.get(`/api/lookup/slug/${slug}`)

        // For now, we'll just simulate a delay and return our example ID
        await new Promise(resolve => setTimeout(resolve, 200));
        setGoodsId('67b2a307af90b400131ad107');
      } catch (error) {
        console.error('Error fetching goodsId by slug:', error);
      } finally {
        setIsLoadingId(false);
      }
    };

    fetchGoodsIdBySlug();
  }, [slug]);

  const { productInfo, isLoading, error } = useGetGoodsInfo(goodsId);

  // Fetch questions for the product
  const { questionList, isLoading: isLoadingQuestions } = useGetQuestionList({
    goodsId,
    limit: 10,
    page: 1,
  });

  // Fetch good list by category ID
  const { goodsList: relatedProductList, isLoading: isLoadingGoodsList } =
    useGetGoodsList({
      categoryID: '67c385469929f7001273993b',
      limit: 5,
      page: 1,
    });

  // Loading state
  if (isLoadingId || (isLoading && goodsId)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D6EFD]" />
        <span className="ml-2 text-lg text-[#6B7280]">
          Đang tải thông tin sản phẩm...
        </span>
      </div>
    );
  }

  console.log('productInfo', productInfo);

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

  if (!productInfo) {
    return null;
  }

  // We need to maintain compatibility with the existing components
  // that expect the standard Product type, so we'll adapt our data
  const adaptedProduct: Product = {
    ...mockProduct, // Use mock productInfo for structure and required fields
    id: productInfo._id,
    _id: productInfo._id,
    name: productInfo.name,
    description: productInfo.description || mockProduct.description,
    slug: productInfo.slug || '',
    ingredients: productInfo.ingredients || '',
    storage: productInfo.storage || '',
    category: productInfo.category || 'Uncategorized',
    images: productInfo.images.map((image: any) => ({
      _id: image._id,
      path: image.path,
      size: image.size || 0,
      alt: `${productInfo.name} - Image`,
    })),
  };

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 bg-white">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Breadcrumb
            items={[
              { label: 'Trang Chủ', href: '/' },
              { label: 'Sản Phẩm', href: '/products' },
              {
                label:
                  typeof productInfo.category === 'string'
                    ? productInfo.category
                    : 'Danh Mục',
                href: `/products/category/${typeof productInfo.category === 'string' ? productInfo.category : 'all'}`,
              },
              { label: productInfo.name },
            ]}
          />
        </nav>

        {/* Product Detail Section */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 ">
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
            />
          </div>
        </div>

        {/* Product Tabs Section */}
        <section className="mt-12">
          <ProductTabs product={adaptedProduct} />
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
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
          <h2 className="text-xl font-bold text-grayscale-90 mb-6">
            Sản phẩm liên quan
          </h2>
          <RelatedProducts products={relatedProductList} />
        </section>

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-grayscale-90 mb-6">
            Đánh giá sản phẩm
          </h2>
          <ProductReviews productId={adaptedProduct.id || ''} />
        </section>

        {/* Q&A Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-grayscale-90 mb-6">Hỏi đáp</h2>
          <ProductQA />
        </section>
      </div>
    </div>
  );
}
