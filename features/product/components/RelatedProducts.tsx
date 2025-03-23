'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProductCard from '@/features/product/components/ProductCard';
import { cn } from '@/lib/utils';
import apiClient from '@/services/api/apiClient';
import { Goods } from '@/features/search/types/goodsTypes';

interface RelatedProductsProps {
  products: Goods[];
  showTitle?: boolean;
}

export default function RelatedProducts({
  products,
  showTitle = false,
}: RelatedProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Responsive items per page
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet

      return 4; // desktop
    }

    return 4; // default for SSR
  };

  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  useEffect(() => {
    checkScrollability();
  }, [currentIndex, products, itemsPerPage]);

  const checkScrollability = () => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < totalPages - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const newIndex =
      direction === 'left'
        ? Math.max(0, currentIndex - 1)
        : Math.min(totalPages - 1, currentIndex + 1);

    setCurrentIndex(newIndex);
  };

  if (!products?.length) return null;

  const transformedProducts = products.map(product => {
    const units =
      product.variants?.map(variant => ({
        label: variant.name,
        value: variant._id,
      })) || [];

    // let discountPercent;

    // if (
    //   product.currentVariant?.originalPrice &&
    //   product.currentVariant?.price
    // ) {
    //   discountPercent = Math.round(
    //     ((product.currentVariant.originalPrice - product.currentVariant.price) /
    //       product.currentVariant.originalPrice) *
    //       100,
    //   );
    // }

    return {
      _id: product._id,
      slug: product.slug,
      image:
        apiClient.getFileUrl(product.images?.[0]?.path || '/placeholder.svg') ||
        '/placeholder.svg?height=200&width=200',
      name: product.name,
      price: product.sellingUnitprice || 0,
      originalPrice: product.currentVariant?.originalPrice,
      sellingUnitPrice: product.sellingUnitprice,
      listUnitPrice: product.listedUnitprice,
      thumbnail: product.thumbnail,
      unit: product.unit || product.currentVariant?.name || 'Hộp',
      // packageInfo: product.packageInfo || product.currentVariant?.specification,
      // discount: discountPercent > 0 ? discountPercent : undefined,
      units: units.length > 0 ? units : undefined,
      category: {
        _id: product.category?._id || '',
        name: product.category?.name || 'Danh mục',
        slug: product.category?.slug || 'all',
      },
    };
  });

  const visibleProducts = transformedProducts.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  return (
    <div className="relative py-6">
      {showTitle && (
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Sản phẩm liên quan
        </h2>
      )}

      {/* Navigation Buttons */}
      <div className="absolute left-0 right-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-2">
        <button
          aria-label="Previous products"
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
            !canScrollLeft ? 'invisible opacity-0' : 'visible opacity-100'
          }`}
          disabled={!canScrollLeft}
          onClick={() => scroll('left')}>
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <button
          aria-label="Next products"
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
            !canScrollRight ? 'invisible opacity-0' : 'visible opacity-100'
          }`}
          disabled={!canScrollRight}
          onClick={() => scroll('right')}>
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Products Grid */}
      <div
        ref={containerRef}
        aria-live="polite"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <div key={`${product._id}-${index}`} className="w-full">
            <ProductCard product={product} variant="simple" />
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={`indicator-${index}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
              aria-label={`Go to slide ${index + 1} of ${totalPages}`}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-gray-200 hover:bg-gray-300',
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
