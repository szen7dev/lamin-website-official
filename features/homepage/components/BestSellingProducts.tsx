import { Button } from "@/components/ui/Button"
import Image from "next/image"

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
    <section className="py-4 sm:py-6" aria-labelledby="bestselling-title">
      {/* Section Title */}
      <header className="mb-4 sm:mb-6 flex justify-center">
        <h2
          id="bestselling-title"
          className="inline-block rounded-full bg-primary-5 px-4 sm:px-8 py-1.5 sm:py-2 text-white font-bold text-base sm:text-lg"
        >
          Sản Phẩm Bán Chạy
        </h2>
      </header>

      {/* Products Grid */}
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-grayscale-20 bg-white p-2 sm:p-3 md:p-4 shadow-sm"
          >
            {/* Product Image */}
            <figure className="relative mb-2 sm:mb-3 md:mb-4 aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
              />
              <span className="absolute left-1 top-1 sm:left-2 sm:top-2 rounded bg-error-5 px-1 py-0.5 sm:px-2 sm:py-1 text-xs font-bold text-white">
                {product.discount}
              </span>
            </figure>

            {/* Product Info */}
            <h3 className="mb-1.5 sm:mb-2 md:mb-3 line-clamp-2 min-h-[2.5rem] text-xs sm:text-sm font-medium text-grayscale-90">
              {product.name}
            </h3>

            {/* Unit Selection */}
            <div
              className="mb-1.5 sm:mb-2 md:mb-3 flex flex-wrap gap-1 sm:gap-2"
              role="radiogroup"
              aria-label="Đơn vị sản phẩm"
            >
              {product.units.map((unit) => (
                <span
                  key={unit.value}
                  className={`rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-3 md:py-1 text-[10px] sm:text-xs md:text-sm ${
                    unit.value === "hop"
                      ? "bg-primary-5 text-white"
                      : "border border-grayscale-30 text-grayscale-60"
                  }`}
                  role="radio"
                  aria-checked={unit.value === "hop"}
                >
                  {unit.label}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mb-1.5 sm:mb-2">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg font-bold text-primary-5">
                  {product.price}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm text-grayscale-50">
                  / {product.unit}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm text-grayscale-40 line-through">
                {product.originalPrice}
              </span>
            </div>

            {/* Package Info */}
            <p className="mb-2 sm:mb-3 md:mb-4 text-[10px] sm:text-xs md:text-sm text-grayscale-50">
              {product.packageInfo}
            </p>

            {/* Buy Button */}
            <Button className="w-full text-xs sm:text-sm py-1 sm:py-1.5 md:py-2 h-auto bg-primary-5 text-white hover:bg-primary-20">
              Chọn Mua
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
