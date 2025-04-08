'use client';

import ProductCard from '@/features/product/components/ProductCard';
import { useGetBestSellingCombo } from '@/features/homepage/hooks/combo/useGetBestSellingCombo';

export default function BestSellingProducts() {
  const { combos: products, isLoading, error } = useGetBestSellingCombo();

  if (!products?.length) {
    return <></>;
  }

  return (
    <section aria-labelledby="bestselling-title" className="py-4 sm:py-6">
      {/* Section Title */}
      <header className="mb-6 flex justify-center">
        <h2
          className="inline-block rounded-t-[8px] rounded-b-[40px] bg-gradient-1 px-8 sm:px-14 py-2 text-base sm:text-xl font-semibold text-white"
          id="bestselling-title">
          Sản Phẩm Bán Chạy
        </h2>
      </header>

      {/* Products Grid */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products?.map(product => (
          <li key={product._id}>
            <ProductCard
              error={error}
              isLoading={isLoading}
              product={product}
              variant="simple"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
