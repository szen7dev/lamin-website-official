'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductUnit {
  label: string;
  value: string;
}

interface ProductCardSimpleProps {
  product: {
    id?: number | string;
    slug: string;
    image?: string;
    name: string;
    price: string | number;
    originalPrice?: string | number;
    unit?: string;
    packageInfo?: string;
    discount?: string | number;
    units: ProductUnit[];
    category: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

export default function ProductCardSimple({ product }: ProductCardSimpleProps) {
  const {
    addItem,
    showCartDropdown,
    hideCartDropdown,
    isLoading: isAddingToCart,
  } = useCart();
  const { toast } = useToast();
  const [selectedUnit, setSelectedUnit] = useState(product.units[0].value);

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
        id: `${product.id}`,
        name: product.name || '',
        slug: product.slug,
        price: Number(product?.price) || 0,
        originalPrice: Number(product?.originalPrice) || 0,
        salesoff:
          (Number(product?.originalPrice) ?? 0) - (Number(product?.price) ?? 0),
        quantity: 1,
        unit: product.unit || '',
        image: product.image,
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

  return (
    <div className="relative rounded-xl border border-grayscale-20 bg-white p-3 sm:p-4 shadow-sm h-full flex flex-col">
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-0 left-0 z-10">
          <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
            {product.discount}
          </div>
        </span>
      )}

      {/* Product Image */}
      <Link
        className="decoration-transparent block mb-3 hover:no-underline"
        href={{
          pathname: `/product/${product.slug}`,
          query: { goodsId: product.id },
        }}>
        <div className="relative mb-1 aspect-square w-full overflow-hidden rounded-lg">
          {product.image ? (
            <Image
              fill
              alt={product.name}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              src={product.image}
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>

        {/* Product Name */}
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
          {product.name}
        </h3>
      </Link>

      {/* Unit Selection */}
      <div className="mb-3">
        <div className="flex w-full rounded-lg border border-grayscale-20 overflow-hidden">
          {product.units.map((unit: ProductUnit) => (
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

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-primary">
            {product.price}
          </span>
          <span className="text-xs sm:text-sm text-grayscale-50">
            / {product.unit}
          </span>
        </div>
        {product.originalPrice && (
          <span className="text-xs sm:text-sm text-grayscale-40 line-through">
            {product.originalPrice}
          </span>
        )}
      </div>

      {/* Package Info */}
      <p className="mb-3 text-[10px] sm:text-xs text-grayscale-50">
        {product.packageInfo}
      </p>

      {/* Buy Button */}
      <Button
        className="decoration-transparent mt-auto w-full rounded-full bg-primary hover:bg-primary-60 text-white py-2 px-4 text-center text-sm sm:text-base font-medium transition-colors no-underline"
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
    </div>
  );
}
