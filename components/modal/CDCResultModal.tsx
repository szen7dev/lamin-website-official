'use client';

import React from 'react';
import Image from 'next/image';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

interface CDCResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CDCResultModal({ isOpen, onClose }: CDCResultModalProps) {
  return (
    <Modal className="max-w-lg" isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Cảm ơn bạn đã sử dụng
          </h2>
          <h3 className="text-xl font-semibold text-primary">
            Đo cao CDC của Lamin
          </h3>
        </div>

        <div className="flex justify-center py-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <Image
              priority
              alt="QR Code Zalo OA"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
              className="object-contain w-[150px] h-[150px]"
              height={150}
              placeholder="blur"
              sizes="150px"
              src="/images/qrCode.jpg"
              width={150}
              onError={e => {
                const target = e.currentTarget;

                target.onerror = null;
                target.src = '/images/fallback-qr.png';
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Quét mã QR để xem kết quả đo cao
          </h4>
          <p className="text-gray-600 leading-relaxed">
            Sử dụng camera điện thoại hoặc các ứng dụng quét mã QR để nhận thông
            tin kết quả chi tiết
          </p>
        </div>

        <div className="pt-4">
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90 py-3 text-base font-medium"
            type="button"
            onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
