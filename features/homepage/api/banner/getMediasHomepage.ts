import type { Banner, BannerQueryParams } from '@/services/media/bannerService';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Get banners for homepage
 * @param params Query parameters for fetching banners
 * @returns List of banners used for the homepage
 */
export const getMediasHomepage = async (
  params: BannerQueryParams = {},
): Promise<Banner[]> => {
  try {
    const queryParams = {
      select: 'name link type thumbnail slug',
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      status: params.status || 1,
      populates: JSON.stringify({ path: 'thumbnail', select: 'path' }),
      ...params,
    };

    // The apiClient.get method now handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const banners = await apiClient.getNormalizedResponse<Banner[]>(
      '/api/medias/banner',
      queryParams,
    );

    return banners || [];
  } catch (error) {
    console.error('Error fetching homepage banners:', error);

    return [];
  }
};
