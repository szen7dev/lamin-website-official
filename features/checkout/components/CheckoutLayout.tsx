'use client';

import type { CreateOrderData } from '../api/createOrder';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCreateOrder } from '../hooks/useCreateOrder';

import {
  CheckoutForm,
  CheckoutFormRef,
  CheckoutFormSubmission,
} from './CheckoutForm';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CartItems } from '@/features/cart/components/CartItems';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/hooks/useCart';

const breadcrumbItems = [
  { label: 'Giỏ hàng', href: '/cart' },
  { label: 'Thanh toán', href: '/checkout' },
];

export function CheckoutLayout() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, updateUnit } = useCart();
  const { createOrder, isCreating, isError, error } = useCreateOrder();

  // Cast items to satisfy the component props
  const cartItems = items.map(item => ({
    ...item,
    image: item.image || '/placeholder.svg',
  }));

  const [selectedItems, setSelectedItems] = useState<string[]>(
    cartItems.map(item => item.id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<CheckoutFormRef>(null);

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

  const handleSubmit = (formData: CheckoutFormSubmission) => {
    setIsSubmitting(true);

    // Get selected items data
    const selectedProducts = cartItems.filter(item =>
      selectedItems.includes(item.id),
    );

    // Calculate price totals directly
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Calculate direct discount (from original price)
    const directDiscount = selectedProducts.reduce((sum, item) => {
      if (!item.originalPrice) return sum;

      return sum + (item.originalPrice - item.price) * item.quantity;
    }, 0);

    // Fixed shipping fee
    const shippingFee = 15000;

    // Discounts - for now just use static values or 0
    const voucherDiscount = 0; // This would come from applied vouchers
    const pointsDiscount = 0; // This would come from points redemption

    // Total saved amount
    const savedAmount = directDiscount + voucherDiscount + pointsDiscount;

    // Final price
    const total = Math.max(0, subtotal - savedAmount + shippingFee);

    // Format according to the required API structure
    const submitData: CreateOrderData = {
      optionSeller: 1,
      customerID: '6447bd863e99e50011d47d82', // Could be replaced with actual user ID from auth
      outin: 1,
      type: 5,
      paymentMethod: formData.paymentMethod,
      voucherID: '67bb18449d56a8001285345a',
      name: `Đơn hàng ${formData.customerName}`,
      note: formData.note || '',
      // Use the calculated values
      total: total.toString(),
      discount: directDiscount.toString(),
      salesoff: voucherDiscount.toString(),
      credit: pointsDiscount.toString(),
      shippingFee: shippingFee.toString(),
      recipientAddress: formData.address,
      areaID: formData.ward,
      products: selectedProducts.map(item => ({
        productID: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        listedUnitprice: item.originalPrice || item.price,
        name: item.name,
        note: '',
      })),
    };

    // Pass more detailed information to the confirmation page
    const searchParams = new URLSearchParams({
      total: total.toString(),
      orderId: `ORD-${Date.now()}`, // Generate a temporary order ID
      paymentMethod: formData.paymentMethod.toString(),
      customerName: formData.customerName,
      items: selectedItems.length.toString(),
    });
    
    router.push(`/checkout/confirmation?${searchParams.toString()}`);

    console.log('Order data:', submitData);

    // Call the API to create the order
    // createOrder(submitData, {
    //   onSuccess: data => {
    //     setIsSubmitting(false);
    //     toast({
    //       title: 'Đặt hàng thành công',
    //       description: 'Đơn hàng của bạn đã được đặt thành công!',
    //       variant: 'default',
    //     });
    //     router.push('/checkout/confirmation');
    //   },
    //   onError: error => {
    //     setIsSubmitting(false);
    //     toast({
    //       title: 'Đặt hàng thất bại',
    //       description: 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.',
    //       variant: 'destructive',
    //     });
    //     console.error('Order submission error:', error);
    //   },
    // });
  };

  // Function to trigger form submission from CartSummary
  const handleCheckoutClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={breadcrumbItems} />

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
            onSubmit={handleSubmit}
          />
        </div>

        <div>
          <div className="sticky top-8">
            <CartSummary
              items={cartItems.filter(item => selectedItems.includes(item.id))}
              selectedItems={selectedItems}
              onCheckout={handleCheckoutClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
