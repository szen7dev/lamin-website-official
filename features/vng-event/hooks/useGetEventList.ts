'use client';

import { useQuery } from '@tanstack/react-query';

import { getEventList } from '@/features/vng-event/api/getEventList';
import { Event, EventListParams } from '@/features/vng-event/types/event';

export const useGetEventList = (params?: EventListParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_EVENT_LIST', params?.lastestID, params?.eventID],
    queryFn: () => getEventList(params || {}),
    staleTime: 1000 * 60 * 5,
  });

  return {
    eventList: data?.data as Event[],
    eventDetail: data?.data as Event,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
