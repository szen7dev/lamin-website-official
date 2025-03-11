'use client'

import type { RefObject } from 'react'

import { useState } from 'react'
import { Menu } from 'lucide-react'

import MegaMenuItem from './MegaMenuItem'
import MegaMenuItemLink from './MegaMenuItemLink'
import MegaMenuColumn from './MegaMenuColumn'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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

interface ChildComponentProps {
  megaMenuRef: RefObject<HTMLButtonElement>
}

export default function MegaMenu({ megaMenuRef }: ChildComponentProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeProducts = categories.find(cat => cat.id === activeCategory)?.products || []

  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 lg:space-x-8 py-4">
          <li>
            <MegaMenuItem hasDropdown href="/products" label="Sản phẩm">
              <div className="flex flex-col md:flex-row">
                {/* Categories */}
                <div className="w-full md:w-64 rounded-lg">
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <MegaMenuItemLink
                        href={`/categories/${category.id}`}
                        icon={category.icon}
                        isActive={category.id === activeCategory}
                        label={category.label}
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
                    bestSellingProducts={bestSellingProducts}
                    categoryProducts={activeProducts}
                  />
                </div>
              </div>
            </MegaMenuItem>
          </li>

          <li>
            <MegaMenuItem href="/solutions" label="Giải Pháp" />
          </li>
          <li>
            <MegaMenuItem href="/height-measurement" label="Đo Cao" />
          </li>
          <li>
            <MegaMenuItem href="/nutrition-check" label="Kiểm Tra Dinh Dưỡng" />
          </li>
          <li className="hidden lg:block">
            <MegaMenuItem href="/trusted-shops" label="Hệ Thống Cửa Hàng" />
          </li>
          <li className="hidden lg:block">
            <MegaMenuItem href="/contact" label="Liên Hệ" />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="hidden">
          <Button
            ref={megaMenuRef}
            className="text-primary p-1"
            variant="ghost"
            onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="ml-2">Menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent className="w-[85vw] sm:w-[350px] p-0" side="left">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg">Menu</h2>
              </div>

              <div className="flex-1 overflow-auto">
                <Accordion collapsible className="w-full" type="single">
                  <AccordionItem className="border-b" value="products">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      Sản phẩm
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-3">
                      <Accordion collapsible className="w-full" type="single">
                        {categories.map(category => (
                          <AccordionItem key={category.id} className="border-0" value={category.id}>
                            <AccordionTrigger className="px-6 py-2 text-sm hover:no-underline">
                              {category.label}
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2 px-8">
                              <ul className="space-y-2">
                                {category.products.map(product => (
                                  <li key={product.id} className="text-sm">
                                    <a
                                      className="hover:text-primary"
                                      href={`/products/${product.id}`}>
                                      {product.name}
                                    </a>
                                  </li>
                                ))}
                                {category.products.length === 0 && (
                                  <li className="text-sm text-muted-foreground">
                                    Không có sản phẩm
                                  </li>
                                )}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem className="border-b" value="solutions">
                    <a className="flex py-3 px-4" href="/solutions">
                      Giải Pháp
                    </a>
                  </AccordionItem>

                  <AccordionItem className="border-b" value="height">
                    <a className="flex py-3 px-4" href="/height-measurement">
                      Đo Cao
                    </a>
                  </AccordionItem>

                  <AccordionItem className="border-b" value="nutrition">
                    <a className="flex py-3 px-4" href="/nutrition-check">
                      Kiểm Tra Dinh Dưỡng
                    </a>
                  </AccordionItem>

                  <AccordionItem className="border-b" value="shops">
                    <a className="flex py-3 px-4" href="/trusted-shops">
                      Hệ Thống Cửa Hàng
                    </a>
                  </AccordionItem>

                  <AccordionItem className="border-b" value="contact">
                    <a className="flex py-3 px-4" href="/contact">
                      Liên Hệ
                    </a>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
