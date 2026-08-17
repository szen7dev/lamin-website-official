'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ComboProduct } from '@/features/homepage/types/comboTypes';
import { apiClient } from '@/services/api/apiClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/features/cart/contexts/CartContext';

export interface ProductUnit {
  label: string;
  value: string;
}

export interface ProductCardProps {
  product: ComboProduct;
  variant?: 'default' | 'simple';
  className?: string;
  error?: unknown;
  isLoading?: boolean;
  layout?: 'grid' | 'list';
}

export default function ProductCard({
  product,
  variant = 'default',
  className,
  error,
  isLoading,
  layout = 'grid',
}: ProductCardProps) {
  const {
    addItem,
    showCartDropdown,
    hideCartDropdown,
    isLoading: isAddingToCart,
  } = useCart();
  const { toast } = useToast();

  const imageUrl = product.thumbnail?.path
    ? apiClient.getFileUrl(product.thumbnail.path)
    : undefined;

  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: 'Lỗi khi thêm vào giỏ hàng',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
        variant: 'destructive',
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    try {
      addItem({
        id: `${product._id}`,
        sign: product.sign,
        name: product.name || '',
        slug: product.slug,
        price: product?.sellingUnitprice || 0,
        originalPrice: product?.listedUnitprice || 0,
        salesoff:
          (product?.listedUnitprice ?? 0) - (product?.sellingUnitprice ?? 0),
        quantity: 1,
        unit: product.unit || '',
        image: imageUrl,
        category: {
          _id: product.category?._id || '',
          name: product.category?.name || '',
          slug: product.category?.slug || '',
        },
      });

      toast({
        title: 'Thêm vào giỏ hàng thành công',
        description: `Sản phẩm đã được thêm vào giỏ hàng.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi khi thêm vào giỏ hàng',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    showCartDropdown();
    setTimeout(() => {
      hideCartDropdown();
    }, 3000);
  };

  // Format price with Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountAmount =
    product?.listedUnitprice && product?.sellingUnitprice
      ? Number(
          (
            ((product.listedUnitprice - product.sellingUnitprice) /
              product.listedUnitprice) *
            100
          ).toFixed(0),
        )
      : 0;

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex h-full flex-col rounded-lg p-3 bg-white shadow-sm animate-pulse',
          className,
        )}>
        <div className="mb-3 aspect-square w-full bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="mt-auto h-10 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div
        className={cn(
          'flex h-full flex-col rounded-lg p-3 bg-white shadow-sm',
          className,
        )}>
        <div className="mb-3 aspect-square w-full bg-gray-100 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Không thể tải sản phẩm
        </p>
        <button className="mt-auto w-full rounded-full bg-gray-200 text-gray-500 py-2 px-4 text-center text-sm font-medium">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border border-grayscale-20 bg-white p-3 sm:p-4 shadow-sm h-full ',
        layout === 'list' ? 'grid grid-cols-2' : 'flex flex-col',
        className,
      )}>
      {/* Discount Badge */}
      {discountAmount > 0 && (
        <span className="absolute top-0 left-0 z-10">
          <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
            {`-${discountAmount}%`}
          </div>
        </span>
      )}

      {/* Product Image */}
      <Link
        className="block mb-3 hover:no-underline decoration-transparent"
        href={{
          pathname: `/san-pham/${product.slug}`,
        }}>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          {imageUrl ? (
            <Image
              fill
              alt={product?.name || ''}
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              placeholder="blur"
              quality={75}
              sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 240px"
              src={imageUrl}
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
      </Link>

      <div className="flex flex-col justify-between h-full">
        <Link
          className="block mb-3 hover:no-underline decoration-transparent"
          href={{
            pathname: `/san-pham/${product.slug}`,
          }}>
          {/* Product Name */}
          <h3 className="my-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
            {product.name}
          </h3>
        </Link>
        {/* Unit Selection */}
        {/* {product.unit && (
        <div className="mb-3">
          <div className="flex w-full rounded-lg border border-grayscale-20 overflow-hidden">
            {product.unit.map(unit => (
              <button
                key={unit.value}
                className={`flex-1 py-1 text-xs sm:text-sm ${
                  selectedUnit === unit.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-grayscale-60 hover:bg-grayscale-5'
                }`}
                onClick={() => setSelectedUnit(unit.value)}>
                {unit.label}
              </button>
            ))}
          </div>
        </div>
      )} */}

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              {formatPrice(product?.sellingUnitprice || 0)}
            </span>
            {product.unit && (
              <span className="text-xs sm:text-sm text-primary-50">
                / {product.unit}
              </span>
            )}
          </div>
          {product?.listedUnitprice && discountAmount > 0 && (
            <span className="text-xs sm:text-sm text-grayscale-40 line-through">
              {formatPrice(product?.listedUnitprice)}
            </span>
          )}
        </div>

        {/* Package Info */}
        {product.unitNote && (
          <div className="mb-3 text-[10px] sm:text-xs text-grayscale-90 bg-[#f5f5f5] rounded-lg w-max px-2 py-1">
            {product.unitNote}
          </div>
        )}

        {/* Buy Button */}
        {variant === 'default' ? (
          <Button
            className="mt-auto w-full rounded-full bg-primary hover:bg-primary-60 text-white py-2 px-4 text-center text-sm sm:text-base font-medium transition-colors"
            onClick={handleAddToCart}>
            Thêm vào giỏ
          </Button>
        ) : (
          <Button
            className="mt-auto w-full rounded-full bg-primary hover:bg-primary-60 text-white py-2 px-4 text-center text-sm sm:text-base font-medium transition-colors"
            disabled={isAddingToCart}
            onClick={handleAddToCart}>
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang thêm...
              </>
            ) : (
              'Chọn mua'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
