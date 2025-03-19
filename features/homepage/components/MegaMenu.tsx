'use client';

import { useState } from 'react';

import MegaMenuItem from './MegaMenuItem';
import MegaMenuItemLink from './MegaMenuItemLink';
import MegaMenuColumn from './MegaMenuColumn';

import { useMenu } from '@/features/menu/hooks/useMenu';

export default function MegaMenu() {
  const { categories, bestSellingProducts } = useMenu();
  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0].id : '',
  );

  const activeProducts =
    categories.find(cat => cat.id === activeCategory)?.products || [];

  return (
    <nav className="border-t border-white/10">
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
            <MegaMenuItem href="/nutrition-check" label="Kiểm Tra Dinh Dưỡng" />
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
