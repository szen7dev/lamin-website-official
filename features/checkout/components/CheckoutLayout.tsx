'use client';

import type { CreateOrderData } from '../api/createOrder';
import type { Voucher } from '@/features/cart/types/voucherTypes';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCreateOrder } from '../hooks/useCreateOrder';

import {
  CheckoutForm,
  CheckoutFormRef,
  CheckoutFormSubmission,
} from './CheckoutForm';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { useOrder } from '@/contexts/OrderContext';
import { CartItems } from '@/features/cart/components/CartItems';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/hooks';
import { useToast } from '@/components/ui/use-toast';

export function CheckoutLayout() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, updateUnit } = useCart();
  const { createOrder } = useCreateOrder();
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

  const handleVoucherSelect = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
  };

  const handleFormSubmission = (values: CheckoutFormSubmission) => {
    // Store the form values for future use
    setFormValues(values);

    // Instead of calling handleSubmit which depends on the state update,
    // directly process the submission with the provided values
    processSubmission(values);
  };

  // New function that processes submission with provided form values
  const processSubmission = async (formValues: CheckoutFormSubmission) => {
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

      const submitData: CreateOrderData = {
        optionSeller: 1,
        customerID: user?.id || '',
        outin: 1,
        type: 5,
        paymentMethod: formValues.paymentMethod,
        voucherID: voucherId,
        name: `Đơn hàng ${formValues.customerName || 'Khách hàng'}`,
        note: formValues.note || '',
        total: totalPrice.toString(),
        salesoff: items
          .reduce(
            (sum, item) => sum + (item.originalPrice - item.price || 0),
            0,
          )
          .toString(),
        offer: voucherDiscount.toString(),
        credit: pointsDiscount.toString(), // Use the pointsDiscount here
        shippingFee: shippingFee.toString(),
        recipientAddress: formValues.address || '123 Main St, Anytown',
        areaID: formValues.ward || '',
        buyerName: formValues.customerName || 'Khách hàng',
        buyerPhone: formValues.customerPhone || '1234567890',
        buyerEmail: formValues.customerEmail || 'customer@example.com',
        recipientName:
          formValues.receiverName || formValues.customerName || 'Khách hàng',
        recipientPhone:
          formValues.receiverPhone || formValues.customerPhone || '1234567890',
        products: selectedProducts.map(product => ({
          productID: product.id,
          quantity: product.quantity,
          unitPrice: product.price,
          listedUnitprice: product.originalPrice || product.price,
          name: product.name,
          note: '',
        })),
      };

      // Use the mutation function from useCreateOrder
      await new Promise<void>((resolve, reject) => {
        createOrder(submitData, {
          onSuccess: response => {
            // Add proper error handling for the response
            const data = response || {};

            setIsSubmitting(false);
            toast({
              title: 'Đặt hàng thành công',
              description: 'Đơn hàng của bạn đã được đặt thành công!',
            });

            // Clear cart
            selectedItems.forEach(itemId => {
              removeItem(itemId);
            });

            // Store order information in context instead of URL parameters
            const orderInfo = {
              orderId: data?._id || `ORD-${Date.now()}`,
              sign: data?.sign,
              customerName: data?.buyerName || submitData.buyerName,
              paymentMethod: data?.paymentMethod || submitData.paymentMethod,
              total: data?.total?.toString() || submitData.total,
              subtotal: subtotal.toString(),
              directDiscount: submitData.salesoff,
              voucherDiscount: submitData.offer || data.offer,
              pointsDiscount: pointsDiscount.toString(),
              shippingFee:
                data?.shippingFee?.toString() || submitData.shippingFee,
              savedAmount: (
                parseFloat(submitData.salesoff) +
                parseFloat(submitData.offer || '0') +
                pointsDiscount
              ).toString(),
              dateInvoice: data?.createdAt || new Date().toISOString(),
              buyerPhone: data?.buyerPhone || submitData.buyerPhone,
              recipientAddress:
                data?.recipientAddress || submitData.recipientAddress,
              funda: data?.funda || '',
              loyaltyPoints: data?.loyaltyPoints?.toString() || '0',
              voucherCode: voucherCode || '',
            };

            // Set the order info in context
            setOrderInfo(orderInfo);

            // Redirect based on payment method - now without query parameters
            if (submitData.paymentMethod === '1') {
              router.push('/checkout/success');
            } else {
              router.push('/checkout/confirmation');
            }

            resolve();
          },
          onError: error => {
            setIsSubmitting(false);
            toast({
              title: 'Đặt hàng thất bại',
              description: error.message || 'Đã xảy ra lỗi khi đặt hàng.',
              variant: 'destructive',
            });
            reject(error);
          },
        });
      });
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
