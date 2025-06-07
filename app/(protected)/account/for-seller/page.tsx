'use client';

import { CustomerTabInformation } from '@/features/user/components/CustomerTabInformation';

const ForSellerPage = () => {
  const customerTabInfo = {
    name: 'Danh bạ khách hàng',
    type: 'customer' as const,
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomerTabInformation tabInfo={customerTabInfo} />
    </div>
  );
};

export default ForSellerPage;
