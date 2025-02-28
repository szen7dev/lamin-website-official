import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

export default function BestSellingProducts() {
  // Placeholder best selling products data
  const products = [
    {
      id: 1,
      name: "Vitamin C 1000mg",
      price: 280000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/vitamin-c-1000mg",
      category: "Vitamin & Khoáng chất",
      rating: 4.8,
      reviews: 120,
    },
    {
      id: 2,
      name: "Omega 3 Fish Oil",
      price: 315000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/omega-3-fish-oil",
      category: "Dầu cá",
      rating: 4.7,
      reviews: 98,
    },
    {
      id: 3,
      name: "Collagen Peptides",
      price: 385000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/collagen-peptides",
      category: "Chăm sóc da",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 4,
      name: "Probiotics 50 Billion CFU",
      price: 384000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/probiotics-50-billion",
      category: "Tiêu hóa",
      rating: 4.6,
      reviews: 87,
    },
    {
      id: 5,
      name: "Zinc + Vitamin C",
      price: 196000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/zinc-vitamin-c",
      category: "Tăng cường miễn dịch",
      rating: 4.8,
      reviews: 110,
    },
    {
      id: 6,
      name: "Calcium + Vitamin D3",
      price: 256000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/calcium-vitamin-d3",
      category: "Xương khớp",
      rating: 4.7,
      reviews: 92,
    },
    {
      id: 7,
      name: "Multivitamin Daily",
      price: 320000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/multivitamin-daily",
      category: "Vitamin tổng hợp",
      rating: 4.9,
      reviews: 145,
    },
    {
      id: 8,
      name: "Biotin 10000mcg",
      price: 175000,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/biotin-10000mcg",
      category: "Chăm sóc tóc",
      rating: 4.8,
      reviews: 78,
    },
  ]

  // Format price with VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link
          href={product.link}
          key={product.id}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 w-full">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">{product.category}</div>
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({product.reviews} đánh giá)</span>
            </div>
            <div className="text-primary-600 font-bold">{formatPrice(product.price)}</div>
          </div>
          <div className="bg-primary-600 text-white text-center py-2 font-semibold">XEM CHI TIẾT</div>
        </Link>
      ))}
    </div>
  )
}

