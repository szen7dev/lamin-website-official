import { Event, EventUpsertParams } from '@/features/vng-event/types/event';
import apiClient from '@/services/api/apiClient';

export const updateEvent = async (
  eventId: string,
  params: EventUpsertParams,
): Promise<Event> => {
  try {
    const queryParams = {
      ...params,
    };

    const response = await apiClient.put<Event>(
      `/api/crm/vng_event/${eventId}`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};
