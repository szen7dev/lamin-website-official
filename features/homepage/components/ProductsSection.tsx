'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetProducts } from '@/features/homepage/hooks/products/useGetProducts';
import { apiClient } from '@/services/api/apiClient';
import { BasketIcon } from '@/components/icons';
import { useCart } from '@/features/cart/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function ProductsSection() {
  const { products, isLoading } = useGetProducts({
    limit: 6,
    usage: 2,
    optionSeller: 1,
  });

  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (
    e: React.MouseEvent,
    product: {
      _id: string;
      name: string;
      sellingUnitprice: number;
      listedUnitprice?: number;
      thumbnail?: { path?: string };
      slug: string;
    },
  ) => {
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

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-10 w-96 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="mb-10 text-center text-2xl font-bold text-primary md:mb-12 md:text-3xl lg:text-4xl">
          Chúng tôi là Lamin - Đồng hành cùng cha mẹ trong
          <br />
          hành trình nuôi dưỡng chiều cao tối ưu cho con
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map(product => (
            <Link
              key={product._id}
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
                      onClick={e => handleAddToCart(e, product)}>
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
          ))}
        </div>
      </div>
    </section>
  );
}
