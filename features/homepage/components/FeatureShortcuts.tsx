"use client"

import Link from "next/link"
import { ShoppingBag, Stethoscope, MapPin, FileText, Activity, Ruler } from "lucide-react"

const features = [
  {
    id: 1,
    icon: ShoppingBag,
    label: "Cần mua sản phẩm",
    href: "/products",
  },
  {
    id: 2,
    icon: Stethoscope,
    label: "Tư vấn với Coach",
    href: "/coach",
  },
  {
    id: 3,
    icon: MapPin,
    label: "Tìm cửa hàng uy tín",
    href: "/trusted-shops",
  },
  {
    id: 4,
    icon: FileText,
    label: "Đơn thuốc của tôi",
    href: "/prescriptions",
  },
  {
    id: 5,
    icon: Activity,
    label: "Kiểm tra dinh dưỡng",
    href: "/nutrition-check",
  },
  {
    id: 6,
    icon: Ruler,
    label: "Đo cao",
    href: "/height-measurement",
  },
]

export default function FeatureShortcuts() {
  return (
    <div className="flex justify-between overflow-x-auto py-4">
      {features.map((feature) => (
        <Link
          key={feature.id}
          href={feature.href}
          className="flex min-w-[120px] flex-col items-center gap-2 rounded-lg px-4 py-3 transition-colors hover:bg-primary-5/5"
        >
          <feature.icon className="h-6 w-6 text-primary-40" />
          <span className="text-center text-sm font-medium text-grayscale-70">{feature.label}</span>
        </Link>
      ))}
    </div>
  )
}

