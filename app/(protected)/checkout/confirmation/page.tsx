'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { DownloadIcon } from '@/components/icons';

export default function CheckoutConfirmationPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  const getHours = (date: Date) => date.getHours().toString().padStart(2, '0');
  const getMinutes = (date: Date) => date.getMinutes().toString().padStart(2, '0');

  return (
    <div className="bg-white my-10 p-6 max-w-2xl mx-auto rounded-xl">
      <div className="flex justify-between items-center mb-4 border-b-2 border-grayscale-10 pb-4">
        <h2 className="text-[22px] font-semibold">Thông tin chuyển khoản</h2>
        <div className="flex space-x-2 items-center">
          <span className="text-grayscale-50 text-base font-medium">
            Thông tin chuyển khoản
          </span>
          <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
            {getHours(currentTime)}
          </span>
          <span>:</span>
          <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
            {getMinutes(currentTime)}
          </span>
        </div>
      </div>
      <div className="rounded-lg grid grid-cols-2 gap-[30px]">
        <div className="flex flex-col bg-grayscale-10 p-10 justify-center items-center">
          <p className="text-sm text-grayscale-90 mb-5 text-center">
            Quét mã qua <strong>Ứng dụng Ngân hàng</strong> hoặc{' '}
            <strong>Ví điện tử</strong>
          </p>
          <Link
            className="flex justify-center items-center space-x-2 font-medium text-sm text-primary-50"
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
            <Image
              alt="QR Code"
              height={232}
              src="/images/qrcode-checkout.png"
              width={232}
            />
          </div>

          <button className="w-32 border-primary-50 border-[1px] hover:bg-primary-50 hover:text-white transform transition ease-in-out duration-200 text-primary-50 py-2 rounded-3xl mt-2 flex items-center justify-center gap-1">
            <DownloadIcon height={15} width={15} />
            Tải xuống
          </button>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-grayscale-50 text-base font-medium">
              Tổng số tiền:
              <p className="text-primary-50 font-semibold text-[28px] mt-2 mb-4">
                1.606.000đ
              </p>
            </p>
            <p className="text-grayscale-50 text-base font-medium">
              Ngân hàng:{' '}
              <p className="text-grayscale-90 font-medium text-base  mt-2 mb-4 ">
                Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)
              </p>
            </p>
            <p className="text-grayscale-50 text-base font-medium">
              Số tài khoản:{' '}
              <p className="text-grayscale-90 font-medium text-base  mt-2 mb-4">
                0001 6433 1980 322
              </p>
            </p>
            <p className="text-grayscale-50 text-base font-medium">
              Chủ tài khoản:{' '}
              <p className="text-grayscale-90 font-medium text-base  mt-2 mb-4">
                Công ty Cổ Phần Dược Phẩm Elena
              </p>
            </p>
            <p className="text-grayscale-50 text-base font-medium">
              Mã giao dịch:{' '}
              <p className="text-grayscale-90 font-medium text-base  mt-2 mb-4">
                2632345
              </p>
            </p>
          </div>

          <button className="h-[48px] transform transition ease-in-out duration-200 hover:bg-primary-40 bg-primary-50 text-white py-2 rounded-3xl mt-4">
            Hủy thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
