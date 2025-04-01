import { Coach, GetCoachParams } from '../../homepage/types/coachTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches coach/expert data from the API
 * @param params Query parameters for the API request
 * @returns Array of coaches/experts
 */
export const getCoach = async (
  params: GetCoachParams = {},
): Promise<{ coaches: Coach[]; response: any }> => {
  // Set default parameters if not provided
  const queryParams: Record<string, any> = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    populates: JSON.stringify({
      path: 'field position',
      select: 'name',
    }),
    ...(params.select && { select: params.select }),
    ...(params.limit && { limit: params.limit }),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.lastestID && { lastestID: params.lastestID }),
  };

  // Fetch coaches data from API
  const { data: coaches, response } = await apiClient.get<Coach[]>(
    '/api/item/contacts',
    queryParams,
  );

  // Return the response data or empty array if no data
  return { coaches, response };
};
