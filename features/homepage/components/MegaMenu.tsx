'use client'

import { useState } from 'react'
import MegaMenuItem from './MegaMenuItem'
import MegaMenuItemLink from './MegaMenuItemLink'
import MegaMenuColumn from './MegaMenuColumn'
import { Separator } from '@/components/ui/separator'

const categories = [
  {
    id: 'vitamin',
    label: 'Vitamin & Khoáng chất',
    icon: '/placeholder.svg',
    products: [
      { id: '1', name: 'Bổ sung Canxi & Vitamin D', image: '/placeholder.svg' },
      { id: '2', name: 'Vitamin tổng hợp', image: '/placeholder.svg' },
      { id: '3', name: 'Dầu cá, Omega 3, DHA', image: '/placeholder.svg' },
      { id: '4', name: 'Vitamin C các loại', image: '/placeholder.svg' },
      { id: '5', name: 'Bổ sung Sắt & Axit Folic', image: '/placeholder.svg' },
    ],
  },
  { id: 'sinh-ly', label: 'Sinh lý & Nội tiết tố', icon: '/placeholder.svg', products: [] },
  { id: 'chuc-nang', label: 'Tăng cường chức năng', icon: '/placeholder.svg', products: [] },
  { id: 'dieu-tri', label: 'Hỗ trợ điều trị', icon: '/placeholder.svg', products: [] },
  { id: 'tieu-hoa', label: 'Hỗ trợ tiêu hóa', icon: '/placeholder.svg', products: [] },
  { id: 'than-kinh', label: 'Thần kinh não', icon: '/placeholder.svg', products: [] },
  { id: 'lam-dep', label: 'Hỗ trợ làm đẹp', icon: '/placeholder.svg', products: [] },
  { id: 'tim-mach', label: 'Sức khỏe tim mạch', icon: '/placeholder.svg', products: [] },
  { id: 'dinh-duong', label: 'Dinh dưỡng', icon: '/placeholder.svg', products: [] },
]

const bestSellingProducts = [
  {
    id: '1',
    name: 'Viên uống NutriGrow Nutrimed bổ sung canxi, vitamin D3',
    image: '/placeholder.svg',
    price: 480000,
    originalPrice: 600000,
    unit: 'Hộp',
  },
  {
    id: '2',
    name: 'Viên uống Rama Bổ Phổi hỗ trợ bổ phổi, giảm ho hiệu quả',
    image: '/placeholder.svg',
    price: 155000,
    originalPrice: 200000,
    unit: 'Hộp',
  },
  {
    id: '3',
    name: 'Viên uống Rama Bổ Phổi hỗ trợ bổ phổi, giảm ho hiệu quả',
    image: '/placeholder.svg',
    price: 155000,
    originalPrice: 200000,
    unit: 'Hộp',
  },
]

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  const activeProducts = categories.find(cat => cat.id === activeCategory)?.products || []

  return (
    <nav className=" bg-white text-black">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 py-4">
          <li>
            <MegaMenuItem label="Sản phẩm" href="/products" hasDropdown>
              <div className="flex">
                {/* Categories */}
                <div className="w-64 rounded-lg">
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <MegaMenuItemLink
                        href={`/categories/${category.id}`}
                        icon={category.icon}
                        label={category.label}
                        isActive={category.id === activeCategory}
                        onMouseEnter={() => setActiveCategory(category.id)}
                      />
                      {index < categories.length - 1 &&
                        category.id !== activeCategory &&
                        categories[index + 1].id !== activeCategory && <Separator />}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <MegaMenuColumn
                    activeCategory={activeCategory}
                    categoryProducts={activeProducts}
                    bestSellingProducts={bestSellingProducts}
                  />
                </div>
              </div>
            </MegaMenuItem>
          </li>

          <li>
            <MegaMenuItem label="Giải Pháp" href="/solutions" />
          </li>
          <li>
            <MegaMenuItem label="Đo Cao" href="/height-measurement" />
          </li>
          <li>
            <MegaMenuItem label="Kiểm Tra Dinh Dưỡng" href="/nutrition-check" />
          </li>
          <li>
            <MegaMenuItem label="Hệ Thống Cửa Hàng" href="/trusted-shops" />
          </li>
          <li>
            <MegaMenuItem label="Liên Hệ" href="/contact" />
          </li>
        </ul>
      </div>
    </nav>
  )
}
