import type { CommonQueryParams } from '../types/common';

import apiClient, { DEFAULT_OPTION_SELLER } from '../api/apiClient';

import { Thumbnail } from '@/types';

export interface Banner {
  _id: string;
  type: number; // 1-5: Static banners, 6: Slide, 7: Features, 8-11: Footer columns
  name: string;
  state?: number;
  userCreate?: string;
  userUpdate?: string;
  company?: string;
  images?: string[];
  link: string;
  status: number;
  createdAt: string;
  modifiedAt: string;
  thumbnail: Thumbnail;
  __v: number;
  slug?: string;
}

export interface BannerQueryParams extends CommonQueryParams {
  type?: number;
  status?: number;
  limit?: number;
  select?: string;
}

class BannerService {
  // Get banners by type
  async getBanners(params?: BannerQueryParams): Promise<Banner[]> {
    try {
      const queryParams = {
        optionSeller: DEFAULT_OPTION_SELLER,
        ...params,
      };

      const response = await apiClient.get<Banner[]>(
        '/api/medias/banner',
        queryParams,
      );

      return response;
    } catch (error) {
      console.error('Error fetching banners:', error);

      return [];
    }
  }

  // Get slides
  async getSlides(): Promise<Banner[]> {
    return this.getBanners({ type: 6 });
  }

  // Get features
  async getFeatures(): Promise<Banner[]> {
    return this.getBanners({ type: 7 });
  }

  // Get footer columns
  async getFooterColumns(): Promise<{ [key: string]: Banner[] }> {
    try {
      const columns: { [key: string]: Banner[] } = {};

      // Fetch all footer columns (types 8-11)
      for (let i = 8; i <= 11; i++) {
        const banners = await this.getBanners({ type: i });

        columns[`column${i - 7}`] = banners;
      }

      return columns;
    } catch (error) {
      console.error('Error fetching footer columns:', error);

      return {};
    }
  }
}

// Create and export a singleton instance
export const bannerService = new BannerService();

export default bannerService;
