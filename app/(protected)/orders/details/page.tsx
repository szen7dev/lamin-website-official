'use client';
import { CircleIcon, QuestionMarkIcon } from '@/public/icons';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OrderInfo() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderStatus, setOrderStatus] = useState(1); // 0: Đặt hàng, 1: Xử lý đơn, 2: Đang giao, 3: Nhận hàng

  return (
    <div className="container m-10 grid grid-cols-3 gap-5 mx-auto ">
      <div className="col-span-2 bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Đơn hàng 08/03/2025</h2>
            <CircleIcon width={6} height={6} fill="#B9C0D4" />
            <p className="text-sm text-gray-600">Giao hàng tận nơi</p>

            <CircleIcon width={6} height={6} fill="#B9C0D4" />
            <p className="text-sm text-gray-600">#2742456</p>
          </div>
          <div className="flex items-center gap-2">
            <CircleIcon width={6} height={6} fill="#FEC430" />
            <span className="text-yellow-500 font-medium">Đang xử lý</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* <div className="flex flex-col justify-center"> */}
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
              <p className="text-sm text-gray-600">06:00, 08/03/2025</p>
              <p className="text-sm text-gray-600">06:00, 08/03/2025</p>
              <p className="text-sm text-gray-600">06:00, 08/03/2025</p>
              <p className="text-sm text-gray-600">06:00, 08/03/2025</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Dự kiến giao hàng: <strong>08:00 - 09:00 ngày 08/03/2025</strong>
          </p>
          <p className="text-sm text-gray-600">
            Nhà thuốc Elena LC HNI 115 Nguyễn Hoàng Tôn đã tiếp nhận đơn hàng.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Thông tin người nhận</p>
            <p className="text-sm text-gray-600">Nguyễn Hữu Hiệp</p>
            <p className="text-sm text-gray-600">09xxxxx295</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Nhận hàng tại</p>
            <p className="text-sm text-gray-600">
              N04B-T1, Chung cư Đoàn Ngoại Giao, P. Xuân Tảo, Q. Bắc Từ Liêm, Hà
              Nội
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold">Điểm bán xử lý đơn</p>
            <p className="text-sm text-gray-600">
              Nhà thuốc Elena LC HNI 115 Nguyễn Hoàng Tôn
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
            <span>Tổng tiền </span>
            <span className="text-base font-medium text-grayscale-90">
              1.700.000đ
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Phiếu giảm giá trực tiếp: </span>
            <span className="text-base font-medium text-grayscale-90">
              -69.000đ
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <div className="flex items-center gap-1">
              Giảm giá voucher <QuestionMarkIcon width={15} height={15} />
            </div>
            <span className="text-base font-medium text-grayscale-90">
              -69.000đ
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Trừ tích điểm </span>
            <span className="text-base font-medium text-grayscale-90">
              -25.000đ
            </span>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50">
            <span>Phí vận chuyển </span>
            <span className="text-base font-medium text-grayscale-90">
              Miễn phí
            </span>
          </div>
        </div>
        <div className="border-b-[1px] pb-4 pt-4">
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Điểm thưởng </span>
            <div className="flex justify-between items-center gap-1">
              <Image
                alt="QR Code"
                src="/icons/point-icon.svg"
                width={20}
                height={20}
              />
              <span className="text-base font-medium text-[#F79009]">
                5000 điểm
              </span>
            </div>
          </div>
          <div className="flex justify-between text-base font-normal text-grayscale-50">
            <span>Tiết kiệm được </span>
            <span className="text-base font-medium  text-[#F79009]">
              94000đ
            </span>
          </div>
        </div>
        <div className="border-b-[1px] pb-4 pt-4">
          <div className="flex justify-between text-base font-normal text-grayscale-50 mb-5">
            <span>Thành tiền </span>
            <span className="text-base font-semibold text-primary-50">
              1.606.000đ
            </span>
          </div>
        </div>
        <div className=" mt-2">
          <span className="flex justify-between text-base font-normal text-grayscale-50 mb-2">
            Phương thức thanh toán
          </span>
          <div className="flex gap-2 items-center mb-2">
            <Image
              alt="QR Code"
              src="/icons/qr-code-icon.svg"
              width={22}
              height={22}
            />
            <p className="text-grayscale-90 font-medium text-sm">
              Thanh toán bằng chuyển khoản (QR Code)
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              alt="Success"
              src="/icons/success-icon.svg"
              width={16}
              height={16}
            />
            <p className="text-[#51B848] font-medium text-sm">Đã thanh toán</p>
          </div>
        </div>
      </div>
    </div>
  );
}
