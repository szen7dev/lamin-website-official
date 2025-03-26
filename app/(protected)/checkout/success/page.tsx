'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getPaymentMethodIcon,
  getPaymentMethodText,
} from '@/features/checkout/utils/paymentMethods';
import { useOrder } from '@/contexts/OrderContext';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { orderInfo } = useOrder();

  console.log('orderInfo', orderInfo);

  const [paymentMethodText, setPaymentMethodText] = useState('');

  useEffect(() => {
    // If no order info in context, redirect back to cart
    if (!orderInfo) {
      router.push('/cart');

      return;
    }

    // Set the payment method text using the utility
    setPaymentMethodText(getPaymentMethodText(orderInfo.paymentMethod));
  }, [orderInfo, router]);

  // If no order info, show loading or redirect
  if (!orderInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Format the order date
  const orderDate = orderInfo.dateInvoice
    ? new Date(orderInfo.dateInvoice).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

  // Get next day for delivery estimate
  const deliveryDate = new Date(orderInfo.dateInvoice || new Date());

  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Handle view order details click
  const handleViewOrderDetails = () => {
    router.push('/orders/details');
  };

  // Handle go home click
  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center mx-auto pb-10">
      <div className="">
        <Image
          alt="QR Code"
          height={150}
          src="/images/success-checkout-img.svg"
          width={150}
        />
      </div>
      <div className="bg-white p-6 w-[500px] rounded-xl">
        <div className="mb-4 border-b-2 border-grayscale-10 pb-4 ">
          <h2 className="text-[22px] font-semibold text-primary-50">
            Đặt hàng thành công
          </h2>
          <p className="text-grayscale-50 text-base font-normal">
            Nhà thuốc Lamin 123G Thụy Khuê đã tiếp nhận đơn hàng
          </p>
        </div>
        <div className="rounded-lg">
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-grayscale-50 text-base font-medium">
                <span>Thời gian nhận hàng dự kiến:</span>
                <p className="text-grayscale-90 font-medium text-base  mb-4 ">
                  Từ 08:00 - 18:00, {formattedDeliveryDate}
                </p>
              </div>
              <div className="text-grayscale-50 text-base font-medium mb-4">
                <span>Phương thức thanh toán:</span>
                <div className="flex gap-2 items-center">
                  <Image
                    alt={`${getPaymentMethodText(orderInfo.paymentMethod)}`}
                    height={20}
                    src={`${getPaymentMethodIcon(orderInfo.paymentMethod)}`}
                    width={20}
                  />
                  <p className="text-grayscale-90 font-medium text-base">
                    {`${getPaymentMethodText(orderInfo.paymentMethod)}`}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    alt="Success"
                    height={20}
                    src="/icons/success-icon.svg"
                    width={20}
                  />
                  <p className="text-[#51B848] font-medium text-base">
                    Đã thanh toán
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-2xl hover:bg-blue-700 transition"
                onClick={handleViewOrderDetails}>
                Chi tiết đơn hàng
              </button>
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-2xl hover:bg-gray-300 transition"
                onClick={handleGoHome}>
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
