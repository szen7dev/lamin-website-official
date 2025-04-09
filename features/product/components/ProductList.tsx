'use client';
import { useState } from 'react';

import ProductCard from './ProductCard';

import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { GridLayoutIcon, ListLayoutIcon } from '@/components/icons';

type SortType =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-asc'
  | 'rating-desc';

function ProductList({
  params,
  searchParams,
}: {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { goodsList, error, isLoading } = useGetGoodsList({
    menuSlug: params?.slug,
    keyword: searchParams?.q as string,
  });

  const [sortBy, setSortBy] = useState<SortType>();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const sortButtons: { label: string; sortBy: SortType }[] = [
    {
      label: 'Bán chạy',
      sortBy: 'rating-desc',
    },
    {
      label: 'Giá thấp',
      sortBy: 'price-asc',
    },
    {
      label: 'Giá cao',
      sortBy: 'price-desc',
    },
  ];

  const renderSortButton = (button: { label: string; sortBy: SortType }) => {
    return (
      <button
        key={button.sortBy}
        className={`bg-white px-3 py-2 text-sm rounded-full ${sortBy === button.sortBy ? 'outline outline-1 outline-primary text-primary' : 'text-black'}`}
        onClick={() => {
          setSortBy(button.sortBy);
        }}>
        {button.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto sm:px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <DynamicBreadcrumb />
        </nav>
      </div>

      <div className="container mx-auto px-0 sm:px-4">
        {!!searchParams?.q && (
          <div className="bg-white p-5 rounded-lg mb-5">
            Tìm thấy <span className="font-semibold">{goodsList.length}</span>{' '}
            sản phẩm với từ khóa{' '}
            <span className="font-semibold">{`"${searchParams?.q as string}"`}</span>
          </div>
        )}

        <div className="flex justify-between items-center pb-4">
          <h3>Danh sách sản phẩm</h3>
          <div className="flex gap-5 items-center text-grayscale-50">
            Sắp xếp theo
            {sortButtons.map(btn => renderSortButton(btn))}
            <div className="flex bg-white rounded-full p-1 gap-0.5">
              <button
                className={`rounded-full p-1 ${layout === 'grid' ? 'bg-primary' : ''}`}
                onClick={() => {
                  setLayout('grid');
                }}>
                <GridLayoutIcon fill={layout === 'grid' ? 'white' : 'black'} />
              </button>
              <button
                className={`rounded-full p-1 ${layout === 'list' ? 'bg-primary' : ''}`}
                onClick={() => {
                  setLayout('list');
                }}>
                <ListLayoutIcon fill={layout === 'list' ? 'white' : 'black'} />
              </button>
            </div>
          </div>
        </div>

        {goodsList?.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {goodsList.map(product => (
              <li key={product._id}>
                <ProductCard
                  error={error}
                  isLoading={isLoading}
                  product={{
                    ...product,
                    listedUnitprice: product.listedUnitprice || 0,
                  }}
                  variant="simple"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div>Không có sản phẩm nào</div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
