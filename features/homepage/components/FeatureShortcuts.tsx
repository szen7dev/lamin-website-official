'use client';

import Link from 'next/link';
import {
  ShoppingBag,
  Stethoscope,
  MapPin,
  FileText,
  Activity,
  Ruler,
} from 'lucide-react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

const features = [
  {
    id: 1,
    icon: ShoppingBag,
    label: 'Cần mua sản phẩm',
    href: '/products',
  },
  {
    id: 2,
    icon: Stethoscope,
    label: 'Tư vấn với Coach',
    href: '/coach',
  },
  {
    id: 3,
    icon: MapPin,
    label: 'Tìm cửa hàng uy tín',
    href: '/trusted-shops',
  },
  {
    id: 4,
    icon: FileText,
    label: 'Đơn thuốc của tôi',
    href: '/prescriptions',
  },
  {
    id: 5,
    icon: Activity,
    label: 'Kiểm tra dinh dưỡng',
    href: '/nutrition-check',
  },
  {
    id: 6,
    icon: Ruler,
    label: 'Đo cao',
    href: '/height-measurement',
  },
];

export default function FeatureShortcuts() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <nav aria-label="Truy cập nhanh" className="py-4 md:py-6">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {features.map(feature => (
          <div key={feature.id} className="flex-shrink-0">
            <Link
              className={`group flex h-full rounded-xl bg-white shadow-light-08 transition-all hover:shadow-light-16 ${
                isDesktop
                  ? 'flex-row items-center gap-3 p-4'
                  : 'flex-col items-center gap-2 p-3'
              }`}
              href={feature.href}>
              <div
                className={`flex items-center justify-center ${
                  isDesktop
                    ? 'h-10 w-10 flex-shrink-0 rounded-full bg-primary-5'
                    : 'h-8 w-8 rounded-full bg-primary-5'
                }`}>
                <feature.icon
                  aria-hidden="true"
                  className={`text-primary-40 transition-colors group-hover:text-primary-50 ${
                    isDesktop ? 'h-5 w-5' : 'h-4 w-4'
                  }`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`font-medium text-grayscale-70 group-hover:text-grayscale-90 ${
                  isDesktop ? 'text-sm break-words' : 'text-center text-xs'
                }`}>
                {feature.label}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
