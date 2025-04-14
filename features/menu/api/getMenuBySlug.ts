/**
 * API function to fetch media menu items from the backend
 */
import { MediaItem, MediaMenuParams } from '@/features/menu/types/mediaTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches media menu data from the API
 * @param params - Query parameters to customize the request
 * @returns Promise resolving to an array of MediaItem objects
 */
export const getMenuBySlug = async (
  params: MediaMenuParams = {},
): Promise<MediaItem> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
      slug: params.slug,
      ...params,
    };

    // Make API request
    const response = await apiClient.getNormalizedResponse<any>(
      '/api/medias/menu',
      queryParams,
    );

    // Extract media items from the response
    return response;
  } catch (error) {
    // Provide detailed error information
    if (error instanceof Error) {
      console.error(`Error fetching media menu: ${error.message}`, error);
    } else {
      console.error('Unknown error fetching media menu:', error);
    }

    // Return empty array to prevent UI crashes
    return {
      _id: '',
      name: '',
      slug: '',
    };
  }
};
