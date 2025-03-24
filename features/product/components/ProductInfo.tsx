'use client';

import type {
  Product,
  ProductVariant,
} from '@/features/product/types/productTypes';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Minus,
  Pill,
  Plus,
  RotateCcw,
  Share2,
  Star,
  Truck,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/hooks/useCart';
import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';

interface ProductInfoProps {
  product: Product;
  isLoading: boolean;
  error: any;
}

export default function ProductInfo({
  product,
  isLoading,
  error,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const { addItem, isLoading: isAddingToCart } = useCart();
  const { user } = useAuth();

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

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      id: `${product._id}`,
      slug: product.slug,
      category: {
        _id: product.category?._id || '',
        name: product.category?.name || '',
        slug: product.category?.slug || '',
      },
      name: product.name,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      quantity: 1,
      inStockQuantity: product.quantity,
      unit: selectedVariant.name,
      image: apiClient.getFileUrl(product.images?.[0].path) || '',
    });
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
          Thương hiệu:{' '}
          <span className="font-medium">{product.company?.name}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-[#111827]">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">{product.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="text-sm text-[#6B7280]">{product._id}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#FFA800] text-[#FFA800]" />
              <span className="font-medium text-[#111827]">
                {product.rating}
              </span>
            </div>
            <span className="text-[#FFA800]">
              ({product.numberOfRating} đánh giá)
            </span>
            <span className="text-[#0D6EFD]">
              • {product.amountComment} bình luận
            </span>
          </div>
          <Button
            className="h-8 rounded-full bg-[#1877F2] px-3 text-white hover:bg-[#1877F2]/90"
            size="sm"
            variant="ghost">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-[#0D6EFD]">
            {selectedVariant?.price.toLocaleString()}đ
          </span>
          <span className="text-sm text-[#6B7280]">
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
      </div>

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
          className="flex-1 rounded-[100px] border-0 bg-[#F8F9FA] py-3 text-base font-medium text-[#0D6EFD] hover:bg-[#F8F9FA]/80"
          variant="outline">
          Tìm nhà thuốc
        </Button>
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <RotateCcw className="h-5 w-5 text-[#0D6EFD]" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">Đổi trả trong 30 ngày</p>
            <p className="text-sm text-[#6B7280]">Kể từ ngày mua hàng</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <Truck className="h-5 w-5 text-[#0D6EFD]" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">Miễn phí vận chuyển</p>
            <p className="text-sm text-[#6B7280]">Theo chính sách giao hàng</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D6EFD]/10">
            <Pill className="h-5 w-5 text-[#0D6EFD]" />
          </div>
          <div>
            <p className="font-medium text-[#111827]">Miễn phí 100%</p>
            <p className="text-sm text-[#6B7280]">Đổi thuốc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
