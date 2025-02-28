import Image from "next/image"
import Link from "next/link"

export default function TrustedShopsShowcase() {
  // Placeholder trusted shops data
  const shops = [
    {
      id: 1,
      name: "Elena Pharmacy - Cầu Giấy",
      address: "123 Cầu Giấy, Hà Nội",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-cau-giay",
    },
    {
      id: 2,
      name: "Elena Pharmacy - Đống Đa",
      address: "45 Đống Đa, Hà Nội",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-dong-da",
    },
    {
      id: 3,
      name: "Elena Pharmacy - Quận 1",
      address: "78 Nguyễn Huệ, Quận 1, TP.HCM",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-quan-1",
    },
    {
      id: 4,
      name: "Elena Pharmacy - Quận 7",
      address: "56 Nguyễn Lương Bằng, Quận 7, TP.HCM",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-quan-7",
    },
    {
      id: 5,
      name: "Elena Pharmacy - Đà Nẵng",
      address: "34 Nguyễn Văn Linh, Đà Nẵng",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-da-nang",
    },
    {
      id: 6,
      name: "Elena Pharmacy - Nha Trang",
      address: "12 Trần Phú, Nha Trang",
      image: "/placeholder.svg?height=200&width=200",
      link: "/trusted-shops/elena-nha-trang",
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {shops.map((shop) => (
          <Link
            href={shop.link}
            key={shop.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
          >
            <div className="relative h-24 w-24 mx-auto mb-3">
              <Image src={shop.image || "/placeholder.svg"} alt={shop.name} fill className="object-contain" />
            </div>
            <h3 className="font-medium text-sm mb-1 line-clamp-1">{shop.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{shop.address}</p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/trusted-shops"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Xem tất cả hệ thống shop
        </Link>
      </div>
    </div>
  )
}

