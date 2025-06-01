import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CartItems } from './CartItems';
import { CartSummary } from './CartSummary';

import { useCart } from '@/features/cart/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export function CartContent() {
  const { items, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setSelectedItems(items.length > 0 ? items.map(item => item.id) : []);
  }, [items]);

  const selectedCartItems = useMemo(
    () => items.filter(item => selectedItems.includes(item.id)),
    [items, selectedItems],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedItems(checked ? items.map(item => item.id) : []);
    },
    [items],
  );

  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(itemId => itemId !== id),
    );
  }, []);

  const handleCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      toast({
        title: 'Chưa chọn sản phẩm',
        description: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán',
        variant: 'destructive',
      });

      return;
    }
    router.push('/checkout');
  }, [selectedItems, toast, router]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CartItems
          items={items}
          selectedItems={selectedItems}
          onRemoveItem={removeItem}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
        />
      </div>
      <div>
        <CartSummary
          items={selectedCartItems}
          selectedItems={selectedItems}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
