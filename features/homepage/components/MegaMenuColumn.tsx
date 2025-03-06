import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Cross } from "lucide-react"
import { cn } from "@/utils"
import { Separator } from "@/components/ui/separator"

interface CategoryProduct {
  id: string
  name: string
  image: string
}

interface BestSellingProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  unit: string
}

interface MegaMenuColumnProps {
  activeCategory?: string
  categoryProducts?: CategoryProduct[]
  bestSellingProducts?: BestSellingProduct[]
}

export default function MegaMenuColumn({
  activeCategory,
  categoryProducts,
  bestSellingProducts,
}: MegaMenuColumnProps) {
  return (
    <div
      className={cn(
        "space-y-6 bg-[#F1F4FD] p-6 rounded-xl w-full",
        activeCategory === "vitamin" ? "rounded-tl-none" : ""
      )}
    >
      {/* Category Products Grid */}
      {categoryProducts && (
        <div className="grid grid-cols-3 gap-4">
          {categoryProducts.map((product) => (
            <div className="flex items-center gap-3 rounded-[8px] bg-white p-3 shadow-md transition-shadow hover:shadow-xl decoration-transparent">
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="flex justify-between items-center gap-2">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="text-sm text-grayscale-90">{product.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Best Selling Section */}
      {bestSellingProducts && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center        primary-5">
                <Cross fill="currentColor" className="h-5 w-5 text-primary-5" />
              </div>
              <h3 className="font-medium text-grayscale-90">Bán chạy nhất</h3>
              <div className="h-5">
                <Separator orientation="vertical" />
              </div>
              <Link
                href="#"
                className="flex items-center gap-1 text-sm text-primary-5 hover:underline"
              >
                Xem thêm
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 grid-flow-col gap-6">
            {bestSellingProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group space-y-2">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <h4 className="line-clamp-2 text-sm text-grayscale-90 group-hover:text-primary-40">
                  {product.name}
                </h4>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-semibold text-primary-5">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="text-xs font-normal text-primary-5">/{product.unit}</span>
                  </div>
                  <span className="text-sm text-grayscale-40 line-through">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
