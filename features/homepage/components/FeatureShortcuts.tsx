"use client"

import { useState } from "react"
import Link from "next/link"
import { Ruler, Apple, ShoppingBag, Phone, ShoppingCart, FileText } from "lucide-react"

// Client Component for interactive feature shortcuts
export default function FeatureShortcuts() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      id: 1,
      name: "Mua Ngay Sản Phẩm",
      description: "Dược phẩm & thực phẩm chức năng",
      icon: <ShoppingCart className="h-8 w-8" />,
      link: "/products",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    },
    {
      id: 2,
      name: "Chat với Chuyên Gia",
      description: "Tư vấn sức khỏe 24/7",
      icon: <Phone className="h-8 w-8" />,
      link: "/chat-with-expert",
      color: "bg-green-100 text-green-600 hover:bg-green-200",
    },
    {
      id: 3,
      name: "Xem Đơn Hàng",
      description: "Kiểm tra trạng thái đơn hàng",
      icon: <FileText className="h-8 w-8" />,
      link: "/orders",
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    },
    {
      id: 4,
      name: "Shop Uy Tín",
      description: "Hệ thống nhà thuốc chính hãng",
      icon: <ShoppingBag className="h-8 w-8" />,
      link: "/trusted-shops",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      id: 5,
      name: "Đo Chiều Cao",
      description: "Theo dõi sự phát triển của bé",
      icon: <Ruler className="h-8 w-8" />,
      link: "/height-measurement",
      color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
    },
    {
      id: 6,
      name: "Kiểm Tra Dinh Dưỡng",
      description: "Đánh giá chế độ dinh dưỡng",
      icon: <Apple className="h-8 w-8" />,
      link: "/nutrition-check",
      color: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {features.map((feature) => (
        <Link
          href={feature.link}
          key={feature.id}
          className={`${feature.color} rounded-lg p-4 transition-all duration-300 flex flex-col items-center text-center`}
          onMouseEnter={() => setHoveredFeature(feature.id)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div
            className={`mb-3 transition-transform duration-300 transform ${
              hoveredFeature === feature.id ? "scale-110" : "scale-100"
            }`}
          >
            {feature.icon}
          </div>
          <h3 className="font-semibold mb-1">{feature.name}</h3>
          <p className="text-xs opacity-80">{feature.description}</p>
        </Link>
      ))}
    </div>
  )
}

