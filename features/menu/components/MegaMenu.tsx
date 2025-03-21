'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import MegaMenuItem from './MegaMenuItem';
import MegaMenuItemLink from './MegaMenuItemLink';
import MegaMenuColumn from './MegaMenuColumn';

import { useGetMediasMenu } from '@/features/menu/hooks/useGetMediasMenu';
import { useGetBestSellers } from '@/features/menu/hooks/useGetBestSellers';
import { MediaItem } from '@/features/menu/types/mediaTypes';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import apiClient from '@/services/api/apiClient';

// Hard-coded main navigation items matching the design
const mainNavItems = [
  { id: 'products', label: 'Sản phẩm', href: '/products', hasDropdown: true },
  {
    id: 'solutions',
    label: 'Giải Pháp',
    href: '/solutions',
    hasDropdown: false,
  },
  {
    id: 'height',
    label: 'Đo Cao',
    href: '/height-measurement',
    hasDropdown: false,
  },
  {
    id: 'nutrition',
    label: 'Kiểm Tra Dinh Dưỡng',
    href: '/nutrition-check',
    hasDropdown: false,
  },
  {
    id: 'shops',
    label: 'Hệ Thống Cửa Hàng',
    href: '/trusted-shops',
    hasDropdown: false,
  },
  { id: 'contact', label: 'Liên Hệ', href: '/contact', hasDropdown: false },
];

export default function MegaMenu() {
  // Fetch menu data using our custom hook
  const {
    mediaItems,
    isLoading: isLoadingMenu,
    error: menuError,
  } = useGetMediasMenu({
    params: {
      status: 1,
    },
  });

  // Fetch best sellers
  const {
    bestSellers,
    isLoading: isLoadingBestSellers,
    error: bestSellersError,
  } = useGetBestSellers({
    params: {
      limit: 4, // Limit to 4 items for the menu
      status: 1,
    },
  });

  // Get menu categories (level 2 items that are child of the main "Sản phẩm" category)
  // In this case, we're looking for items with type = 1, which represent categories
  const categoryItems = mediaItems.filter((item: MediaItem) => item.type === 1);

  // State management
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryItems.length > 0 ? categoryItems[0]?._id : null,
  );
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useRef<HTMLDivElement>(null);

  // Find active category and get its child items (level 3)
  const activeCategoryItem = categoryItems.find(
    (item: MediaItem) => item._id === activeCategory,
  );
  const subCategoryItems = activeCategoryItem?.childs || [];

  // Map subcategory items to the expected format for MegaMenuColumn
  const categoryProducts = subCategoryItems.map((item: MediaItem) => ({
    id: item._id,
    name: item.name,
    image: item.thumbnail
      ? apiClient.getFileUrl(item.thumbnail)
      : '/placeholder.svg',
  }));

  // Map best sellers to the format expected by MegaMenuColumn
  const bestSellingProducts = bestSellers.map(product => ({
    id: product._id,
    name: product.name,
    image: product.thumbnail?.path
      ? apiClient.getFileUrl(product.thumbnail.path)
      : '/placeholder.svg',
    price: product.sellingUnitprice,
    originalPrice: Math.round(product.sellingUnitprice * 1.2), // Estimate original price as 20% higher if not provided
    unit: product.unit || 'hộp',
  }));

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

  // Handle loading state
  const isLoading = isLoadingMenu || isLoadingBestSellers;

  if (isLoading) {
    return <div className="py-4 text-center">Loading menu...</div>;
  }

  // Handle error state
  const error = menuError || bestSellersError;

  if (error) {
    console.error('Error loading menu data:', error);

    return <div className="py-4 text-center">Failed to load menu</div>;
  }

  // Desktop menu
  if (!isMobile) {
    return (
      <nav className="border-t border-white/10 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-4">
            {/* Render hard-coded main navigation items */}
            {mainNavItems.map(item => (
              <li key={item.id}>
                {item.hasDropdown ? (
                  <MegaMenuItem hasDropdown href={item.href} label={item.label}>
                    <div className="flex gap-6">
                      {/* Category sidebar */}
                      <div className="w-64 rounded-lg bg-white">
                        {categoryItems.map((category: MediaItem) => (
                          <MegaMenuItemLink
                            key={category._id}
                            href={`/categories/${category.slug}`}
                            icon={category.thumbnail}
                            isActive={category._id === activeCategory}
                            label={category.name}
                            onMouseEnter={() => setActiveCategory(category._id)}
                          />
                        ))}
                      </div>

                      {/* Content area */}
                      <div className="flex-1">
                        <MegaMenuColumn
                          bestSellingProducts={bestSellingProducts}
                          categoryProducts={categoryProducts}
                        />
                      </div>
                    </div>
                  </MegaMenuItem>
                ) : (
                  <MegaMenuItem href={item.href} label={item.label} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  // Mobile menu
  return (
    <div
      ref={menuRef}
      className="border-t border-white/10 bg-gradient-to-r from-blue-600 to-blue-500">
      <div className="container mx-auto px-4">
        <ul className="py-2 divide-y divide-white/10">
          {/* Render mobile main menu items */}
          {mainNavItems.map(item => (
            <li key={item.id} className="py-2">
              {item.hasDropdown ? (
                <button
                  className="flex items-center justify-between text-white cursor-pointer py-2 w-full text-left"
                  onClick={() => toggleMobileItem(item.id)}>
                  <span className="text-[15px] font-medium">{item.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      expandedMobileItems.includes(item.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  className="block py-2 text-[15px] font-medium text-white"
                  href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
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
                {categoryItems.map((category: MediaItem) => (
                  <li key={category._id}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 ${
                        category._id === activeCategory
                          ? 'bg-primary-5/10 text-primary-5 font-medium'
                          : 'text-grayscale-70'
                      }`}
                      onClick={() => setActiveCategory(category._id)}>
                      {category.thumbnail && (
                        <div className="flex h-5 w-5 items-center justify-center">
                          <Image
                            alt={category.name}
                            className={`h-5 w-5 ${category._id === activeCategory ? 'text-primary-40' : 'text-grayscale-50'}`}
                            height={20}
                            src={apiClient.getFileUrl(category.thumbnail)}
                            width={20}
                          />
                        </div>
                      )}
                      <span className="text-sm truncate">{category.name}</span>
                      {category._id === activeCategory && (
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
                {categoryProducts.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {categoryProducts.map(
                      (product: {
                        id: string;
                        name: string;
                        image: string;
                      }) => (
                        <Link
                          key={product.id}
                          className="flex flex-col items-center gap-2 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md text-center"
                          href={`/products/${product.id}`}
                          onClick={() => setMobileMenuOpen(false)}>
                          <Image
                            alt={product.name}
                            className="h-10 w-10 object-contain"
                            height={40}
                            src={product.image}
                            width={40}
                          />
                          <span className="text-xs text-grayscale-90">
                            {product.name}
                          </span>
                        </Link>
                      ),
                    )}
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
                {bestSellingProducts.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-5">
                          <Image
                            alt="Bán chạy nhất"
                            className="text-white"
                            height={16}
                            src="/icons/top-products.svg"
                            width={16}
                          />
                        </div>
                        <h3 className="text-sm font-medium text-grayscale-90">
                          Bán chạy nhất
                        </h3>
                      </div>
                      <Link
                        className="flex items-center gap-1 text-xs text-primary-40 hover:underline"
                        href="/best-selling"
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
                              src={product.image}
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
