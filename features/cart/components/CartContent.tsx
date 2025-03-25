'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { useCart } from '../hooks/useCart';

import { CartItems } from './CartItems';
import { CartSummary } from './CartSummary';
import { useAuth } from '@/hooks';
import { useToast } from '@/components/ui/use-toast';

export function CartContent() {
  const { items, updateQuantity, removeItem, updateUnit } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [items]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Đăng nhập cần thiết",
        description: "Vui lòng đăng nhập để tiếp tục thanh toán",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedItems.length === 0) {
      toast({
        title: "Chưa chọn sản phẩm",
        description: "Vui lòng chọn ít nhất một sản phẩm để thanh toán",
        variant: "destructive",
      });
      return;
    }
    
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        className="inline-flex items-center text-blue-600 mb-6 hover:underline decoration-transparent"
        href="/">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Tiếp tục mua sắm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CartItems
            items={items}
            selectedItems={selectedItems}
            onRemoveItem={removeItem}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onUpdateQuantity={updateQuantity}
            onUpdateUnit={updateUnit}
          />
        </div>
        <div>
          <CartSummary
            items={items.filter(item => selectedItems.includes(item.id))}
            selectedItems={selectedItems}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
