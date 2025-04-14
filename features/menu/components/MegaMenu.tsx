'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import MegaMenuItem from './MegaMenuItem';
import MegaMenuItemLink from './MegaMenuItemLink';
import MegaMenuColumn from './MegaMenuColumn';

import { useGetMediasMenu } from '@/features/menu/hooks/useGetMediasMenu';
import { useGetBestSellers } from '@/features/menu/hooks/useGetBestSellers';
import { MediaItem } from '@/features/menu/types/mediaTypes';
import { getMenuTypeConfig } from '@/features/menu/services/menuTypeConfig';
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

  // Track expanded items at each level for mobile view
  const [expandedLevel1Items, setExpandedLevel1Items] = useState<string[]>([]);
  const [expandedLevel2Items, setExpandedLevel2Items] = useState<string[]>([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useRef<HTMLDivElement>(null);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    slug: item.slug,
    image:
      item.thumbnail &&
      typeof item.thumbnail === 'object' &&
      item.thumbnail.path
        ? apiClient.getFileUrl(item.thumbnail.path)
        : '/placeholder.svg',
  }));

  // Map best sellers to the format expected by MegaMenuColumn
  const bestSellingProducts = bestSellers.map(product => ({
    _id: product._id,
    name: product.name,
    image: product.thumbnail?.path
      ? apiClient.getFileUrl(product.thumbnail?.path)
      : '/placeholder.svg',
    price: product.sellingUnitprice,
    originalPrice: product.listedUnitprice, // Estimate original price as 20% higher if not provided
    unit: product.unit || 'hộp',
    category: product.category,
    slug: product.slug,
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

  // Toggle functions for each level in mobile view
  const toggleLevel1Item = (id: string) => {
    setExpandedLevel1Items(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const toggleLevel2Item = (id: string) => {
    setExpandedLevel2Items(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  // Close expanded items when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setExpandedLevel1Items([]);
      setExpandedLevel2Items([]);
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
      <nav className="bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-4">
            {/* Render level 1 items (top navigation) */}
            {formattedMenu.level1Items.map(item => {
              const hasDropdown =
                formattedMenu.level2ItemsByParent[item._id]?.length > 0;
              const menuTypeConfig = getMenuTypeConfig(item.type);

              return (
                <li key={item._id} className="relative">
                  <MegaMenuItem
                    hasDropdown={hasDropdown}
                    href={
                      menuTypeConfig.getLevel1Url?.(item.slug) ||
                      `/${item.slug}`
                    }
                    isActive={item._id === activeLevel1Item}
                    label={item.name}>
                    {hasDropdown && (
                      <div
                        ref={dropdownRef}
                        className="flex pb-2"
                        onMouseEnter={() => {
                          // Ensure we have an active level 2 item when entering the dropdown
                          if (
                            activeLevel2Item === null &&
                            level2Items.length > 0
                          ) {
                            setActiveLevel2Item(level2Items[0]._id);
                          }
                        }}>
                        {/* Level 2 items (sidebar) */}
                        <div className="w-64 bg-white rounded-l-lg border-r border-grayscale-10">
                          {(
                            formattedMenu.level2ItemsByParent[item._id] || []
                          ).map((category: MediaItem) => (
                            <MegaMenuItemLink
                              key={category._id}
                              href={`${menuTypeConfig.getLevel2Url(category.slug)}`}
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

                        {/* Content area with level 3 items and best sellers - only show based on type config */}
                        {menuTypeConfig.hasContentArea && (
                          <div
                            className="flex-1 bg-[#F1F4FD] p-3 min-w-[600px]"
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
                              menuType={item.type}
                            />
                          </div>
                        )}
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

  // Mobile menu with animated dropdowns
  return (
    <div
      ref={menuRef}
      className="border-t border-grayscale-20 bg-white relative">
      <div className="mx-auto">
        <ul className="py-2 divide-y divide-grayscale-20">
          {/* Render level 1 items */}
          {formattedMenu.level1Items.map(item => {
            const hasLevel2Items =
              formattedMenu.level2ItemsByParent[item._id]?.length > 0;
            const isExpanded = expandedLevel1Items.includes(item._id);

            return (
              <li key={item._id} className="py-2">
                <button
                  className="flex items-center justify-between text-grayscale-90 cursor-pointer py-2 w-full text-left"
                  onClick={() => toggleLevel1Item(item._id)}>
                  <div className="flex items-center">
                    <span className="text-[15px] font-medium">{item.name}</span>
                  </div>
                  {hasLevel2Items && (
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Level 2 items - animated dropdown */}
                {hasLevel2Items && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? 'max-h-[1000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}>
                    <ul className="pl-4 py-3 space-y-0 bg-[#e7edfb] rounded-2xl mt-2">
                      {(formattedMenu.level2ItemsByParent[item._id] || []).map(
                        (level2Item, index, array) => {
                          const hasLevel3Items =
                            formattedMenu.level3ItemsByParent[level2Item._id]
                              ?.length > 0;
                          const isLevel2Expanded = expandedLevel2Items.includes(
                            level2Item._id,
                          );
                          const isLastItem = index === array.length - 1;

                          return (
                            <li
                              key={level2Item._id}
                              className="border-grayscale-20">
                              <div className="flex items-center">
                                {hasLevel3Items ? (
                                  <button
                                    className="flex items-center justify-between text-grayscale-80 w-full py-1.5"
                                    onClick={() =>
                                      toggleLevel2Item(level2Item._id)
                                    }>
                                    <div className="flex justify-start items-center">
                                      <Image
                                        alt={level2Item.name}
                                        height={32}
                                        src={
                                          level2Item.thumbnail &&
                                          typeof level2Item.thumbnail ===
                                            'object' &&
                                          level2Item.thumbnail.path
                                            ? apiClient.getFileUrl(
                                                level2Item.thumbnail.path,
                                              )
                                            : '/placeholder.svg'
                                        }
                                        width={32}
                                      />
                                      <span className="text-[14px]">
                                        {level2Item.name}
                                      </span>
                                    </div>
                                  </button>
                                ) : (
                                  <Link
                                    className="text-[14px] text-grayscale-80 py-1.5 block w-full decoration-transparent"
                                    href={getMenuTypeConfig(
                                      item.type,
                                    ).getLevel2Url(level2Item.slug)}>
                                    {level2Item.name}
                                  </Link>
                                )}
                              </div>

                              {/* Level 3 items - animated dropdown */}
                              {hasLevel3Items && (
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isLevel2Expanded
                                      ? 'max-h-[500px] opacity-100'
                                      : 'max-h-0 opacity-0'
                                  }`}>
                                  <ul className="pl-3 py-1 space-y-1">
                                    {(
                                      formattedMenu.level3ItemsByParent[
                                        level2Item._id
                                      ] || []
                                    ).map(level3Item => (
                                      <li
                                        key={level3Item._id}
                                        className="border-l border-grayscale-20 pl-2">
                                        <Link
                                          className="text-[13px] text-grayscale-70 py-1 block decoration-transparent"
                                          href={getMenuTypeConfig(
                                            item.type,
                                          ).getLevel3Url(level3Item.slug)}>
                                          {level3Item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Separator - not shown for last item */}
                              {!isLastItem && (
                                <div className="h-px bg-gray-200 my-1 mx-2" />
                              )}
                            </li>
                          );
                        },
                      )}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
