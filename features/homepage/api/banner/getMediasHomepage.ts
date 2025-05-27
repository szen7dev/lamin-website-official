import type {
  Banner,
  BannerQueryParams,
} from '@/features/homepage/types/bannerTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

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

    const response = await apiClient.get<Banner[]>(
      '/api/medias/banner',
      queryParams,
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching homepage banners:', error);

    return [];
  }
};
