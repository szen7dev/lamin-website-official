'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import MegaMenuItem from './MegaMenuItem';
import MegaMenuItemLink from './MegaMenuItemLink';
import MegaMenuColumn from './MegaMenuColumn';

import { useMenu } from '@/features/menu/hooks/useMenu';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function MegaMenu() {
  const { categories, bestSellingProducts } = useMenu();
  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0].id : '',
  );
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useRef<HTMLDivElement>(null);

  const activeProducts =
    categories.find(cat => cat.id === activeCategory)?.products || [];

  const toggleMobileItem = (id: string) => {
    if (id === 'products') {
      setMobileMenuOpen(true);
    } else {
      setExpandedMobileItems(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
      );
    }
  };

  // Close expanded items when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setExpandedMobileItems([]);
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Desktop menu
  if (!isMobile) {
    return (
      <nav className="border-t border-white/10 bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-4">
            <li>
              <MegaMenuItem hasDropdown href="/products" label="Sản phẩm">
                <div className="flex gap-6">
                  {/* Categories */}
                  <div className="w-64 rounded-lg bg-white">
                    {categories.map(category => (
                      <MegaMenuItemLink
                        key={category.id}
                        href={`/categories/${category.id}`}
                        icon={category.icon}
                        isActive={category.id === activeCategory}
                        label={category.label}
                        onMouseEnter={() => setActiveCategory(category.id)}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <MegaMenuColumn
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
              <MegaMenuItem
                href="/nutrition-check"
                label="Kiểm Tra Dinh Dưỡng"
              />
            </li>
            <li>
              <MegaMenuItem href="/trusted-shops" label="Hệ Thống Cửa Hàng" />
            </li>
            <li>
              <MegaMenuItem href="/contact" label="Liên Hệ" />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  // Mobile menu
  return (
    <div ref={menuRef} className="border-t border-white/10 bg-white">
      <div className="container mx-auto px-4">
        <ul className="py-2 divide-y divide-white/10">
          {/* Products with submenu */}
          <li className="py-2">
            <div
              className="flex items-center justify-between text-white cursor-pointer py-2"
              onClick={() => toggleMobileItem('products')}>
              <span className="text-[15px] font-medium">Sản phẩm</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${expandedMobileItems.includes('products') ? 'rotate-180' : ''}`}
              />
            </div>
          </li>

          {/* Other menu items */}
          <li className="py-2">
            <Link
              className="block py-2 text-[15px] font-medium text-white"
              href="/solutions">
              Giải Pháp
            </Link>
          </li>
          <li className="py-2">
            <Link
              className="block py-2 text-[15px] font-medium text-white"
              href="/height-measurement">
              Đo Cao
            </Link>
          </li>
          <li className="py-2">
            <Link
              className="block py-2 text-[15px] font-medium text-white"
              href="/nutrition-check">
              Kiểm Tra Dinh Dưỡng
            </Link>
          </li>
          <li className="py-2">
            <Link
              className="block py-2 text-[15px] font-medium text-white"
              href="/trusted-shops">
              Hệ Thống Cửa Hàng
            </Link>
          </li>
          <li className="py-2">
            <Link
              className="block py-2 text-[15px] font-medium text-white"
              href="/contact">
              Liên Hệ
            </Link>
          </li>
        </ul>
      </div>

      {/* Full-screen mobile mega menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary-5 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Danh mục sản phẩm</h3>
            <button
              aria-label="Đóng menu"
              className="p-1 rounded-full hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Categories sidebar */}
            <div className="w-1/3 bg-grayscale-5 overflow-y-auto">
              <ul className="divide-y divide-grayscale-20">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 ${
                        category.id === activeCategory
                          ? 'bg-primary-5/10 text-primary-5 font-medium'
                          : 'text-grayscale-70'
                      }`}
                      onClick={() => setActiveCategory(category.id)}>
                      {category.icon && (
                        <div className="flex h-5 w-5 items-center justify-center">
                          <Image
                            alt=""
                            className={`h-5 w-5 ${category.id === activeCategory ? 'text-primary-40' : 'text-grayscale-50'}`}
                            height={20}
                            src={category.icon || '/placeholder.svg'}
                            width={20}
                          />
                        </div>
                      )}
                      <span className="text-sm truncate">{category.label}</span>
                      {category.id === activeCategory && (
                        <ChevronRight className="h-4 w-4 ml-auto text-primary-40" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content area */}
            <div className="w-2/3 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Category Products Grid */}
                {activeProducts && activeProducts.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {activeProducts.map(product => (
                      <Link
                        key={product.id}
                        className="flex flex-col items-center gap-2 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md text-center"
                        href={`/products/${product.id}`}
                        onClick={() => setMobileMenuOpen(false)}>
                        <Image
                          alt={product.name}
                          className="h-10 w-10 object-contain"
                          height={40}
                          src={product.image || '/placeholder.svg'}
                          width={40}
                        />
                        <span className="text-xs text-grayscale-90">
                          {product.name}
                        </span>
                      </Link>
                    ))}
                    <Link
                      className="flex flex-col items-center justify-center gap-1 rounded-lg bg-white p-3 shadow-sm text-xs text-grayscale-50"
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}>
                      <span>Xem thêm</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}

                {/* Best Selling Section */}
                {bestSellingProducts && bestSellingProducts.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-5">
                          <Image
                            alt=""
                            className="text-white"
                            height={16}
                            src="/placeholder.svg"
                            width={16}
                          />
                        </div>
                        <h3 className="text-sm font-medium text-grayscale-90">
                          Bán chạy nhất
                        </h3>
                      </div>
                      <Link
                        className="flex items-center gap-1 text-xs text-primary-40 hover:underline"
                        href="#"
                        onClick={() => setMobileMenuOpen(false)}>
                        Xem tất cả
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {bestSellingProducts.slice(0, 4).map(product => (
                        <Link
                          key={product.id}
                          className="group space-y-1"
                          href={`/products/${product.id}`}
                          onClick={() => setMobileMenuOpen(false)}>
                          <div className="relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              fill
                              alt={product.name}
                              className="object-contain transition-transform group-hover:scale-105"
                              src={product.image || '/placeholder.svg'}
                            />
                          </div>
                          <h4 className="line-clamp-2 text-xs text-grayscale-90 group-hover:text-primary-40">
                            {product.name}
                          </h4>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-medium text-primary-5">
                                {product.price.toLocaleString()}đ
                              </span>
                              <span className="text-xs text-grayscale-50">
                                /{product.unit}
                              </span>
                            </div>
                            <span className="text-xs text-grayscale-40 line-through">
                              {product.originalPrice.toLocaleString()}đ
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
