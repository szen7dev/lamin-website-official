/**
 * API function to fetch best selling products from the backend
 */
import {
  BestSellerItem,
  BestSellerParams,
  BestSellerResponse,
} from '@/features/menu/types/bestSellerTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Safely extracts best seller items from various response structures
 * @param response - The API response with potentially varying structure
 * @returns An array of BestSellerItem objects
 */
const extractBestSellerItems = (response: any): BestSellerItem[] => {
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

  console.warn(
    'Unexpected response structure from best sellers API:',
    response,
  );

  return [];
};

/**
 * Fetches best selling products from the API
 * @param params - Query parameters to customize the request
 * @returns Promise resolving to an array of BestSellerItem objects
 */
export const getBestSellers = async (
  params: BestSellerParams = {},
): Promise<BestSellerItem[]> => {
  try {
    // Default populates object for efficient data loading
    const defaultPopulatesObject = {
      path: 'thumbnail category',
      select: '_id path slug name',
    };

    // Prepare query parameters with sensible defaults
    const queryParams = {
      limit: params.limit || 5, // Default to 5 best sellers
      optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
      status: params.status ?? 1,
      sort: '-saleCount', // Sort by most sold
      populates: params.populates || JSON.stringify(defaultPopulatesObject),
      ...params, // Allow overriding with custom params
    };

    // Make API request
    const response = await apiClient.get<BestSellerResponse>(
      '/api/crm/combo/best-seller',
      queryParams,
    );

    // Extract best seller items from the response
    return extractBestSellerItems(response);
  } catch (error) {
    // Provide detailed error information
    if (error instanceof Error) {
      console.error(`Error fetching best sellers: ${error.message}`, error);
    } else {
      console.error('Unknown error fetching best sellers:', error);
    }

    // Return empty array to prevent UI crashes
    return [];
  }
};
