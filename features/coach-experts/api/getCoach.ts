import { Coach, GetCoachParams } from '../../homepage/types/coachTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches coach/expert data from the API
 * @param params Query parameters for the API request
 * @returns Array of coaches/experts
 */
export const getCoach = async (
  params: GetCoachParams = {},
): Promise<Coach[]> => {
  // Set default parameters if not provided
  const queryParams: Record<string, any> = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    populates: JSON.stringify({
      path: 'field position',
      select: 'name',
    }),
    limit: params.limit ?? 3,
  };

  // Fetch coaches data from API
  const coaches = await apiClient.getNormalizedResponse<Coach[]>(
    '/api/item/contacts',
    queryParams,
  );

  // Return the response data or empty array if no data
  return coaches || [];
};
