import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CartItems } from './CartItems';
import { CartSummary } from './CartSummary';

import { useDonGioHangCu } from '../hooks/useDonGioHangCu';

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

  // Bỏ khỏi giỏ những món gian hàng s7 không còn bán — chủ yếu là giỏ cũ mang id của backend trước khi
  // chuyển nguồn. Báo cho khách chứ KHÔNG bỏ im lặng: hàng tự biến mất khỏi giỏ còn khó hiểu hơn là một
  // thông báo lỗi khi bấm đặt.
  //
  // Hiện thành DẢI THÔNG BÁO NGAY TRONG TRANG, không dùng `toast`: đã thử tay 2026-08-17 và toast không
  // hiện (ToastViewport có mount nhưng rỗng, không có lỗi nào ở console — chưa lần ra nguyên nhân). Dải
  // thông báo tại chỗ còn đúng hơn với việc này: nó nằm ngay cạnh giỏ hàng và không tự tắt sau vài giây,
  // nên khách quay lại tab sau đó vẫn đọc được vì sao món của mình biến mất.
  const [daBoKhoiGio, setDaBoKhoiGio] = useState<string[]>([]);

  // Hook báo TỪNG món (nó xoá dần, xem chú thích trong hook) → cộng dồn để dải thông báo kể đủ tên.
  // Dùng hàm cập nhật, không phải `[...daBoKhoiGio, ten]`: các lần báo nối nhau rất nhanh, đọc state cũ từ
  // closure là mất tên món trước — đúng cái bẫy vừa gặp ở `removeItem`.
  useDonGioHangCu(items, removeItem, ten => setDaBoKhoiGio(truoc => [...truoc, ten]));

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
    <>
      {daBoKhoiGio.length > 0 && (
        <div
          className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status">
          <span className="font-medium">
            {daBoKhoiGio.length === 1
              ? 'Một sản phẩm đã được bỏ khỏi giỏ hàng'
              : `${daBoKhoiGio.length} sản phẩm đã được bỏ khỏi giỏ hàng`}
          </span>
          <span className="block mt-1">
            {daBoKhoiGio.join(', ')} hiện không còn bán. Mời bạn chọn sản phẩm khác.
          </span>
        </div>
      )}

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
    </>
  );
}
