'use client'

import Link from 'next/link'
import Image from 'next/image'

const features = [
  {
    id: 1,
    image: '/images/product.png',
    label: 'Cần mua sản phẩm',
    href: '/products',
  },
  {
    id: 2,
    image: '/images/coach.png',
    label: 'Tư vấn với Coach',
    href: '/coach',
  },
  {
    id: 3,
    image: '/images/stores.png',
    label: 'Tìm cửa hàng uy tín',
    href: '/trusted-shops',
  },
  {
    id: 4,
    image: '/images/bill.png',
    label: 'Đơn thuốc của tôi',
    href: '/prescriptions',
  },
  {
    id: 5,
    image: '/images/nutrient.png',
    label: 'Kiểm tra dinh dưỡng',
    href: '/nutrition-check',
  },
  {
    id: 6,
    image: '/images/syringe.png',
    label: 'Đo cao',
    href: '/height-measurement',
  },
]

export default function FeatureShortcuts() {
  return (
    <div className="grid grid-cols-6 justify-between overflow-x-auto py-4 gap-3 cursor-pointer">
      {features.map(feature => (
        <div
          key={feature.id}
          className="gap-2 border-1 border-[#EFF1F5] rounded-xl drop-shadow-lg px-4 py-3 transition-colors bg-white hover:bg-primary/5 decoration-transparent">
          <Link href={feature.href}>
            <div className="flex flex-wrap justify-start items-center gap-1">
              <Image alt={feature.label} height={32} src={feature.image} width={32} />
              <span className="text-center text-sm font-medium text-grayscale-70">
                {feature.label}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
