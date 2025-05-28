import { Event, EventListParams } from '@/features/vng-event/types/event';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';
import { Pagination } from '@/types';

export const getEventList = async (
  params: EventListParams,
): Promise<{ data: Event[]; pagination: Pagination }> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      ...params,
    };

    const { data, pagination } = await apiClient.get<Event[]>(
      `/api/crm/vng_event`,
      queryParams,
    );

    console.log('data', data);

    return { data, pagination };
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw error;
  }
};
