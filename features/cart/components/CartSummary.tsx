import type { CartItem } from '../types/cartTypes';
import type { Voucher } from '../types/voucherTypes';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
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

  // Memoized summary calculation
  const summary = useMemo(() => {
    const selectedProducts = items.filter(item =>
      selectedItems.includes(item.id),
    );

    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const directDiscount = selectedProducts.reduce((sum, item) => {
      if (!item.originalPrice) return sum;

      return sum + (item.originalPrice - item.price) * item.quantity;
    }, 0);

    const rewardPoints = Math.floor(subtotal * 0.01);

    const pointsDiscount =
      usePoints && user?.contacts && user?.contacts[0].remainLoyaltyPoints
        ? user?.contacts[0].remainLoyaltyPoints
        : 0;

    let voucherDiscount = 0;

    if (appliedVoucher) {
      if (appliedVoucher.salesoffAmount > 0) {
        voucherDiscount = appliedVoucher.salesoffAmount;
      } else if (appliedVoucher.salesoffRate > 0) {
        voucherDiscount = (subtotal * appliedVoucher.salesoffRate) / 100;
      }
      if (subtotal < appliedVoucher.minOrderAmount) {
        voucherDiscount = 0;
      }
    }

    const savedAmount = directDiscount + pointsDiscount + voucherDiscount;
    const total = Math.max(0, subtotal - savedAmount);

    return {
      subtotal,
      directDiscount,
      pointsDiscount,
      voucherDiscount,
      total,
      rewardPoints,
      savedAmount,
    };
  }, [items, selectedItems, usePoints, appliedVoucher, user]);

  // Side effect: notify parent of points discount
  useEffect(() => {
    if (onPointsDiscountChange) {
      onPointsDiscountChange(summary.pointsDiscount);
    }
  }, [summary.pointsDiscount, onPointsDiscountChange]);

  // Handlers
  const handleApplyPromotion = useCallback(
    (voucher: Voucher | null) => {
      setAppliedVoucher(voucher);
      if (onVoucherSelect) onVoucherSelect(voucher);
      setIsPromoModalOpen(false);
    },
    [onVoucherSelect],
  );

  const handleCheckout = useCallback(() => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  }, [onCheckout, router]);

  const handleUsePointsChange = useCallback(
    (checked: boolean) => {
      setUsePoints(checked);
      if (!checked && onPointsDiscountChange) {
        onPointsDiscountChange(0);
      } else if (
        checked &&
        user?.contacts &&
        user?.contacts[0].remainLoyaltyPoints &&
        onPointsDiscountChange
      ) {
        onPointsDiscountChange(user.contacts[0].remainLoyaltyPoints);
      }
    },
    [user, onPointsDiscountChange],
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* <button
        aria-label="Áp dụng ưu đãi"
        className="flex w-full items-center justify-between bg-cart-promo-bg rounded-md text-blue-600 font-medium text-sm cursor-pointer border-none p-3"
        type="button"
        onClick={() => setIsPromoModalOpen(true)}>
        <span>Áp dụng ưu đãi để được giảm giá</span>
        <ChevronRight className="w-4 h-4" />
      </button> */}

      {user?.contacts && (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Image
              alt="Point Coin"
              className=""
              height={16}
              src="/images/PointCoinImg.webp"
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
        {/* <div>
          <span>Phí vận chuyển </span>
          <span className="text-blue-600">(miễn phí)</span>
        </div> */}
      </div>

      <div className="pt-2 border-t">
        <div className="flex items-center gap-1 text-sm justify-between">
          <span>Điểm thưởng</span>
          <div className="flex gap-1 items-center">
            <Image
              alt="Point Coin"
              className="w-4 h-4"
              height={16}
              src="/images/PointCoinImg.webp"
              width={16}
            />
            <span className="text-reward-points">
              {summary.rewardPoints} điểm
            </span>
          </div>
        </div>
        <div className="text-sm flex justify-between">
          <span>Tiết kiệm được</span>
          <span className="text-savings">
            {formatPrice(summary.savedAmount)}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Thành tiền</span>
          <div className="flex gap-2 items-center">
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(summary.subtotal)}
            </span>
            <div className="text-blue-600 text-xl font-bold">
              {formatPrice(summary.total)}
            </div>
          </div>
        </div>

        <Button
          className="w-full text-white rounded-full bg-gradient-checkout"
          disabled={selectedItems.length === 0}
          size="lg"
          onClick={handleCheckout}>
          Mua hàng
        </Button>

        <p className="mt-4 text-xs text-center text-gray-500">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
          <a className="underline" href="/bai-viet/chinh-sach-giao-hang">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a className="underline" href="/bai-viet/chinh-sach-bao-mat">
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
