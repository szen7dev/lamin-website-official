'use client';

import type { Voucher } from '@/features/cart/types/voucherTypes';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createStoreOrder } from '../api/createStoreOrder';
import { getPaymentMethodText } from '../utils/paymentMethods';

import {
  CheckoutForm,
  CheckoutFormRef,
  CheckoutFormSubmission,
} from './CheckoutForm';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { useOrder } from '@/contexts/OrderContext';
import { CartItems } from '@/features/cart/components/CartItems';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/contexts/CartContext';
import { useAuth } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useGetContactByPhone } from '@/features/contact/hooks/useGetContactByPhone';
import {
  clearStoreCheckout,
  readStoreCheckout,
} from '@/features/cart/utils/storeCheckout';

export function CheckoutLayout() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, updateUnit } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { setOrderInfo } = useOrder();

  // Cast items to satisfy the component props
  const cartItems = items.map(item => ({
    ...item,
    image: item.image || '/placeholder.svg',
  }));

  const [selectedItems, setSelectedItems] = useState<string[]>(
    cartItems.map(item => item.id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [pointsDiscount, setPointsDiscount] = useState<number>(0);
  const [formValues, setFormValues] = useState<CheckoutFormSubmission | null>(
    null,
  );
  const [phoneNumberToLookup, setPhoneNumberToLookup] = useState<string>('');
  const formRef = useRef<CheckoutFormRef>(null);

  // Contact lookup hook - initialized with empty string, only enabled when we need it
  const { data: contactData, isLoading: isContactLoading } =
    useGetContactByPhone({
      phone: phoneNumberToLookup,
    });

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cartItems.map(item => item.id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(itemId => itemId !== id),
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleUpdateUnit = (id: string, unit: string) => {
    updateUnit(id, unit);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleVoucherSelect = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
  };

  const handleFormSubmission = (values: CheckoutFormSubmission) => {
    // Store the form values for future use
    setFormValues(values);

    // If user is not logged in and we have a phone number, try to find the contact first
    if (!user?.id && values.customerPhone) {
      setPhoneNumberToLookup(values.customerPhone);

      // We'll use the useEffect to continue processing after the contactData is available
      return;
    }

    // Otherwise, proceed with submission directly
    processSubmission(values);
  };

  // Effect to handle contact lookup and continue with order submission
  useEffect(() => {
    // Only proceed if we're looking up a phone number and we have a form submission pending
    if (phoneNumberToLookup && formValues && !isContactLoading) {
      if (contactData) {
        // Contact found, proceed with the submission
        processSubmission(formValues, contactData.contactID);
      } else {
        // No contact found, proceed without a contactID
        processSubmission(formValues);
      }

      // Reset the lookup phone number
      setPhoneNumberToLookup('');
    }
  }, [phoneNumberToLookup, contactData, isContactLoading, formValues]);

  // Modified to accept an optional contactID parameter
  const processSubmission = async (
    formValues: CheckoutFormSubmission,
    contactID?: string,
  ) => {
    setIsSubmitting(true);
    try {
      // Filter products: Only include products which are selected in the cart
      const selectedProducts = cartItems.filter(product =>
        selectedItems.includes(product.id),
      );
      // Calculate subtotal
      const subtotal = selectedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      // Calculate direct discounts
      const directDiscount = selectedProducts.reduce((sum, item) => {
        if (!item.originalPrice) return sum;

        return sum + (item.originalPrice - item.price) * item.quantity;
      }, 0);
      // Shipping fee
      const shippingFee = 0; // assuming a shipping fee of 30,000 VND
      let voucherDiscount = 0;
      let voucherCode = '';
      let voucherId = '';

      if (selectedVoucher) {
        voucherCode = selectedVoucher.name || '';
        voucherId = selectedVoucher._id || '';
        if (selectedVoucher.salesoffRate > 0) {
          voucherDiscount =
            (subtotal - directDiscount) * (selectedVoucher.salesoffRate / 100);
        } else {
          voucherDiscount = selectedVoucher.salesoffAmount;
        }
      }

      // Total price
      const totalPrice =
        subtotal -
        directDiscount -
        voucherDiscount -
        pointsDiscount +
        shippingFee;

      // ─── GỬI SANG s7-data-hub ────────────────────────────────────────────────────────────────────
      // Thay cho `POST /api/store/orders/insert-full` bên api.trixgo.com (chốt của chủ dự án 2026-08-17).
      //
      // ⚠️ Kết quả là ĐƠN CHỜ DUYỆT, KHÔNG phải đơn đã chốt. Sale Admin xem rồi mới lên đơn và giao. Câu
      // chữ dưới đây cố ý nói "đã nhận yêu cầu đặt hàng" chứ không phải "đặt hàng thành công" như trước —
      // khách tưởng mua xong mà hàng không tới là mất khách thật.
      //
      // KHÔNG gửi tiền: s7-data-hub tra lại giá từ `products.sale_price` và bỏ qua mọi con số tiền từ
      // trình duyệt. Mọi tính toán ở trên chỉ để HIỂN THỊ cho khách ước lượng.
      const saved = readStoreCheckout();

      // Những thứ luồng cũ có mà đơn báo không có cột riêng (email, phường/xã, hình thức thanh toán, tích
      // điểm) đi vào ghi chú thay vì bị bỏ đi — Sale Admin cần chúng lúc lên đơn, và mất dữ liệu khách đã
      // gõ là lỗi không sửa lại được.
      const note = [
        formValues.note || '',
        formValues.customerEmail ? `Email: ${formValues.customerEmail}` : '',
        formValues.ward ? `Khu vực: ${formValues.ward}` : '',
        `Thanh toán: ${getPaymentMethodText(formValues.paymentMethod)}`,
        pointsDiscount > 0 ? `Khách muốn dùng ${pointsDiscount} điểm tích luỹ` : '',
        formValues.receiverName && formValues.receiverName !== formValues.customerName
          ? `Người nhận: ${formValues.receiverName} - ${formValues.receiverPhone || ''}`
          : '',
      ].filter(Boolean).join(' · ');

      const intake = await createStoreOrder({
        customer_name: formValues.customerName || 'Khách hàng',
        customer_phone: formValues.customerPhone || '',
        ship_address: formValues.address || '',
        items: selectedProducts.map(product => ({
          // Gửi CẢ HAI: `sign` là khoá nối thật (id hai hệ thống khác nhau), còn `product_id` để phòng khi
          // sau này danh mục cũng chuyển hẳn sang s7 — lúc đó id trùng nhau và nó thành đường chính xác
          // nhất. s7 ưu tiên `product_id`, không khớp thì rơi sang `sign`.
          product_id: product.id,
          sign: product.sign,
          qty: product.quantity,
        })),
        note,
        // Mã ưu đãi khách đã chọn ở trang giỏ hàng. Server kiểm lại lần nữa và TỪ CHỐI cả đơn nếu mã hỏng
        // — khách đã nhìn thấy số tiền được giảm nên không được lặng lẽ bỏ qua.
        voucher_code: saved.voucher?.code || undefined,
      });

      setIsSubmitting(false);
      toast({
        title: 'Đã nhận yêu cầu đặt hàng',
        description:
          'Lamin sẽ gọi lại để xác nhận đơn và thông tin giao hàng trong thời gian sớm nhất.',
      });

      // Dọn giỏ + xoá ưu đãi đã chọn của lần mua này.
      selectedItems.forEach(itemId => {
        removeItem(itemId);
      });
      clearStoreCheckout();

      setOrderInfo({
        orderId: intake.id,
        total: totalPrice,
        subtotal: subtotal,
        directDiscount: directDiscount,
        voucherDiscount: voucherDiscount,
        pointsDiscount: pointsDiscount,
        shippingFee: shippingFee,
        savedAmount: directDiscount + voucherDiscount + pointsDiscount,
        loyaltyPoints: pointsDiscount,
      });

      router.push('/checkout/success');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: 'Đặt hàng thất bại',
        description: 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  // Function to trigger form submission from CartSummary
  const handleCheckoutClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <DynamicBreadcrumb />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow">
            <CartItems
              items={cartItems}
              readOnly={isSubmitting}
              selectedItems={selectedItems}
              onRemoveItem={handleRemoveItem}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateUnit={handleUpdateUnit}
            />
          </div>

          <CheckoutForm
            ref={formRef}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmission}
          />
        </div>

        <div>
          <div className="sticky top-8">
            <CartSummary
              items={cartItems.filter(item => selectedItems.includes(item.id))}
              selectedItems={selectedItems}
              onCheckout={handleCheckoutClick}
              onPointsDiscountChange={setPointsDiscount}
              onVoucherSelect={handleVoucherSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
