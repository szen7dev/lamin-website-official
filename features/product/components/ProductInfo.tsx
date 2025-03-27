'use client';

import type {
  Product,
  ProductVariant,
} from '@/features/product/types/productTypes';

import { useEffect, useState } from 'react';
import { Loader2, Minus, Plus, Star } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/hooks/useCart';
import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import {
  ClockIcon,
  FacebookBranchIcon,
  PillIcon,
  SaleIcon,
  TransportIcon,
} from '@/components/icons';
import { Voucher } from '@/features/cart/types/voucherTypes';

interface ProductInfoProps {
  product: Product;
  vouchers: Voucher[];
  isLoading: boolean;
  error: any;
}

export default function ProductInfo({
  product,
  vouchers,
  isLoading,
  error,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const { addItem, isLoading: isAddingToCart } = useCart();
  // Create variants from the goods info
  const createVariantsFromGoodsInfo = () => {
    if (!product) return [];

    // Default variant using the product's main price
    const defaultVariant: ProductVariant = {
      id: '1',
      name: product.unit || 'Đơn vị',
      price: product.sellingUnitprice || 0,
      originalPrice: product.listedUnitprice,
      inStock: product.status === 1,
      specification: product.unitNote || '',
    };

    return [defaultVariant];
  };

  const variants = createVariantsFromGoodsInfo();

  // Update selected variant when goods info changes
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [product]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
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
        name: product.name,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice || 0,
        salesoff: product.listedUnitprice - product.sellingUnitprice || 0,
        quantity,
        unit: selectedVariant.name,
        image: apiClient.getFileUrl(product.images?.[0].path) || '',
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      toast({
        title: 'Lỗi khi thêm vào giỏ hàng',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
        variant: 'destructive',
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

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

  if (error || !product) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        <p className="text-lg font-semibold">
          Không thể tải thông tin sản phẩm
        </p>
        <p className="mt-2">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <div className="text-sm text-[#0D6EFD]">
          <span className="text-grayscale-90 font-medium text-sm mr-1">
            Thương hiệu:
          </span>
          <span className="text-primary-50 text-sm font-medium">
            {product.company?.name}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-[#111827]">
          {product.name}
        </h1>
        {/* <p className="mt-2 text-sm text-[#6B7280]">{product.description}</p> */}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <span className="text-sm text-grayscale-90">{product.sign}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#FFA800] text-[#FFA800]" />
              <span className="text-[#111827]  font-normal text-xs">
                {product.rating}
              </span>
            </div>
            <span className="text-primary-50 font-normal text-xs">
              ({product.numberOfRating} đánh giá)
            </span>
            <span className="text-primary-50 font-normal text-sm">
              • {product.amountComment} bình luận
            </span>
          </div>
          <Button
            className="h-8 rounded-sm bg-[#1877F2] px-2 text-white hover:bg-[#1877F2]/80 hover:border-[1px] hover:text-white"
            size="sm"
            variant="ghost">
            <span className="flex items-center gap-2">
              <FacebookBranchIcon
                className="w-4 h-4"
                fill="#ffffff"
                height={16}
                width={16}
              />
              Chia sẻ
            </span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-0">
        <Image
          alt="point-icon"
          height={20}
          src="/icons/point-icon.svg"
          width={20}
        />
        <span className="text-sm font-normal text-grayscale-90">
          Tặng {product.sellingUnitprice / 100} điểm thưởng khi mua hàng
        </span>
      </div>
      {/* Price */}
      <div className="flex items-baseline gap-3 mt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-semibold text-primary-50">
            {selectedVariant?.price.toLocaleString()}đ
          </span>
          <span className="text-sm font-semibold text-primary-50">
            / {selectedVariant?.name}
          </span>
        </div>
        {selectedVariant?.originalPrice && (
          <span className="text-sm text-[#9CA3AF] line-through">
            {selectedVariant.originalPrice.toLocaleString()}đ
          </span>
        )}
      </div>

      {/* Unit Selection */}
      {variants.length > 1 && (
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#111827]">Chọn đơn vị tính</span>
          <div className="flex gap-2">
            {variants.map(variant => (
              <button
                key={variant.id}
                className={cn(
                  'h-9 rounded-full px-6 text-sm font-medium transition-all',
                  selectedVariant?.id === variant.id
                    ? 'bg-[#0D6EFD] text-white'
                    : 'border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#0D6EFD]',
                )}
                onClick={() => handleVariantChange(variant)}>
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Product Details */}
      <div className="grid grid-cols-5 gap-x-8 gap-y-3 text-sm">
        {product.category && (
          <>
            <div className="col-span-2 text-[#6B7280]">Danh mục</div>
            <div className="col-span-3 text-[#0D6EFD]">
              {product.category.name}
            </div>
          </>
        )}

        {selectedVariant?.specification && (
          <>
            <div className="col-span-2 text-[#6B7280]">Quy cách</div>
            <div className="col-span-3 text-[#111827]">
              {selectedVariant.specification}
            </div>
          </>
        )}

        {product.ingredients && (
          <>
            <div className="col-span-2 text-[#6B7280]">Thành phần</div>
            <div className="col-span-3 space-y-1">
              <div className="text-[#111827]">{product.ingredients}</div>
            </div>
          </>
        )}

        {product.instructions && (
          <>
            <div className="col-span-2 text-[#6B7280]">Cách dùng</div>
            <div className="col-span-3 text-[#111827]">
              {product.instructions}
            </div>
          </>
        )}

        {product.storage && (
          <>
            <div className="col-span-2 text-[#6B7280]">Bảo quản</div>
            <div className="col-span-3 text-[#111827]">{product.storage}</div>
          </>
        )}
        {product.description && (
          <>
            <div className="col-span-2 text-[#6B7280]">Mô tả ngắn</div>
            <div className="col-span-3 text-grayscale-90 line-clamp-3">
              {product.description}
            </div>
          </>
        )}
      </div>

      {product.listedUnitprice - product.sellingUnitprice > 0 && (
        <div className=" rounded-lg overflow-hidden border border-grayscale-20">
          <div className="flex gap-2 text-[#F37021] bg-orange-100 font-medium text-base p-2">
            <SaleIcon />
            Khuyến mãi được áp dụng
          </div>
          <div className="flex items-center p-2">
            <div className="bg-primary-5 rounded-lg p-2">
              <Image
                alt="price-tag"
                height={20}
                src="/icons/priceTag.svg"
                width={20}
              />
            </div>
            <span className="ml-2">
              Giảm ngay{' '}
              {Math.floor(
                ((product.listedUnitprice - product.sellingUnitprice) /
                  product.listedUnitprice) *
                  100,
              )}
              {'% '}
              {product.expired
                ? `áp dụng đến ${new Date(product.expired).toLocaleDateString(
                    'vi-VN',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    },
                  )}`
                : ''}
            </span>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#111827]">Chọn số lượng</span>
        <div className="flex items-center">
          <Button
            className="h-10 w-10 rounded-l-[100px] rounded-r-none border-[#E5E7EB] hover:bg-transparent disabled:bg-transparent"
            disabled={quantity <= 1}
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(quantity - 1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <input
            className="h-10 w-16 border-y border-[#E5E7EB] bg-transparent px-3 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min="1"
            type="number"
            value={quantity}
            onChange={e => handleQuantityChange(Number(e.target.value))}
          />
          <Button
            className="h-10 w-10 rounded-l-none rounded-r-[100px] border-[#E5E7EB] hover:bg-transparent"
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 rounded-[100px] bg-[#0D6EFD] py-3 text-base font-medium text-white hover:bg-[#0D6EFD]/90 disabled:bg-[#0D6EFD]/70"
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
        <Button
          className="flex-1 rounded-[100px] border-0 bg-primary-5 py-3 text-base font-medium text-[#0D6EFD] hover:bg-primary-5/80"
          variant="outline">
          Tìm nhà thuốc
        </Button>
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 p-2 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <ClockIcon className="h-6 w-6 text-[#0D6EFD]" />
          </div>
          <div>
            <p className="font-medium text-sm text-grayscale-90">
              Đổi trả trong 30 ngày
            </p>
            <p className="text-xs font-normal text-grayscale-40">
              Kể từ ngày mua hàng
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-14 p-2 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <TransportIcon />
          </div>
          <div>
            <p className="font-medium text-sm text-grayscale-90">
              Miễn phí vận chuyển
            </p>
            <p className="text-sm text-[#6B7280]">Theo chính sách giao hàng</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 p-2 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <PillIcon />
          </div>
          <div>
            <p className="font-medium text-sm text-grayscale-90">
              Miễn phí 100%
            </p>
            <p className="text-sm text-[#6B7280]">Đổi thuốc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
