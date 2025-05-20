// Returns a human-readable string for time left until expiry
export function formatTimeLeft(expiryDate: Date): string {
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Hết hạn';
  if (diffDays === 1) return 'Còn 1 ngày';

  return `Còn ${diffDays} ngày`;
}

// Returns a formatted description for a voucher
export function formatVoucherDescription(voucher: {
  salesoffAmount: number;
  salesoffRate: number;
  minOrderAmount: number;
}): string {
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
}
