/**
 * API function to fetch media menu items from the backend
 */
import {
  MediaItem,
  MediaMenuParams,
  MediaMenuResponse,
} from '@/features/menu/types/mediaTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Safely extracts media items from various response structures
 * @param response - The API response with potentially varying structure
 * @returns An array of MediaItem objects
 */
const extractMediaItems = (response: any): MediaItem[] => {
  if (!response) return [];

  // Direct array response
  if (Array.isArray(response)) {
    return response;
  }

  // Handle object responses
  if (typeof response === 'object') {
    // Case 1: response.listRecords
    if (response.listRecords && Array.isArray(response.listRecords)) {
      return response.listRecords;
    }

    // Case 2: response.data.listRecords
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.listRecords)) {
        return response.data.listRecords;
      }

      // Case 3: response.data.data.listRecords (deeply nested)
      if (
        response.data.data &&
        typeof response.data.data === 'object' &&
        Array.isArray(response.data.data.listRecords)
      ) {
        return response.data.data.listRecords;
      }
    }
  }

  console.warn('Unexpected response structure:', response);

  return [];
};

/**
 * Fetches media menu data from the API
 * @param params - Query parameters to customize the request
 * @returns Promise resolving to an array of MediaItem objects
 */
export const getMediasMenu = async (
  params: MediaMenuParams = {},
): Promise<MediaItem[]> => {
  try {
    // Default populates object for efficient data loading
    const defaultPopulatesObject = {
      path: 'childs images',
      select: 'media_menu',
    };

    // Prepare query parameters with sensible defaults
    const queryParams = {
      // Include essential fields based on the screenshot
      select:
        params.select ||
        'name slug order parent childs type company status order thumbnail',
      optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
      status: params.status ?? 1,
      populates: params.populates || JSON.stringify(defaultPopulatesObject),
      ...params, // Allow overriding with custom params
    };

    // Log request (dev-only, can be conditionally compiled for production)
    console.log('Fetching media menu with params:', queryParams);

    // Make API request
    const response = await apiClient.get<MediaMenuResponse>(
      '/api/medias/menu',
      queryParams,
    );

    // Extract media items from the response
    return extractMediaItems(response);
  } catch (error) {
    // Provide detailed error information
    if (error instanceof Error) {
      console.error(`Error fetching media menu: ${error.message}`, error);
    } else {
      console.error('Unknown error fetching media menu:', error);
    }

    // Return empty array to prevent UI crashes
    return [];
  }
};
