'use client';
import { DownloadIcon } from '@/public/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutConfirmationPage() {
  return (
    <div className="flex flex-col items-center mx-auto pb-10">
      <div className="">
        <Image
          alt="QR Code"
          src="/images/success-checkout-img.svg"
          width={150}
          height={150}
        />
      </div>
      <div className="bg-white p-6 w-[500px] rounded-xl">
        <div className="mb-4 border-b-2 border-grayscale-10 pb-4 ">
          <h2 className="text-[22px] font-semibold text-primary-50">
            Đặt hàng thành công
          </h2>
          <p className="text-grayscale-50 text-base font-normal">
            Nhà thuốc Elena 123G Thụy Khuê đã tiếp nhận đơn hàng
          </p>
        </div>
        <div className="rounded-lg">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-grayscale-50 text-base font-medium">
                <span>Thời gian nhận hàng dự kiến:</span>
                <p className="text-grayscale-90 font-medium text-base  mb-4 ">
                  Từ 08:00 - 09:00 ngày 08/03/2025
                </p>
              </p>
              <div className="text-grayscale-50 text-base font-medium mb-4">
                <span>Phương thức thanh toán:</span>
                <div className="flex gap-2 items-center">
                  <Image
                    alt="QR Code"
                    src="/icons/qr-code-icon.svg"
                    width={20}
                    height={20}
                  />
                  <p className="text-grayscale-90 font-medium text-base">
                    Thanh toán bằng chuyển khoản (QR Code)
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    alt="Success"
                    src="/icons/success-icon.svg"
                    width={20}
                    height={20}
                  />
                  <p className="text-[#51B848] font-medium text-base">
                    Đã thanh toán
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="transform transition ease-in-out duration-200 hover:bg-primary-40 bg-primary-50 text-white py-2 rounded-3xl mt-4">
                Chi tiết đơn hàng
              </button>
              <button className="transform transition ease-in-out duration-200 hover:bg-primary-30 hover:text-white bg-primary-5 text-primary-50 py-2 rounded-3xl mt-4">
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
