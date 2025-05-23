'use client';

import { CustomerTabInformation } from '@/features/user/components/CustomerTabInformation';

const ForSellerPage = () => {
  const customerTabInfo = {
    name: 'Danh bạ khách hàng',
    type: 'customer' as const,
  };

  const heightTabInfo = {
    name: 'Đo cao khách hàng',
    type: 'height' as const,
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomerTabInformation tabInfo={customerTabInfo} />
      <CustomerTabInformation tabInfo={heightTabInfo} />
    </div>
  );
};

export default ForSellerPage;
