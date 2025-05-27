import {
  CoachDocument,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';
import { apiClient } from '@/services/api/apiClient';

/**
 * Get detailed coach information by ID
 * @param params - Parameters for fetching coach details
 * @returns Promise with coach data
 */
export const getCoachDocument = async (
  params: GetDetailCoachParams,
): Promise<CoachDocument[]> => {
  // Prepare query parameters
  const queryParams: Record<string, any> = {
    contactID: params.contactID,
    populates:
      params.populates ||
      JSON.stringify({
        path: 'company contact files educationalBackground2',
        select: 'name sign url size type nameOrg app',
      }),
    select:
      'name type createAt contact files company number workplace fromDate toDate educationBackground2',
    ...(params.type && { type: params.type }),
  };

  try {
    // Make API call to get coach details
    const response = await apiClient.get<CoachDocument[]>(
      '/api/human/contact_documents',
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching coach details:', error);
    throw error;
  }
};
