import { Event, EventUpsertParams } from '@/features/vng-event/types/event';
import apiClient from '@/services/api/apiClient';

export const createEvent = async (
  params: EventUpsertParams,
): Promise<Event> => {
  try {
    const queryParams = {
      ...params,
    };

    const response = await apiClient.post<Event>(
      `/api/crm/vng_event`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw error;
  }
};
