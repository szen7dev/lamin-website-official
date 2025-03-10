import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const products = [
  {
    id: 1,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn dịch viên uống men vi sinh Enterogermina gut defense Sanofi tăng cường miễn dịch',
    price: '165.000đ',
    originalPrice: '200.000đ',
    unit: 'Hộp',
    packageInfo: 'Hộp 2 Vỉ x 10 Ống',
    discount: '-25%',
    units: [
      { label: 'Hộp', value: 'hop' },
      { label: 'Ống', value: 'ong' },
      { label: 'Vỉ', value: 'vi' },
    ],
  },
  {
    id: 2,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hộp Telfor 60 DHG điều trị triệu chứng viêm mũi dị ứng trẻ em dưới 12 tuổi',
    price: '100.000đ',
    originalPrice: '150.000đ',
    unit: 'Hộp',
    packageInfo: 'Hộp 5 Vỉ x 10 Viên',
    discount: '-25%',
    units: [
      { label: 'Hộp', value: 'hop' },
      { label: 'Ống', value: 'ong' },
      { label: 'Viên', value: 'vien' },
    ],
  },
  // Add more products as needed
]

export default function BestSellingProducts() {
  return (
    <div className="py-6">
      {/* Section Title */}
      <div className="mb-6 flex justify-center">
        <h2 className="inline-block rounded-t-[8px] rounded-b-[40px] bg-gradient-1 px-14 py-2 text-xl font-semibold text-white">
          Sản Phẩm Bán Chạy
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map(product => (
          <div
            key={product.id}
            className="relative rounded-xl border border-grayscale-20 bg-white p-4 shadow-sm">
            {/* Product Image */}
            <div className="relative mb-4 aspect-square">
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="absolute top-0 left-0 z-10">
              <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
                {product.discount}
              </div>
            </span>

            {/* Product Info */}
            <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
              {product.name}
            </h3>

            {/* Unit Selection */}
            <ToggleGroup type="single" className="w-max">
              {product.units.map((unit, index) => (
                <ToggleGroupItem
                  key={unit.value}
                  value={unit.value}
                  className={`${
                    index === 0
                      ? 'rounded-l-lg'
                      : index === product.units.length - 1
                        ? 'rounded-r-lg'
                        : ''
                  }`}>
                  {unit.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {/* Price */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary-5">{product.price}</span>
                <span className="text-sm text-grayscale-50">/ {product.unit}</span>
              </div>
              <span className="text-sm text-grayscale-40 line-through">
                {product.originalPrice}
              </span>
            </div>

            {/* Package Info */}
            <p className="mb-4 text-sm text-grayscale-50">{product.packageInfo}</p>

            {/* Buy Button */}
            <Button className="w-full rounded-full bg-primary-5 text-white hover:bg-primary-20 font-medium text-base">
              Chọn Mua
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
