// Payment method options
export const PAYMENT_METHODS = [
  {
    id: '1',
    value: '1',
    label: 'Thanh toán tiền mặt khi nhận hàng',
    icon: '/images/payment/cash.png',
  },
  {
    id: '2',
    value: '2',
    label: 'Thanh toán bằng chuyển khoản (QR Code)',
    icon: '/images/payment/qrcode.png',
  },
];

/**
 * Get payment method text by ID
 * @param id Payment method ID
 * @returns Payment method label or default text
 */
export const getPaymentMethodText = (id: string): string => {
  const method = PAYMENT_METHODS.find(m => m.value === id);

  return method?.label || 'Thanh toán tiền mặt khi nhận hàng';
};

/**
 * Get payment method icon by ID
 * @param id Payment method ID
 * @returns Payment method icon path
 */
export const getPaymentMethodIcon = (id: string): string => {
  const method = PAYMENT_METHODS.find(m => m.value === id);

  return method?.icon || '/images/payment/cash.png';
};
