'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import {
  ChevronNoArrowIcon,
  MapPinIcon,
  PackageIcon,
  UserProfileIcon,
} from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks';
import { apiClient } from '@/services';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <DynamicBreadcrumb />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="flex flex-col gap-6">
            <AvatarSection />
            <ProfileTabs />
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function AvatarSection() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center gap-2 bg-primary rounded-2xl p-4 text-white">
      <Avatar className="w-16 h-16">
        <AvatarImage
          src={
            user?.image
              ? apiClient.getUserImageUrl(user.image)
              : '/images/default-avatar.png'
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-base font-medium">{user?.fullname}</div>
      <div className="text-sm font-normal">{user?.phone}</div>
    </div>
  );
}

function ProfileTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      icon: <UserProfileIcon />,
      name: 'Thông tin cá nhân',
      href: '/account/info',
    },
    {
      icon: <PackageIcon />,
      name: 'Đơn hàng của tôi',
      href: '/account/orders',
    },
    {
      icon: <MapPinIcon />,
      name: 'Quản lý địa chỉ',
      href: '/account/location',
    },
    {
      icon: <LogOut className="mr-2 h-4 w-4" />,
      name: 'Đăng xuất',
      href: '/logout',
    },
  ];

  return (
    <nav className="flex flex-col bg-white rounded-b-2xl">
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        const isLogout = tab.href === '/logout';

        return (
          <Link
            key={tab.href}
            className={`decoration-transparent px-4 py-2 transition-colors ${
              isLogout
                ? 'text-red-500 hover:bg-red-500/10 rounded-b-2xl'
                : isActive
                  ? 'bg-primary/10 border-l-2 border-primary text-primary'
                  : 'text-grayscale-90 hover:bg-primary/10'
            }`}
            href={tab.href}>
            <div className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span
                className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                {tab.name}
              </span>
              {!isLogout && (
                <span className="ml-auto">
                  <ChevronNoArrowIcon />
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
