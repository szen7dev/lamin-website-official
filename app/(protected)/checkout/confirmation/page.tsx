'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

import { DownloadIcon } from '@/components/icons';
import { formatCurrency } from '@/utils/format';
import { apiClient } from '@/services';

enum PaymentStatusCode {
  Pending = -2,
  Success = 0,
  Failed = 1,
  Expired = -1,
}

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Get all order information from URL params
  const [orderInfo, setOrderInfo] = useState({
    total: '',
    orderId: '',
    paymentMethod: '',
    customerName: '',
    items: '',
    qrData: '',
    bankAccount: '',
    bankAccountName: '',
    bankName: '',
    remark: '',
    txId: '',
  });

  // Function to poll payment status
  const pollPaymentStatus = async (txId: string) => {
    try {
      const { data } = await apiClient.get(`/api/payment/transactions/${txId}`);

      switch (data.status) {
        case PaymentStatusCode.Success:
          setPaymentStatus('success');
          router.push('/checkout/success');
          break;
        case PaymentStatusCode.Failed:
          setPaymentStatus('failed');
          router.push('/checkout/failed');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error polling payment status:', error);
    }
  };

  // Set up polling interval
  useEffect(() => {
    const txId = searchParams.get('txId');

    if (!txId) return;

    // Initial check
    pollPaymentStatus(txId);

    // Set up polling interval - every 5 seconds
    const pollingInterval = setInterval(() => {
      if (paymentStatus === 'pending') {
        pollPaymentStatus(txId);
      }
    }, 5000);

    // Cleanup interval
    return () => clearInterval(pollingInterval);
  }, [searchParams, paymentStatus]);

  // Function to handle QR code download
  const handleDownloadQR = () => {
    const qrImageUrl = '/images/qrcode-checkout.png';
    const link = document.createElement('a');

    link.href = qrImageUrl;
    link.download = `payment-qr-${orderInfo.orderId || '2632345'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Get all params
    const total = searchParams.get('total') || '';
    const orderId = searchParams.get('orderId') || '';
    const paymentMethod = searchParams.get('paymentMethod') || '';
    const customerName = searchParams.get('customerName') || '';
    const items = searchParams.get('items') || '';
    const qrData = searchParams.get('qrData') || '';
    const bankAccount = searchParams.get('bankAccount') || '';
    const bankAccountName = searchParams.get('bankAccountName') || '';
    const bankName = searchParams.get('bankName') || '';
    const remark = searchParams.get('remark') || '';
    const txId = searchParams.get('txId') || '';

    setOrderInfo({
      total,
      orderId,
      paymentMethod,
      customerName,
      items,
      qrData,
      bankAccount,
      bankAccountName,
      bankName,
      remark,
      txId,
    });
  }, [searchParams]);

  // Countdown timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Format countdown time
  const formatCountdown = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const { minutes, seconds } = formatCountdown();

  return (
    <div className="p-6">
      <div className="bg-white p-6 max-w-2xl mx-auto rounded-xl">
        <div className="flex md:flex-row flex-col justify-between md:items-center mb-4 border-b-2 border-grayscale-10 pb-4">
          <h2 className="text-[22px] font-semibold">Thông tin chuyển khoản</h2>
          <div className="flex items-center">
            <span className="text-grayscale-50 text-base font-medium mr-2">
              Thời gian còn lại:
            </span>
            <div className="flex space-x-2 items-center">
              <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
                {minutes}
              </span>
              <span>:</span>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
                {seconds}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg flex flex-col md:grid grid-cols-2 gap-[30px]">
          <div className="flex flex-col bg-grayscale-10 p-10 justify-center items-center">
            <p className="text-md text-grayscale-90 mb-5 text-center">
              Quét mã qua <strong>Ứng dụng Ngân hàng</strong> hoặc{' '}
              <strong>Ví điện tử</strong>
            </p>
            <Link
              className="decoration-transparent flex justify-center items-center space-x-2 font-medium text-sm text-primary-50"
              href="#">
              <Image
                alt="QR Code"
                height={20}
                src="/images/icons8-info-100-1.png"
                width={20}
              />
              <span>Hướng dẫn sử dụng</span>
            </Link>
            <div className="flex justify-center my-4">
              <QRCodeCanvas size={232} value={orderInfo.qrData} />
              {/* <Image
                alt="QR Code"
                height={232}
                src="/images/qrcode-checkout.png"
                width={232}
              /> */}
            </div>

            <button
              className="w-32 border-primary-50 border-[1px] hover:bg-primary-50 hover:text-white transform transition ease-in-out duration-200 text-primary-50 py-2 rounded-3xl mt-2 flex items-center justify-center gap-1"
              onClick={handleDownloadQR}>
              <DownloadIcon height={15} width={15} />
              Tải xuống
            </button>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-grayscale-50 text-base font-medium mb-1">
                Tổng số tiền:
              </div>
              <div className="text-primary-50 font-semibold text-[28px] mb-4">
                {formatCurrency(Number(orderInfo.total))}
              </div>

              <div className="text-grayscale-50 text-base font-medium mb-1">
                Ngân hàng:
              </div>
              <div className="text-grayscale-90 font-medium text-base mb-4">
                {orderInfo.bankName}
              </div>

              <div className="text-grayscale-50 text-base font-medium mb-1">
                Số tài khoản:
              </div>
              <div className="text-grayscale-90 font-medium text-base mb-4">
                {orderInfo.bankAccount}
              </div>

              <div className="text-grayscale-50 text-base font-medium mb-1">
                Chủ tài khoản:
              </div>
              <div className="text-grayscale-90 font-medium text-base mb-4">
                {orderInfo.bankAccountName}
              </div>

              <div className="text-grayscale-50 text-base font-medium mb-1">
                Mã giao dịch:
              </div>
              <div className="text-grayscale-90 font-medium text-base mb-4">
                {orderInfo.remark || orderInfo.orderId}
              </div>
            </div>

            <button
              className="h-[48px] transform transition ease-in-out duration-200 hover:bg-primary-40 bg-primary-50 text-white py-2 rounded-3xl mt-4"
              disabled={timeRemaining === 0}
              onClick={() => (window.location.href = '/')}>
              {timeRemaining === 0
                ? 'Hết thời gian thanh toán'
                : 'Hủy thanh toán'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
