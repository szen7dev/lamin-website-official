'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/contexts/CartContext';
import { CartItem } from '@/features/cart/components/cart-dropdown/CartDropdownItem';

export function CartDropdown() {
  const { items, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-grayscale-40">Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg divide-y divide-grayscale-20">
      <div className="p-4">
        <h3 className="text-base font-semibold text-grayscale-90 text-center">
          Giỏ hàng
        </h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {items.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-grayscale-70">{items.length} sản phẩm</p>
        <Button
          asChild
          className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 decoration-transparent">
          <Link href="/cart">Xem giỏ hàng</Link>
        </Button>
      </div>
    </div>
  );
}
