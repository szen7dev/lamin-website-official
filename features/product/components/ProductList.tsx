'use client';
import { useMemo, useState } from 'react';
import { ChevronsDown } from 'lucide-react';

import ProductCard from './ProductCard';

import { useGetGoodsList } from '@/features/search/hooks/goods/useGetGoodsList';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { GridLayoutIcon, ListLayoutIcon } from '@/components/icons';
import { MediaItem } from '@/features/menu/types/mediaTypes';
import { useGetBestSellingCombo } from '@/features/homepage/hooks/combo/useGetBestSellingCombo';

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
  menuInfo,
}: {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
  menuInfo?: MediaItem;
}) {
  const { goodsList, error, isLoading } = useGetGoodsList({
    menuSlug: params?.slug,
    keyword: searchParams?.q as string,
  });

  const [sortBy, setSortBy] = useState<SortType>();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { combos: products } = useGetBestSellingCombo();
  const [visibleCount, setVisibleCount] = useState(1);
  const productsPerPage = 1;

  console.log('products', products);
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
      <>
        <button
          key={button.sortBy}
          className={`bg-white px-3 py-2 text-sm rounded-full outline outline-1 md:outline-transparent outline-grayscale-90 ${sortBy === button.sortBy ? 'outline outline-1 !outline-primary text-primary' : 'text-black'}`}
          onClick={() => {
            setSortBy(sortBy === button.sortBy ? undefined : button.sortBy);
            getSortedProducts();
          }}>
          {button.label}
        </button>
      </>
    );
  };
  const getSortedProducts = () => {
    if (!sortBy) return goodsList;
    const sorted = [...goodsList];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.sellingUnitprice - b.sellingUnitprice);
      case 'price-desc':
        return sorted.sort((a, b) => b.sellingUnitprice - a.sellingUnitprice);
      case 'rating-desc':
        const bestSellingIds = new Set(products?.map(p => p._id));

        return sorted.filter(p => bestSellingIds.has(p._id));
      default:
        return goodsList;
    }
  };

  const sortedProducts = useMemo(
    () => getSortedProducts(),
    [goodsList, sortBy],
  );

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="min-h-3 bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto sm:px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <DynamicBreadcrumb name={menuInfo?.name} />
        </nav>
      </div>

      <div className="container px-0 md:px-4">
        {!!searchParams?.q && (
          <div className="bg-white p-5 rounded-lg mb-5">
            Tìm thấy <span className="font-semibold">{goodsList.length}</span>{' '}
            sản phẩm với từ khóa{' '}
            <span className="font-semibold">{`"${searchParams?.q as string}"`}</span>
          </div>
        )}

        <div className="flex justify-between items-center pb-4 hidden md:flex">
          <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
          <div className="flex gap-2 items-center text-grayscale-50">
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
        <div className="bg-white pb-4 w-full p-4 md:hidden">
          <div className=" flex justify-between">
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
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
          <div className="flex gap-2 items-center text-grayscale-50 mt-4">
            {sortButtons.map(btn => renderSortButton(btn))}
          </div>
        </div>

        {goodsList?.length > 0 ? (
          <div className="p-3 md:p-0">
            <ul
              className={`rounded-full p-1 ${layout === 'list' ? 'grid grid-cols gap-3 sm:gap-4 sm:grid-cols-2' : 'grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
              {visibleProducts.map(product => (
                <li key={product._id}>
                  <ProductCard
                    error={error}
                    isLoading={isLoading}
                    layout={layout}
                    product={{
                      ...product,
                      listedUnitprice: product.listedUnitprice || 0,
                    }}
                    variant="simple"
                  />
                </li>
              ))}
            </ul>
            {visibleCount < sortedProducts.length && (
              <div className="text-center mt-4">
                <button
                  className="text-black font-medium text-sm hover:text-blue-600"
                  onClick={() =>
                    setVisibleCount(prev => prev + productsPerPage)
                  }>
                  <div className="flex">
                    <ChevronsDown height={20} width={20} />
                    <span>
                      Xem thêm{' '}
                      {Math.min(
                        productsPerPage,
                        sortedProducts.length - visibleCount,
                      )}{' '}
                      sản phẩm
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>Không có sản phẩm nào</div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
