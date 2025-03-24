'use client';

import { useState } from 'react';

import { CheckoutForm } from './CheckoutForm';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { CartItems } from '@/features/cart/components/CartItems';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/contexts/CartContext';

export function CheckoutLayout() {
  const { items } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    items.map(item => item.id),
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(itemId => itemId !== id),
    );
  };

  return (
    <div className="container mx-auto py-8">
      <DynamicBreadcrumb />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow">
            <CartItems
              readOnly
              items={items}
              selectedItems={selectedItems}
              onRemoveItem={() => {}}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={() => {}}
            />
          </div>

          <CheckoutForm />
        </div>

        <div>
          <div className="sticky top-8">
            <CartSummary
              items={items.filter(item => selectedItems.includes(item.id))}
              selectedItems={selectedItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
