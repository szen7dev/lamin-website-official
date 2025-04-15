'use client';

import { Separator } from '@/components/ui/separator';
import { useGetDetailCoach } from '@/features/coach-experts/hooks/useGetDetailCoach';
import { useAuth } from '@/hooks';

export default function LocationInfo() {
  const { user } = useAuth();
  const customerID = user?.id;
  const { data: customer } = useGetDetailCoach({
    contactID: customerID || '',
  });

  return (
    <div>
      <div className="mx-auto">
        <div className="bg-white rounded-xl p-4 space-y-2 shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center space-x-4">
              <h2 className="font-medium text-base">{customer?.name}</h2>
              <div className="h-5">
                <Separator
                  className="h-full bg-grayscale-10"
                  orientation="vertical"
                />
              </div>

              <span className="text-sm text-grayscale-50">
                {customer?.phone}
              </span>
              <div className="h-5">
                <Separator
                  className="h-full bg-grayscale-10"
                  orientation="vertical"
                />
              </div>
              <span className="text-sm text-grayscale-50">
                {customer?.email}
              </span>
            </div>
            <button className="text-blue-600 text-sm hover:underline">
              Sửa
            </button>
          </div>
          <div className="">
            <p className="text-base text-grayscale-50">
              {customer?.address ||
                `C2605, N04B-T1, Chung cư Đoàn Ngoại giao, Phường Xuân Tảo, Quận
              Bắc Từ Liêm, Hà Nội`}
              {customer?.area?.name}, {customer?.area?.parent?.name},{' '}
              {customer?.area?.parent?.parent?.name}
            </p>
          </div>
          <button className="py-1 px-4 font-medium text-[#0052A4] border border-[#0052A4] text-sm bg-[#e5eef6] hover:bg-blue-200 rounded-full">
            Mặc định
          </button>
        </div>
      </div>
    </div>
  );
}
