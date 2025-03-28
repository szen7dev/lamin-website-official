'use client';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  CircleIcon,
  PointCoinIcon,
  QuestionMarkIcon,
  SuccessIcon,
} from '@/components/icons';
import { formatCurrency, formattedDeliveryDate } from '@/utils/format';
import {
  getPaymentMethodIcon,
  getPaymentMethodText,
} from '@/features/checkout/utils/paymentMethods';
import { useOrder } from '@/contexts/OrderContext';
import { useGetOrderById } from '@/features/checkout/hooks/useGetOrderById';
import Loading from '@/app/loading';

export default function OrderInfo() {
  const router = useRouter();
  const { orderInfo } = useOrder();
  const {
    order,
    isLoading: isLoadingOrder,
    error: loadingOrderError,
  } = useGetOrderById(orderInfo?.orderId || '');
  const [orderStatus, setOrderStatus] = useState(1); // 0: Đặt hàng, 1: Xử lý đơn, 2: Đang giao, 3: Nhận hàng
  const [paymentMethodText, setPaymentMethodText] = useState('');
  const [paymentMethodIcon, setPaymentMethodIcon] = useState('');

  useEffect(() => {
    // If no order info in context, redirect back to cart
    if (!orderInfo) {
      router.push('/cart');

      return;
    }

    // Get payment method text and icon using utility functions
    setPaymentMethodText(getPaymentMethodText(order.paymentMethod));
    setPaymentMethodIcon(getPaymentMethodIcon(order.paymentMethod));
  }, [orderInfo, router]);

  // If no order info, show loading or redirect
  if (!orderInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const totalSavings = order.salesoff + order.offer;

  // The total is the final amount after discounts
  const finalPrice = Number(orderInfo.total) || 0;

  const orderCreatedAt = new Date(order.createAt);

  const orderProcessingTime = order.processingTime
    ? new Date(order.processingTime)
    : null;
  const orderDeliveryStartTime = order.deliveryStartTime
    ? new Date(order.deliveryStartTime)
    : null;
  const orderDeliveredTime = order.deliveredTime
    ? new Date(order.deliveredTime)
    : null;

  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto px-4 md:px-10 my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                Đơn hàng {orderCreatedAt.toLocaleDateString()}
              </h2>
              <CircleIcon fill="#B9C0D4" height={6} width={6} />
              <p className="text-sm text-gray-600">Giao hàng tận nơi</p>

              <CircleIcon fill="#B9C0D4" height={6} width={6} />
              <p className="text-sm text-gray-600">
                #{order.sign || '2742456'}
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${order.status >= step ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {order.status > step ? '✔' : ''}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-40 h-1 ${order.status > step ? 'bg-green-500' : 'bg-gray-300'}`}
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
              <div className="flex justify-between items-center text-xs border-b pb-2 mb-2">
                {orderCreatedAt ? (
                  <p className="text-sm text-gray-600 w-[120px] text-left">
                    {orderCreatedAt.getHours() + 1}:00,{' '}
                    {orderCreatedAt.getDate()}/{orderCreatedAt.getMonth() + 1}/
                    {orderCreatedAt.getFullYear()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 w-[120px] text-left">
                    Chưa xác định
                  </p>
                )}
                {orderProcessingTime ? (
                  <p className="text-sm text-gray-600 w-[120px] text-center">
                    {orderProcessingTime.getHours()}:00,{' '}
                    {orderProcessingTime.getDate()}/
                    {orderProcessingTime.getMonth()}/
                    {orderProcessingTime.getFullYear()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 w-[120px] text-center">
                    Chưa xác định
                  </p>
                )}
                {orderDeliveryStartTime ? (
                  <p className="text-sm text-gray-600 w-[120px] text-center">
                    {orderDeliveryStartTime.getHours()}:00,{' '}
                    {orderDeliveryStartTime.getDate()}/
                    {orderDeliveryStartTime.getMonth()}/
                    {orderDeliveryStartTime.getFullYear()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 w-[120px] text-center">
                    Chưa xác định
                  </p>
                )}
                {orderDeliveredTime ? (
                  <p className="text-sm text-gray-600 w-[120px] text-right">
                    {orderDeliveredTime.getHours()}:00,{' '}
                    {orderDeliveredTime.getDate()}/
                    {orderDeliveredTime.getMonth()}/
                    {orderDeliveredTime.getFullYear()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 w-[120px] text-right">
                    Chưa xác định
                  </p>
                )}
              </div>
            </div>
            {order.deliveryStartETA && order.deliveryEndETA && (
              <div className="text-grayscale-50 text-base font-medium">
                <span>Dự kiến giao hàng:</span>
                <p className="text-grayscale-90 font-medium text-base  mb-4 ">
                  Từ{' '}
                  {formattedDeliveryDate(
                    order.deliveryStartETA,
                    order.deliveryEndETA,
                  )}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              {order.funda.name} đã tiếp nhận đơn hàng.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 font-semibold">
                Thông tin người nhận
              </p>
              <p className="text-sm text-gray-600">
                {order.buyerName || 'Không xác định'}
              </p>
              <p className="text-sm text-gray-600">
                {order.buyerPhone || 'Không xác định'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 font-semibold">Nhận hàng tại</p>
              <p className="text-sm text-gray-600">
                {order.recipientAddress ||
                  'N04B-T1, Chung cư Đoàn Ngoại Giao, P. Xuân Tảo, Q. Bắc Từ Liêm, Hà Nội'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 font-semibold">Điểm bán xử lý đơn</p>
              <p className="text-sm text-gray-600">{order.funda.name}</p>
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
                {formatCurrency(order.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
              <span>Phiếu giảm giá trực tiếp: </span>
              <span className="text-base font-medium text-grayscale-90">
                {formatCurrency(order.salesoff || 0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
              <div className="flex items-center gap-1">
                Giảm giá voucher <QuestionMarkIcon height={15} width={15} />
              </div>
              <span className="text-base font-medium text-grayscale-90">
                {formatCurrency(order.offer || 0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
              <span>Trừ tích điểm </span>
              <span className="text-base font-medium text-grayscale-90">
                {formatCurrency(order.credit || 0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-normal text-grayscale-50">
              <span>Phí vận chuyển </span>
              <span className="text-base font-medium text-grayscale-90">
                {order.totalShippingFee > 0
                  ? formatCurrency(order.totalShippingFee)
                  : 'Miễn phí'}
              </span>
            </div>
          </div>
          <div className="border-b-[1px] pb-4 pt-4">
            <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
              <span>Điểm thưởng </span>
              <div className="flex justify-between items-center gap-1">
                <PointCoinIcon height={20} width={20} />
                <span className="text-base font-medium text-[#F79009]">
                  {order.amount
                    ? `${Math.round(order.amount / 100)} điểm`
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
            {paymentMethodIcon && paymentMethodText && (
              <div className="flex gap-2 items-center mb-2">
                <Image
                  alt="Payment Method"
                  height={22}
                  src={paymentMethodIcon}
                  width={22}
                />
                <p className="text-grayscale-90 font-medium text-sm">
                  {paymentMethodText ||
                    'Thanh toán bằng chuyển khoản (QR Code)'}
                </p>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <SuccessIcon height={16} width={16} />
              <p className="text-[#51B848] font-medium text-sm">
                {order.paymentMethod === '1'
                  ? 'Thanh toán khi nhận hàng'
                  : 'Đã thanh toán'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
