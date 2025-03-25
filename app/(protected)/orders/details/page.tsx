'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CircleIcon, QuestionMarkIcon } from '@/components/icons';
import { formatCurrency } from '@/utils/format';
import {
  getPaymentMethodIcon,
  getPaymentMethodText,
} from '@/features/checkout/utils/paymentMethods';
import { useOrder } from '@/contexts/OrderContext';

export default function OrderInfo() {
  const router = useRouter();
  const { orderInfo } = useOrder();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderStatus, setOrderStatus] = useState(1); // 0: Đặt hàng, 1: Xử lý đơn, 2: Đang giao, 3: Nhận hàng
  const [paymentMethodText, setPaymentMethodText] = useState('');
  const [paymentMethodIcon, setPaymentMethodIcon] = useState('');

  // Get expected delivery date (next day)
  const deliveryDate = new Date(Date.now() + 86400000).toLocaleDateString(
    'vi-VN',
  );

  useEffect(() => {
    // If no order info in context, redirect back to cart
    if (!orderInfo) {
      router.push('/cart');

      return;
    }

    // Get payment method text and icon using utility functions
    setPaymentMethodText(getPaymentMethodText(orderInfo.paymentMethod));
    setPaymentMethodIcon(getPaymentMethodIcon(orderInfo.paymentMethod));
  }, [orderInfo, router]);

  // If no order info, show loading or redirect
  if (!orderInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate total savings and final price using the values in context
  const directDiscountValue = Number(orderInfo.directDiscount) || 0;
  const pointsDiscountValue = Number(orderInfo.pointsDiscount) || 0;
  const voucherDiscountAmount = Number(orderInfo.voucherDiscount) || 0;
  const shippingFeeValue = Number(orderInfo.shippingFee) || 0;

  // The subtotal is the pre-discount total (from the API response)
  const subtotalValue = Number(orderInfo.subtotal) || 0;

  // Use savedAmount from context or calculate it from the individual discount components
  const totalSavings = orderInfo.savedAmount
    ? Number(orderInfo.savedAmount)
    : directDiscountValue + pointsDiscountValue + voucherDiscountAmount;

  // The total is the final amount after discounts
  const finalPrice = Number(orderInfo.total) || 0;

  // Format date for display
  const orderDate = orderInfo.dateInvoice
    ? new Date(orderInfo.dateInvoice).toLocaleDateString('vi-VN')
    : deliveryDate;

  // Expected delivery time (next day from order date)
  const deliveryTime = orderInfo.dateInvoice
    ? new Date(
        new Date(orderInfo.dateInvoice).getTime() + 86400000,
      ).toLocaleDateString('vi-VN')
    : deliveryDate;

  return (
    <div className="container mx-auto px-4 md:px-10 my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Đơn hàng {orderDate}</h2>
            <CircleIcon fill="#B9C0D4" height={6} width={6} />
            <p className="text-sm text-gray-600">Giao hàng tận nơi</p>

            <CircleIcon fill="#B9C0D4" height={6} width={6} />
            <p className="text-sm text-gray-600">
              #{orderInfo.sign || '2742456'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CircleIcon fill="#FEC430" height={6} width={6} />
            <span className="text-yellow-500 font-medium">Đang xử lý</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="">
            <div className="flex items-center justify-between ml-3 mb-4 w-20">
              {[0, 1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${orderStatus >= step ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {orderStatus > step ? '✔' : ''}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-40 h-1 ${orderStatus > step ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center text-sm text-grayscale-50 mb-2 gap-[120px]">
              <span>Đặt hàng</span>
              <span>Xử lý đơn</span>
              <span>Đang giao</span>
              <span>Nhận hàng</span>
            </div>
            <div className="flex text-xs items-center border-b pb-2 mb-2 gap-10">
              <p className="text-sm text-gray-600">
                {orderInfo.dateInvoice
                  ? new Date(orderInfo.dateInvoice).toLocaleTimeString() +
                    ', ' +
                    orderDate
                  : currentTime.toLocaleTimeString() +
                    ', ' +
                    currentTime.toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sm text-gray-600">
                {orderInfo.dateInvoice
                  ? new Date(orderInfo.dateInvoice).toLocaleTimeString() +
                    ', ' +
                    orderDate
                  : currentTime.toLocaleTimeString() +
                    ', ' +
                    currentTime.toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sm text-gray-600">Chưa xác định</p>
              <p className="text-sm text-gray-600">Chưa xác định</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Dự kiến giao hàng:{' '}
            <strong>08:00 - 09:00 ngày {deliveryTime}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Nhà thuốc Lamin LC HNI 115 Nguyễn Hoàng Tôn đã tiếp nhận đơn hàng.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Thông tin người nhận</p>
            <p className="text-sm text-gray-600">
              {orderInfo.customerName || 'Không xác định'}
            </p>
            <p className="text-sm text-gray-600">
              {orderInfo.buyerPhone || 'Không xác định'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Nhận hàng tại</p>
            <p className="text-sm text-gray-600">
              {orderInfo.recipientAddress ||
                'N04B-T1, Chung cư Đoàn Ngoại Giao, P. Xuân Tảo, Q. Bắc Từ Liêm, Hà Nội'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Điểm bán xử lý đơn</p>
            <p className="text-sm text-gray-600">
              Nhà thuốc Lamin LC HNI 115 Nguyễn Hoàng Tôn
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-base font-semibold text-grayscale-90 mb-6">
          Thông tin thanh toán
        </h3>
        <div className="border-b-[1px] pb-4">
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Tổng giá trị đơn hàng</span>
            <span className="text-base font-medium text-grayscale-90">
              {formatCurrency(subtotalValue)}
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Phiếu giảm giá trực tiếp: </span>
            <span className="text-base font-medium text-grayscale-90">
              -{formatCurrency(directDiscountValue)}
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <div className="flex items-center gap-1">
              Giảm giá voucher <QuestionMarkIcon height={15} width={15} />
            </div>
            <span className="text-base font-medium text-grayscale-90">
              -{formatCurrency(voucherDiscountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Trừ tích điểm </span>
            <span className="text-base font-medium text-grayscale-90">
              -{formatCurrency(pointsDiscountValue)}
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50">
            <span>Phí vận chuyển </span>
            <span className="text-base font-medium text-grayscale-90">
              {shippingFeeValue > 0
                ? formatCurrency(shippingFeeValue)
                : 'Miễn phí'}
            </span>
          </div>
        </div>
        <div className="border-b-[1px] pb-4 pt-4">
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Điểm thưởng </span>
            <div className="flex justify-between items-center gap-1">
              <Image
                alt="QR Code"
                height={20}
                src="/icons/point-icon.svg"
                width={20}
              />
              <span className="text-base font-medium text-[#F79009]">
                {orderInfo.loyaltyPoints
                  ? `${orderInfo.loyaltyPoints} điểm`
                  : '0 điểm'}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50">
            <span>Tiết kiệm được </span>
            <span className="text-base font-medium text-[#F79009]">
              {formatCurrency(totalSavings)}
            </span>
          </div>
        </div>
        <div className="border-b-[1px] pb-4 pt-4">
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span className={'text-[18px] font-semibold text-grayscale-90'}>
              Thành tiền
            </span>
            <span className="text-base font-semibold text-primary-50">
              {formatCurrency(finalPrice)}
            </span>
          </div>
        </div>
        <div className=" mt-2">
          <span className="flex justify-between text-base font-normal text-grayscale-50 mb-2">
            Phương thức thanh toán
          </span>
          <div className="flex gap-2 items-center mb-2">
            <Image
              alt="Payment Method"
              height={22}
              src={paymentMethodIcon || '/icons/qr-code-icon.svg'}
              width={22}
            />
            <p className="text-grayscale-90 font-medium text-sm">
              {paymentMethodText || 'Thanh toán bằng chuyển khoản (QR Code)'}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              alt="Success"
              height={16}
              src="/icons/success-icon.svg"
              width={16}
            />
            <p className="text-[#51B848] font-medium text-sm">
              {orderInfo.paymentMethod === '1'
                ? 'Thanh toán khi nhận hàng'
                : 'Đã thanh toán'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
