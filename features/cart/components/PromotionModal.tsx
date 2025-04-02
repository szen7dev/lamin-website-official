'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';

import { useGetVoucher } from '../hooks/useGetVoucher';
import { type Voucher } from '../types/voucherTypes';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { VoucherIcon } from '@/components/icons';
import { useAuth } from '@/hooks';
import Image from 'next/image';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromotion: (voucher: Voucher | null) => void;
}

const formatTimeLeft = (expiryDate: Date): string => {
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Hết hạn';
  } else if (diffDays === 1) {
    return 'Còn 1 ngày';
  } else {
    return `Còn ${diffDays} ngày`;
  }
};

const formatDescription = (voucher: Voucher): string => {
  let description = '';

  if (voucher.salesoffAmount > 0) {
    description = `Giảm ${voucher.salesoffAmount.toLocaleString()}đ`;
  } else if (voucher.salesoffRate > 0) {
    description = `Giảm ${voucher.salesoffRate}%`;
  }

  if (voucher.minOrderAmount > 0) {
    description += ` - Đơn tối thiểu ${voucher.minOrderAmount.toLocaleString()}đ`;
  }

  return description;
};

export function PromotionModal({
  isOpen,
  onClose,
  onApplyPromotion,
}: PromotionModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const { user } = useAuth();

  const { data: vouchers = [], isLoading: isLoadingVouchers } = useGetVoucher({
    customerID: user?.id,
  });

  const handleApply = () => {
    if (selectedVoucher) {
      onApplyPromotion(selectedVoucher);
      onClose();
    } else if (manualCode.trim()) {
      onApplyPromotion({
        _id: manualCode.trim(),
        name: manualCode.trim(),
        sign: manualCode.trim(),
        expired: new Date(),
        salesoffAmount: 0,
        salesoffRate: 0,
        minOrderAmount: 0,
      });
      onClose();
    } else {
      onApplyPromotion(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md !animate-slide-up">
        <DialogHeader>
          <DialogTitle>Mã khuyến mãi</DialogTitle>
        </DialogHeader>

        {!user ? (
          <div className="py-4 text-center">
            Vui lòng đăng nhập để sử dụng mã khuyến mãi
          </div>
        ) : (
          <>
            <div className="relative">
              <Input
                className="pr-24"
                placeholder="Nhập mã khuyến mãi"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
              />
              <Button
                className="absolute right-0 top-0 h-full rounded-l-none bg-[#DCDFEA] text-[#7D89B0] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!manualCode.trim()}
                onClick={handleApply}>
                Xác nhận
              </Button>
            </div>

            {isLoadingVouchers ? (
              <div className="py-4 text-center">Đang tải mã khuyến mãi...</div>
            ) : vouchers.length > 0 ? (
              <div className="mt-4">
                <div className="space-y-0">
                  {vouchers.map((voucher, index) => (
                    <React.Fragment key={voucher.sign}>
                      <div className="w-full rounded-lg py-3 px-3">
                        <div className="flex items-center space-x-3">
                          <VoucherIcon className="flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {voucher.sign}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                {voucher.name}
                              </span>
                            </div>
                            <div className="font-normal text-sm">
                              {formatDescription(voucher)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTimeLeft(new Date(voucher.expired))}
                              </span>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedVoucher?._id === voucher._id}
                            className="data-[state=checked]:bg-blue-600 rounded-full border-gray-300 h-5 w-5 data-[state=checked]:text-white"
                            id={voucher._id}
                            onCheckedChange={() => {
                              setSelectedVoucher(
                                selectedVoucher?._id === voucher._id
                                  ? null
                                  : voucher,
                              );
                            }}
                          />
                        </div>
                      </div>
                      {index < vouchers.length - 1 && (
                        <Separator className="bg-grayscale-20 w-full mx-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Button
                  className="w-full h-12 mt-4 rounded-full text-white"
                  onClick={handleApply}>
                  Áp dụng
                </Button>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <div className="flex justify-center items-center mb-6">
                  <Image
                    alt="Empty Coupon"
                    height={150}
                    src="/images/EmptyCoupon.png"
                    width={150}
                  />
                </div>
                Không có mã khuyến mãi nào khả dụng
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
