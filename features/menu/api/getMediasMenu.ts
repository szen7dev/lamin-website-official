import { MediaItem, MediaMenuParams } from '@/features/menu/types/mediaTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getMediasMenu = async (
  params: MediaMenuParams = {},
): Promise<MediaItem[]> => {
  try {
    const defaultPopulatesObject = {
      path: 'thumbnail childs',
      select: 'name slug path childs thumbnail',
      populate: { path: 'childs', select: 'name slug thumbnail' },
    };

    const queryParams = {
      select:
        params.select ||
        'name slug order parent childs type company status level thumbnail',
      optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
      status: params.status ?? 1,
      populates: params.populates || JSON.stringify(defaultPopulatesObject),
      ...params,
    };

    const response = await apiClient.get<MediaItem[]>(
      '/api/medias/menu',
      queryParams,
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching media menu: ${error.message}`, error);
    } else {
      console.error('Unknown error fetching media menu:', error);
    }

    return [];
  }
};
