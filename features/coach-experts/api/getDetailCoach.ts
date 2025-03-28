import {
  Coach,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';
import { apiClient } from '@/services/api/apiClient';

/**
 * Get detailed coach information by ID
 * @param params - Parameters for fetching coach details
 * @returns Promise with coach data
 */
export const getDetailCoach = async (
  params: GetDetailCoachParams,
): Promise<Coach> => {
  // Prepare query parameters
  const queryParams: Record<string, any> = {
    contactID: params.contactID,
    populates:
      params.populates ||
      JSON.stringify({
        path: 'company position department area field',
        select: 'name sign position note',
      }),
    select: 'name phone note image',
  };

  try {
    // Make API call to get coach details
    const coach = await apiClient.getNormalizedResponse<Coach>(
      '/api/item/contacts',
      queryParams,
    );

    return coach;
  } catch (error) {
    console.error('Error fetching coach details:', error);
    throw error;
  }
};
