'use client';

import ProductGallery from '@/features/product/components/ProductGallery';
import ProductInfo from '@/features/product/components/ProductInfo';
import ProductTabs from '@/features/product/components/ProductTabs';
import RelatedProducts from '@/features/product/components/RelatedProducts';
import ProductReviews from '@/features/product/components/ProductReviews';
import ProductFAQ from '@/features/product/components/ProductFAQ';
import ProductQA from '@/features/product/components/ProductQA';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { ProductImage } from '@/features/product/types/productTypes';

interface ProductDetailProps {
  productInfo: any;
  isLoading: boolean;
  isError: Error | null;
  questionList: any;
  relatedProductList: any;
  vouchers: any;
  adaptedProduct: any;
}

export default function ProductDetail({
  productInfo,
  questionList,
  relatedProductList,
  vouchers,
  adaptedProduct,
  isError,
  isLoading,
}: ProductDetailProps) {
  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto sm:px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <DynamicBreadcrumb />
        </nav>
      </div>

      <div className="container mx-auto px-0 sm:px-4">
        {/* Product Detail Section */}
        <section className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 bg-white p-6 rounded-none sm:rounded-lg">
          {/* Left Column - Product Gallery */}
          <div>
            <ProductGallery
              images={adaptedProduct.images.map((img: ProductImage) => ({
                id: img._id,
                url: img.path,
                alt: img.alt,
              }))}
            />
          </div>

          {/* Right Column - Product Info */}
          <div>
            <ProductInfo
              error={isError}
              isLoading={isLoading}
              product={productInfo}
              vouchers={vouchers}
            />
          </div>
        </section>

        {/* Product Tabs Section */}
        <section className="mt-12 bg-white p-6 rounded-none sm:rounded-lg">
          <ProductTabs product={adaptedProduct} />
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white p-6 rounded-none sm:rounded-lg">
          <h2 className="text-xl font-bold text-grayscale-90 mb-6">
            Câu hỏi thường gặp
          </h2>
          <ProductFAQ
            isLoading={isLoading}
            product={adaptedProduct}
            questions={questionList}
          />
        </section>

        {/* Related Products Section */}
        <section className="mt-12 bg-white p-6 rounded-none sm:rounded-lg ">
          <h2 className="text-xl font-bold text-grayscale-90">
            Sản phẩm liên quan
          </h2>
          <RelatedProducts products={relatedProductList} />
        </section>

        {/* Reviews Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <ProductReviews
            product={adaptedProduct}
            productId={adaptedProduct._id || ''}
          />
        </section>

        {/* Q&A Section */}
        <section className="mt-12 bg-white p-6 rounded-lg">
          <ProductQA productId={adaptedProduct._id || ''} />
        </section>
      </div>
    </div>
  );
}
