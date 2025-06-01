'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import SimpleBanner from '@/features/homepage/components/SimpleBanner';
import { TripleBulletButton } from '@/components/triple-button-group';
import {
  BlueChartIcon,
  DotIcon,
  GreenArrowUpIcon,
  RedArrowDown,
} from '@/components/icons';
import { formatNumber } from '@/utils';

const ClientTripleBulletButton = () => {
  const pathname = usePathname();

  let activeIndex = 0;

  if (pathname.includes('/vng-event/donate-list')) {
    activeIndex = 1;
  } else if (pathname.includes('/vng-event/donate-history')) {
    activeIndex = 2;
  } else if (pathname.includes('/vng-event/event')) {
    activeIndex = 0;
  }

  return (
    <TripleBulletButton
      activeIndex={activeIndex}
      items={[
        {
          label: 'Sự Kiện',
          href: '/vng-event/event',
        },
        {
          label: 'Danh Sách Quyên Góp',
          href: '/vng-event/donate-list',
        },
        {
          label: 'Lịch Sử Từ Thiện',
          href: '/vng-event/donate-history',
        },
      ]}
    />
  );
};

const VNGEventPage = ({ children }: { children: React.ReactNode }) => {
  const mockData = [
    {
      id: 1,
      name: 'Tổng thu',
      total: 100000000,
      icon: <GreenArrowUpIcon />,
      color: '#27AE60',
    },
    {
      id: 2,
      name: 'Tổng chi',
      total: 40000000,
      icon: <RedArrowDown />,
      color: '#EB5757',
    },
    {
      id: 3,
      name: 'Còn lại',
      total: 60000000,
      icon: <BlueChartIcon />,
      color: '#2F80ED',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section aria-labelledby="hero-heading" className="w-full">
        <SimpleBanner />
      </section>
      <div className="container py-6">
        <div className="mx-auto w-max max-w-3xl px-4">
          <ClientTripleBulletButton />
        </div>
        <div className="flex gap-4 py-5 justify-between items-center">
          {mockData.map(item => (
            <div
              key={item.id}
              className="flex bg-light-24 border-grayscale-10 border rounded-2xl p-4 justify-start items-center gap-5 w-full">
              {item.icon}
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {formatNumber(item.total)}
                </div>
                <div className="text-base font-normal text-grayscale-50">
                  <div className="flex items-center gap-2 text-grayscale-50">
                    <DotIcon style={{ color: item.color }} />
                    {item.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};

export default VNGEventPage;
