'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BasketIcon } from '@/components/icons';
import { useCart } from '@/features/cart/contexts/CartContext';
import { Goods } from '@/features/search/types/goodsTypes';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api/apiClient';

interface ProductGridCardProps {
  product: Goods;
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      addItem({
        id: product._id,
        name: product.name,
        price: product.sellingUnitprice,
        originalPrice: product.listedUnitprice || product.sellingUnitprice,
        quantity: 1,
        unit: 'Hộp',
        image: product.thumbnail?.path
          ? apiClient.getFileUrl(product.thumbnail.path)
          : '',
        slug: product.slug,
        category: {
          _id: '',
          name: '',
          slug: '',
        },
      });

      toast({
        title: 'Đã thêm sản phẩm vào giỏ hàng!',
        description: product.name,
      });
    } catch (error) {
      toast({
        title: 'Không thể thêm vào giỏ hàng',
        description: 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      className="group block cursor-pointer no-underline decoration-transparent transition-all duration-300 hover:no-underline"
      href={`/san-pham/${product.slug}`}>
      {/* Product Card */}
      <div className="flex flex-col">
        {/* Image Container with Border */}
        <div
          className="relative mb-4 overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            border: '6px solid #0099F9',
          }}>
          <div className="relative aspect-square w-full overflow-hidden bg-white p-4">
            {/* Add to Cart Button */}
            <button
              aria-label="Add to cart"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-primary/90"
              type="button"
              onClick={handleAddToCart}>
              <BasketIcon className="text-white" />
            </button>

            {/* Product Image */}
            {product.thumbnail?.path ? (
              <Image
                fill
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                src={apiClient.getFileUrl(product.thumbnail.path)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-4xl text-gray-400">📦</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Outside Border */}
        <div className="text-center">
          {/* Product Name */}
          <h3 className="mb-2 min-h-[44px] text-sm font-medium leading-tight text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-xl font-bold text-[#0099F9]">
            {formatPrice(product.sellingUnitprice)}đ
          </p>
        </div>
      </div>
    </Link>
  );
}
