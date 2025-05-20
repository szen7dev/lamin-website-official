'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { CartContent } from '@/features/cart/components/CartContent';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { useCart } from '@/features/cart/contexts/CartContext';

export default function CartPage() {
  const { items } = useCart();
  const isEmpty = !items || items.length === 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        className="inline-flex items-center text-blue-600 mb-6 hover:underline decoration-transparent"
        href="/">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Tiếp tục mua sắm
      </Link>
      {isEmpty ? <EmptyCart /> : <CartContent />}
    </div>
  );
}
