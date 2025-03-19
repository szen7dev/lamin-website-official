'use client';

import type { CartItem } from '@/features/cart/types';

import { CartItems } from '@/features/cart/components/CartItems';

interface CartItemsReadOnlyProps {
  items: CartItem[];
  selectedItems: string[];
}

export function CartItemsReadOnly({
  items = [],
  selectedItems = [],
}: CartItemsReadOnlyProps) {
  // Chỉ hiển thị, không cho phép thay đổi
  const handleNoOp = () => {};

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
      </div>
      {items.length > 0 ? (
        <CartItems
          items={items}
          readOnly={true}
          selectedItems={selectedItems}
          onRemoveItem={handleNoOp}
          onSelectAll={handleNoOp}
          onSelectItem={handleNoOp}
          onUpdateQuantity={handleNoOp}
          onUpdateUnit={handleNoOp}
        />
      ) : (
        <div className="p-6 text-center text-gray-500">
          Không có sản phẩm nào trong giỏ hàng
        </div>
      )}
    </div>
  );
}
