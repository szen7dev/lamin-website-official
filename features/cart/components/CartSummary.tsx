'use client';

import type { CartItem } from '../types/cartTypes';
import type { Voucher } from '../types/voucherTypes';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Coins, HelpCircle } from 'lucide-react';
import Image from 'next/image';

import { PromotionModal } from './PromotionModal';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatPrice } from '@/utils/format';
import { useAuth } from '@/hooks';

interface CartSummaryProps {
  items: CartItem[];
  selectedItems: string[];
  onCheckout?: () => void;
  onVoucherSelect?: (voucher: Voucher | null) => void;
  onPointsDiscountChange?: (pointsDiscount: number) => void;
}

export function CartSummary({
  items,
  selectedItems,
  onCheckout,
  onVoucherSelect,
  onPointsDiscountChange,
}: CartSummaryProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [usePoints, setUsePoints] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [summary, setSummary] = useState({
    subtotal: 0,
    directDiscount: 0,
    pointsDiscount: 0,
    voucherDiscount: 0,
    total: 0,
    rewardPoints: 0,
    savedAmount: 0,
  });

  // Tính toán tổng tiền và các giảm giá mỗi khi có thay đổi
  useEffect(() => {
    const selectedProducts = items.filter(item =>
      selectedItems.includes(item.id),
    );

    // Tổng tiền gốc
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Giảm giá trực tiếp
    const directDiscount = selectedProducts.reduce((sum, item) => {
      if (!item.originalPrice) return sum;

      return sum + (item.originalPrice - item.price) * item.quantity;
    }, 0);

    // Điểm thưởng (1% tổng tiền)
    const rewardPoints = Math.floor(subtotal * 0.01);

    // Giảm giá từ điểm tích lũy
    const pointsDiscount =
      usePoints && user?.contacts && user?.contacts[0].remainLoyaltyPoints
        ? user?.contacts[0].remainLoyaltyPoints
        : 0;

    // Pass the points discount to the parent component
    if (onPointsDiscountChange) {
      onPointsDiscountChange(pointsDiscount);
    }

    // Tính voucher discount nếu có
    let voucherDiscount = 0;

    if (appliedVoucher) {
      // If we have a real API voucher
      if (appliedVoucher.salesoffAmount > 0) {
        // Fixed amount discount
        voucherDiscount = appliedVoucher.salesoffAmount;
      } else if (appliedVoucher.salesoffRate > 0) {
        // Percentage discount
        voucherDiscount = (subtotal * appliedVoucher.salesoffRate) / 100;
      }

      // Check if the minimum order amount is met
      if (subtotal < appliedVoucher.minOrderAmount) {
        voucherDiscount = 0;
      }
    }

    // Tổng tiết kiệm
    const savedAmount = directDiscount + pointsDiscount + voucherDiscount;

    // Thành tiền
    const total = Math.max(0, subtotal - savedAmount);

    setSummary({
      subtotal,
      directDiscount,
      pointsDiscount,
      voucherDiscount,
      total,
      rewardPoints,
      savedAmount,
    });
  }, [items, selectedItems, usePoints, appliedVoucher]);

  const handleApplyPromotion = (voucher: Voucher | null) => {
    console.log('Applied voucher:', voucher);
    setAppliedVoucher(voucher);

    // Pass the voucher data to the parent component
    if (onVoucherSelect) {
      onVoucherSelect(voucher);
    }

    setIsPromoModalOpen(false);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  const handleUsePointsChange = (checked: boolean) => {
    setUsePoints(checked);

    // If turning off points usage, reset the points discount
    if (!checked) {
      const newPointsDiscount = 0;

      if (onPointsDiscountChange) {
        onPointsDiscountChange(newPointsDiscount);
      }
    } else if (user?.contacts && user?.contacts[0].remainLoyaltyPoints) {
      // If turning on points usage, update the points discount
      const newPointsDiscount = user.contacts[0].remainLoyaltyPoints;

      if (onPointsDiscountChange) {
        onPointsDiscountChange(newPointsDiscount);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <button
        aria-label="Áp dụng ưu đãi"
        className="flex w-full items-center justify-between bg-[#eaeffa] rounded-md text-blue-600 font-medium text-sm cursor-pointer bg-transparent border-none p-3"
        type="button"
        onClick={() => setIsPromoModalOpen(true)}>
        <span>Áp dụng ưu đãi để được giảm giá</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {user?.contacts && (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {/* <Coins className="w-4 h-4 text-yellow-500" /> */}
            <Image
              alt="Point Coin"
              className=""
              height={16}
              src="/images/PointCoinImg.png"
              width={16}
            />
            <span className="font-normal text-sm">
              Đổi {user?.contacts[0].remainLoyaltyPoints || 0} điểm (
              {user?.contacts[0].remainLoyaltyPoints || 0}đ)
            </span>
          </div>
          <Switch checked={usePoints} onCheckedChange={handleUsePointsChange} />
        </div>
      )}

      <div className="space-y-2 text-sm text-[#4A4F63]">
        <div className="flex justify-between">
          <span>Tổng tiền</span>
          <span className="text-black">{formatPrice(summary.subtotal)}</span>
        </div>

        <div className="flex justify-between text-blue-600">
          <span>Giảm giá trực tiếp</span>
          <span className="text-black">
            -{formatPrice(summary.directDiscount)}
          </span>
        </div>

        {usePoints && (
          <div className="flex justify-between text-blue-600">
            <span>Trừ tích điểm</span>
            <span className="text-black">
              -{formatPrice(summary.pointsDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span>Giảm giá voucher</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Áp dụng mã giảm giá để được ưu đãi</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-black">
            {formatPrice(summary.voucherDiscount)}
          </span>
        </div>

        <div>
          <span>Phí vận chuyển </span>
          <span className="text-blue-600">(miễn phí)</span>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="flex items-center gap-1 text-sm">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Điểm thưởng</span>
          <span className="text-yellow-500">{summary.rewardPoints} điểm</span>
        </div>
        <div className="text-sm text-orange-500">
          Tiết kiệm được {formatPrice(summary.savedAmount)}
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-4">
          <span>Thành tiền</span>
          <div className="text-right">
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(summary.subtotal)}
            </span>
            <div className="text-blue-600 text-xl font-bold">
              {formatPrice(summary.total)}
            </div>
          </div>
        </div>

        <Button
          className="w-full text-white"
          disabled={selectedItems.length === 0}
          size="lg"
          onClick={handleCheckout}>
          Mua hàng
        </Button>

        <p className="mt-4 text-xs text-center text-gray-500">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
          <a className="underline" href="/terms-of-service">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a className="underline" href="/privacy-policy">
            Chính sách xử lý dữ liệu cá nhân
          </a>{' '}
          của Lamin
        </p>
      </div>

      <PromotionModal
        isOpen={isPromoModalOpen}
        onApplyPromotion={handleApplyPromotion}
        onClose={() => setIsPromoModalOpen(false)}
      />
    </div>
  );
}
