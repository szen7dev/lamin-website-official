import { MenuItemType, MenuItemTypeConfig } from '../types/mediaTypes';

export const MENU_TYPE_CONFIGS: Record<number, MenuItemTypeConfig> = {
  [MenuItemType.DEFAULT]: {
    hasContentArea: true,
    getLevel1Url: (slug: string) => `/danh-muc/${slug}`,
    getLevel2Url: (slug: string) => `/danh-muc/${slug}`,
    getLevel3Url: (slug: string) => `/danh-muc/${slug}`,
  },
  [MenuItemType.HEALTH_NEWS]: {
    hasContentArea: false,
    getLevel2Url: (slug: string) => `/chu-de/${slug}`,
    getLevel3Url: (slug: string) => `/chu-de/${slug}`,
  },
};

export function getMenuTypeConfig(type?: number): MenuItemTypeConfig {
  // Only handle type 2 specifically, all others use DEFAULT config
  return type === MenuItemType.HEALTH_NEWS
    ? MENU_TYPE_CONFIGS[MenuItemType.HEALTH_NEWS]
    : MENU_TYPE_CONFIGS[MenuItemType.DEFAULT];
}
