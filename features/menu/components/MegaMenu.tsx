'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

// Format menu data based on levels
interface FormattedMenuData {
  level1Items: MediaItem[];
  level2ItemsByParent: Record<string, MediaItem[]>;
  level3ItemsByParent: Record<string, MediaItem[]>;
}

function formatMenuData(mediaItems: MediaItem[]): FormattedMenuData {
  // Sort all items by order
  const sortedItems = [...mediaItems].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  // Group items by level
  const level1Items: MediaItem[] = [];
  const level2Items: MediaItem[] = [];
  const level3Items: MediaItem[] = [];

  // First pass: identify items by level
  sortedItems.forEach(item => {
    if (item.level === 1) {
      level1Items.push(item);
    } else if (item.level === 2) {
      level2Items.push(item);
    } else if (item.level === 3) {
      level3Items.push(item);
    } else if (item.childs?.length) {
      // If level isn't specified but item has children, treat as level 1
      level1Items.push(item);

      // Process any children that might be level 2
      item.childs.forEach(child => {
        level2Items.push({
          ...child,
          parent: item._id, // Ensure parent relationship
        });

        // Process any level 3 items (grandchildren)
        if (child.childs?.length) {
          child.childs.forEach(grandchild => {
            level3Items.push({
              ...grandchild,
              parent: child._id, // Ensure parent relationship
            });
          });
        }
      });
    }
  });

  // Organize level 2 items by their parent
  const level2ItemsByParent: Record<string, MediaItem[]> = {};

  level2Items.forEach(item => {
    const parentId = item.parent || '';

    if (!level2ItemsByParent[parentId]) {
      level2ItemsByParent[parentId] = [];
    }
    level2ItemsByParent[parentId].push(item);
  });

  // Organize level 3 items by their parent
  const level3ItemsByParent: Record<string, MediaItem[]> = {};

  level3Items.forEach(item => {
    const parentId = item.parent || '';

    if (!level3ItemsByParent[parentId]) {
      level3ItemsByParent[parentId] = [];
    }
    level3ItemsByParent[parentId].push(item);
  });

  // Sort items within each group by order
  Object.keys(level2ItemsByParent).forEach(parentId => {
    level2ItemsByParent[parentId].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  });

  Object.keys(level3ItemsByParent).forEach(parentId => {
    level3ItemsByParent[parentId].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  });

  return {
    level1Items,
    level2ItemsByParent,
    level3ItemsByParent,
  };
}

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

  // Format menu data by levels
  const formattedMenu = formatMenuData(mediaItems);

  // State management
  const [activeLevel1Item, setActiveLevel1Item] = useState<string | null>(
    formattedMenu.level1Items.length > 0
      ? formattedMenu.level1Items[0]?._id
      : null,
  );

  const [activeLevel2Item, setActiveLevel2Item] = useState<string | null>(null);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useRef<HTMLDivElement>(null);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  // Get level 2 items for the active level 1 item
  const level2Items = activeLevel1Item
    ? formattedMenu.level2ItemsByParent[activeLevel1Item] || []
    : [];

  // Get level 3 items for the active level 2 item
  const level3Items = activeLevel2Item
    ? formattedMenu.level3ItemsByParent[activeLevel2Item] || []
    : [];

  // Map level 3 items to the expected format for MegaMenuColumn
  const categoryProducts = level3Items.map((item: MediaItem) => ({
    id: item._id,
    name: item.name,
    image:
      item.thumbnail &&
      typeof item.thumbnail === 'object' &&
      item.thumbnail.path
        ? apiClient.getFileUrl(item.thumbnail.path)
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

  // Handle level 2 hover with debounce
  const handleLevel2Hover = useCallback((itemId: string) => {
    // Set immediately rather than using a timeout
    setActiveLevel2Item(itemId);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
    };
  }, []);

  const toggleMobileItem = (id: string) => {
    const isDropdownItem = formattedMenu.level1Items.find(
      item =>
        item._id === id &&
        formattedMenu.level2ItemsByParent[item._id]?.length > 0,
    );

    if (isDropdownItem) {
      setActiveLevel1Item(id);
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

  // When active level 1 item changes, reset active level 2 item
  useEffect(() => {
    if (activeLevel1Item) {
      const level2ItemsForActive =
        formattedMenu.level2ItemsByParent[activeLevel1Item] || [];

      if (level2ItemsForActive.length > 0) {
        setActiveLevel2Item(level2ItemsForActive[0]._id);
      } else {
        setActiveLevel2Item(null);
      }
    }
  }, [activeLevel1Item, formattedMenu.level2ItemsByParent]);

  // Ensure active level 2 item is never set to null if there are level 2 items available
  useEffect(() => {
    if (activeLevel2Item === null && level2Items.length > 0) {
      setActiveLevel2Item(level2Items[0]._id);
    }
  }, [activeLevel2Item, level2Items]);

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
      <nav className="border-b border-grayscale-20 bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-4">
            {/* Render level 1 items (top navigation) */}
            {formattedMenu.level1Items.map(item => {
              const hasDropdown =
                formattedMenu.level2ItemsByParent[item._id]?.length > 0;

              return (
                <li key={item._id} className="relative">
                  <MegaMenuItem
                    hasDropdown={hasDropdown}
                    href={`/${item.slug}`}
                    isActive={item._id === activeLevel1Item}
                    label={item.name}>
                    {hasDropdown && (
                      <div
                        ref={dropdownRef}
                        className="flex pb-2"
                        onMouseEnter={() => {
                          setIsDropdownHovered(true);
                          // Ensure we have an active level 2 item when entering the dropdown
                          if (
                            activeLevel2Item === null &&
                            level2Items.length > 0
                          ) {
                            setActiveLevel2Item(level2Items[0]._id);
                          }
                        }}
                        onMouseLeave={() => setIsDropdownHovered(false)}>
                        {/* Level 2 items (sidebar) */}
                        <div className="w-64 bg-white rounded-l-lg border-r border-grayscale-10">
                          {(
                            formattedMenu.level2ItemsByParent[item._id] || []
                          ).map((category: MediaItem) => (
                            <MegaMenuItemLink
                              key={category._id}
                              href={`/categories/${category.slug}`}
                              icon={
                                category.thumbnail &&
                                typeof category.thumbnail === 'object'
                                  ? category.thumbnail.path
                                  : category.thumbnail
                              }
                              isActive={category._id === activeLevel2Item}
                              label={category.name}
                              onMouseEnter={() =>
                                handleLevel2Hover(category._id)
                              }
                            />
                          ))}
                        </div>

                        {/* Content area with level 3 items and best sellers */}
                        <div
                          className="flex-1 bg-[#F1F4FD] p-3"
                          onMouseEnter={() => {
                            // Ensure active level 2 item stays selected when hovering content area
                            if (
                              activeLevel2Item === null &&
                              level2Items.length > 0
                            ) {
                              setActiveLevel2Item(level2Items[0]._id);
                            }
                          }}>
                          <MegaMenuColumn
                            bestSellingProducts={bestSellingProducts}
                            categoryProducts={categoryProducts}
                          />
                        </div>
                      </div>
                    )}
                  </MegaMenuItem>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  // Mobile menu
  return (
    <div ref={menuRef} className="border-t border-grayscale-20 bg-white">
      <div className="container mx-auto px-4">
        <ul className="py-2 divide-y divide-grayscale-20">
          {/* Render level 1 items */}
          {formattedMenu.level1Items.map(item => {
            const hasDropdown =
              formattedMenu.level2ItemsByParent[item._id]?.length > 0;

            return (
              <li key={item._id} className="py-2">
                {hasDropdown ? (
                  <button
                    className="flex items-center justify-between text-grayscale-90 cursor-pointer py-2 w-full text-left"
                    onClick={() => toggleMobileItem(item._id)}>
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white mr-2">
                        <span className="text-sm">G</span>
                      </div>
                      <span className="text-[15px] font-medium">
                        {item.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        expandedMobileItems.includes(item._id)
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    className="flex items-center py-2 text-[15px] font-medium text-grayscale-90"
                    href={`/${item.slug}`}>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white mr-2">
                      <span className="text-sm">G</span>
                    </div>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Full-screen mobile mega menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary-5 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {formattedMenu.level1Items.find(
                item => item._id === activeLevel1Item,
              )?.name || 'Danh mục sản phẩm'}
            </h3>
            <button
              aria-label="Đóng menu"
              className="p-1 rounded-full hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Level 2 items (categories sidebar) */}
            <div className="w-1/3 bg-grayscale-5 overflow-y-auto">
              <ul className="divide-y divide-grayscale-20">
                {(
                  formattedMenu.level2ItemsByParent[activeLevel1Item || ''] ||
                  []
                ).map((category: MediaItem) => (
                  <li key={category._id}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 ${
                        category._id === activeLevel2Item
                          ? 'bg-primary-5/10 text-primary-5 font-medium'
                          : 'text-grayscale-70'
                      }`}
                      onClick={() => setActiveLevel2Item(category._id)}>
                      {category.thumbnail && (
                        <div className="flex h-5 w-5 items-center justify-center">
                          <Image
                            alt={category.name}
                            className={`h-5 w-5 ${category._id === activeLevel2Item ? 'text-primary-40' : 'text-grayscale-50'}`}
                            height={20}
                            src={
                              typeof category.thumbnail !== 'string' &&
                              category.thumbnail?.path
                                ? apiClient.getFileUrl(category.thumbnail.path)
                                : '/placeholder.svg'
                            }
                            width={20}
                          />
                        </div>
                      )}
                      <span className="text-sm truncate">{category.name}</span>
                      {category._id === activeLevel2Item && (
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
                {/* Level 3 products grid */}
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
                            src="top-products.svg"
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
                              sizes="(max-width: 768px) 100vw, 150px"
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
