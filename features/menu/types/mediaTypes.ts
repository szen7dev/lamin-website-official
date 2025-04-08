/**
 * Represents a single media menu item
 */
export interface MediaItem {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  order?: number;
  level?: number;
  company?: string;
  type?: number;
  status?: number;
  thumbnail?:
    | string
    | {
        _id: string;
        name?: string;
        path: string;
      };
  childs?: MediaItem[];
}

/**
 * Parameters for media menu API requests
 */
export interface MediaMenuParams {
  select?: string;
  optionSeller?: number;
  status?: number;
  isParent?: number;
  sortKey?: string | string[];
  populates?: string | Record<string, any>;
  [key: string]: any;
}

/**
 * Raw API response structure from the media menu endpoint
 */
export type MediaMenuResponse =
  | {
      error: boolean;
      data: {
        listRecords: MediaItem[];
      };
    }
  | {
      error: boolean;
      data: {
        data: {
          listRecords: MediaItem[];
        };
      };
    }
  | {
      error: boolean;
      listRecords: MediaItem[];
    }
  | MediaItem[];

export enum MenuItemType {
  DEFAULT = 1,
  HEALTH_NEWS = 2,
}

export interface MenuItemTypeConfig {
  hasContentArea: boolean;
  getLevel1Url?: (slug: string) => string;
  getLevel2Url: (slug: string) => string;
  getLevel3Url: (slug: string) => string;
}
