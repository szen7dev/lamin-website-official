import { MenuItemType, MenuItemTypeConfig } from '../types/mediaTypes';

export const MENU_TYPE_CONFIGS: Record<number, MenuItemTypeConfig> = {
  // Type 1: Products -> /san-pham
  [MenuItemType.CATEGORY]: {
    hasContentArea: true,
    getUrl: (slug: string) => `/san-pham`,
  },
  // Type 2: Health news topics -> /{slug} for level 1, /chu-de/{slug} for others
  // Exception: doi-ngu-chuyen-mon always goes directly to /{slug}
  [MenuItemType.NEWS]: {
    hasContentArea: false,
    getUrl: (slug: string, level?: number, type?: number) =>
       level === 1 || type === 3
        ? `/${slug}`
        : `/chu-de/${slug}`,
  },
  // Type 3: Unique pages -> /{slug}
  [MenuItemType.DEFAULT]: {
    hasContentArea: false,
    getUrl: (slug: string) => `/${slug}`,
  },
};

export function getMenuTypeConfig(type?: number): MenuItemTypeConfig {
  if (!type) return MENU_TYPE_CONFIGS[MenuItemType.DEFAULT];

  return MENU_TYPE_CONFIGS[type] || MENU_TYPE_CONFIGS[MenuItemType.DEFAULT];
}

// Helper function to get URL based on item type and level
export function getMenuItemUrl(item: {
  type?: number;
  slug: string;
  level?: number;
}): string {
  const config = getMenuTypeConfig(item.type);

  return config.getUrl(item.slug, item.level, item.type);
}
