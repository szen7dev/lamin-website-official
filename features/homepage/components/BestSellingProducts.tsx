import Image from "next/image"
import { Button } from "@/components/ui/Button"

const products = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    name: "Hỗn dịch viên uống men vi sinh Enterogermina gut defense Sanofi tăng cường miễn dịch",
    price: "165.000đ",
    originalPrice: "200.000đ",
    unit: "Hộp",
    packageInfo: "Hộp 2 Vỉ x 10 Ống",
    discount: "-25%",
    units: [
      { label: "Hộp", value: "hop" },
      { label: "Ống", value: "ong" },
      { label: "Vỉ", value: "vi" },
    ],
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    name: "Hộp Telfor 60 DHG điều trị triệu chứng viêm mũi dị ứng trẻ em dưới 12 tuổi",
    price: "100.000đ",
    originalPrice: "150.000đ",
    unit: "Hộp",
    packageInfo: "Hộp 5 Vỉ x 10 Viên",
    discount: "-25%",
    units: [
      { label: "Hộp", value: "hop" },
      { label: "Ống", value: "ong" },
      { label: "Viên", value: "vien" },
    ],
  },
  // Add more products as needed
]

export default function BestSellingProducts() {
  return (
    <div className="py-6">
      {/* Section Title */}
      <div className="mb-6 flex justify-center">
        <h2 className="inline-block rounded-full bg-primary-5 px-8 py-2 text-lg font-bold text-white">
          Sản Phẩm Bán Chạy
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border border-grayscale-20 bg-white p-4 shadow-sm">
            {/* Product Image */}
            <div className="relative mb-4 aspect-square">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              <span className="absolute left-2 top-2 rounded bg-error-5 px-2 py-1 text-xs font-bold text-white">
                {product.discount}
              </span>
            </div>

            {/* Product Info */}
            <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">{product.name}</h3>

            {/* Unit Selection */}
            <div className="mb-3 flex gap-2">
              {product.units.map((unit) => (
                <span
                  key={unit.value}
                  className={`rounded-full px-3 py-1 text-sm ${
                    unit.value === "hop" ? "bg-primary-5 text-white" : "border border-grayscale-30 text-grayscale-60"
                  }`}
                >
                  {unit.label}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary-5">{product.price}</span>
                <span className="text-sm text-grayscale-50">/ {product.unit}</span>
              </div>
              <span className="text-sm text-grayscale-40 line-through">{product.originalPrice}</span>
            </div>

            {/* Package Info */}
            <p className="mb-4 text-sm text-grayscale-50">{product.packageInfo}</p>

            {/* Buy Button */}
            <Button className="w-full bg-primary-5 text-white hover:bg-primary-20">Chọn Mua</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

