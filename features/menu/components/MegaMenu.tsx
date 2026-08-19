'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

function formatMenuData(mediaItems: MediaItem[]): MediaItem[] {
  return [...mediaItems].sort((a, b) => (a.order || 0) - (b.order || 0));
}

interface MegaMenuProps {
  onLinkClick?: () => void;
}

export default function MegaMenu({ onLinkClick }: MegaMenuProps) {
  const {
    mediaItems,
    isLoading: isLoadingMenu,
    error: menuError,
  } = useGetMediasMenu();

  const {
    bestSellers,
    isLoading: isLoadingBestSellers,
    error: bestSellersError,
  } = useGetBestSellers({
    params: {
      limit: 4,
      status: 1,
    },
  });

  const menuItems = useMemo(() => {
    const allItems = formatMenuData(mediaItems).filter(
      item => item.slug !== 'he-thong-cua-hang' && item.status === 1,
    );

    allItems.forEach(item => {
      item.childs = item?.childs?.filter(child => child.status === 1);
    });

    return allItems;
  }, [mediaItems]);

  const [activeChildItem, setActiveChildItem] = useState<string | null>(null);

  const [expandedParentItems, setExpandedParentItems] = useState<string[]>([]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useRef<HTMLDivElement>(null);

  const bestSellingProducts = useMemo(
    () =>
      bestSellers.map(product => ({
        _id: product._id,
        name: product.name,
        image: product.thumbnail?.path
          ? apiClient.getFileUrl(product.thumbnail?.path)
          : '/placeholder.svg',
        price: product.sellingUnitprice,
        originalPrice: product.listedUnitprice,
        unit: product.unit || 'hộp',
        category: product.category,
        slug: product.slug,
      })),
    [bestSellers],
  );

  const handleChildHover = useCallback((itemId: string) => {
    setActiveChildItem(itemId);
  }, []);
  const toggleParentItem = useCallback((id: string) => {
    setExpandedParentItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setExpandedParentItems([]);
    }
  }, [isMobile]);

  const isLoading = isLoadingMenu || isLoadingBestSellers;

  if (isLoading) {
    return <div className="py-4 text-center">Loading menu...</div>;
  }

  const error = menuError || bestSellersError;

  if (error) {
    console.error('Error loading menu data:', error);

    return <div className="py-4 text-center">Failed to load menu</div>;
  }

  if (!isMobile) {
    return (
      <nav className="flex-1">
        <ul className="flex items-center justify-center gap-4 xl:gap-6">
          {/* Render all menu items */}
          {menuItems.map(item => {
            const hasChildren = item.childs && item.childs.length > 0;
            const menuTypeConfig = getMenuTypeConfig(item.type);

            return (
              <li key={item._id} className="relative">
                <MegaMenuItem
                  hasDropdown={hasChildren}
                  href={menuTypeConfig.getUrl(item.slug, item.level, item.type)}
                  label={item.name}>
                  {hasChildren && (
                    <div className="flex pb-2">
                      {/* Children items (sidebar) */}
                      <div className="w-64 bg-white rounded-l-lg border-grayscale-10">
                        {item.childs!.map((child: MediaItem) => {
                          // Children inherit parent's routing type
                          const parentConfig = getMenuTypeConfig(item.type);

                          return (
                            <MegaMenuItemLink
                              key={child._id}
                              href={parentConfig.getUrl(
                                child.slug,
                                child.level,
                                child.type,
                              )}
                              icon={
                                child.thumbnail &&
                                typeof child.thumbnail === 'object'
                                  ? child.thumbnail.path
                                  : child.thumbnail
                              }
                              isActive={child._id === activeChildItem}
                              label={child.name}
                              onMouseEnter={() => handleChildHover(child._id)}
                            />
                          );
                        })}
                      </div>

                      {/* Content area with best sellers - only show for type 1 (products) */}
                      {menuTypeConfig.hasContentArea && (
                        <div className="flex-1 bg-[#F1F4FD] p-3 min-w-[600px]">
                          <MegaMenuColumn
                            bestSellingProducts={bestSellingProducts}
                            categoryProducts={[]}
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
          {/* Render all menu items */}
          {menuItems.map(item => {
            const hasChildren = item.childs && item.childs.length > 0;
            const isExpanded = expandedParentItems.includes(item._id);
            const menuTypeConfig = getMenuTypeConfig(item.type);

            return (
              <li key={item._id} className="py-2">
                <div className="flex items-center justify-between text-grayscale-90 w-full text-left">
                  {hasChildren ? (
                    <button
                      className="flex items-center flex-grow cursor-pointer py-2"
                      onClick={() => {
                        toggleParentItem(item._id);
                      }}>
                      <span className="text-[15px] font-medium">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      className="flex items-center flex-grow py-2 decoration-transparent no-underline text-inherit"
                      href={menuTypeConfig.getUrl(
                        item.slug,
                        item.level,
                        item.type,
                      )}
                      onClick={onLinkClick}>
                      <span className="text-[15px] font-medium">
                        {item.name}
                      </span>
                    </Link>
                  )}
                  {hasChildren && (
                    <button
                      className="p-2"
                      onClick={() => toggleParentItem(item._id)}>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Children items - animated dropdown */}
                {hasChildren && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? 'max-h-[1000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}>
                    <ul className="pl-4 py-3 space-y-0 bg-[#e7edfb] rounded-2xl mt-2">
                      {item.childs!.map((child, index, array) => {
                        const isLastItem = index === array.length - 1;
                        // Children inherit parent's routing type
                        const parentConfig = getMenuTypeConfig(item.type);

                        return (
                          <li key={child._id} className="border-grayscale-20">
                            <Link
                              className="flex items-center text-grayscale-80 py-1.5 block w-full decoration-transparent"
                              href={parentConfig.getUrl(
                                child.slug,
                                child.level,
                                child.type,
                              )}
                              onClick={onLinkClick}>
                              {child.thumbnail && (
                                <Image
                                  alt=""
                                  aria-hidden="true"
                                  height={32}
                                  src={
                                    typeof child.thumbnail === 'object' &&
                                    child.thumbnail.path
                                      ? apiClient.getFileUrl(
                                          child.thumbnail.path,
                                        )
                                      : '/placeholder.svg'
                                  }
                                  width={32}
                                />
                              )}
                              <span className="text-[14px]">{child.name}</span>
                            </Link>

                            {/* Separator - not shown for last item */}
                            {!isLastItem && (
                              <div className="h-px bg-gray-200 my-1 mx-2" />
                            )}
                          </li>
                        );
                      })}
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
