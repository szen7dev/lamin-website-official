import type { CartItem as CartItemType } from '@/features/cart/types';

import { default as NextImage } from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils';

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="p-4 flex gap-3 hover:bg-grayscale-5">
      <div className="relative h-16 w-16 flex-shrink-0">
        {item.image ? (
          <NextImage
            fill
            alt={item.name}
            className="object-cover rounded"
            sizes="64px"
            src={item.image}
          />
        ) : (
          <Skeleton className="h-full w-full rounded" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          className="text-sm text-grayscale-90 line-clamp-2 hover:text-primary decoration-transparent"
          href={{
            pathname: `/product/${item.slug}`,
            query: { goodsId: item.id },
          }}>
          {item.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-medium text-primary">
            {formatCurrency(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-grayscale-40 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          )}
          <span className="text-xs text-grayscale-40">
            x{item.quantity} {item.unit}
          </span>
        </div>
      </div>

      <button
        aria-label="Xóa sản phẩm"
        className="flex-shrink-0 p-1 text-error hover:text-error-60 transition-colors"
        onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
