'use client';

import { useQuery } from '@tanstack/react-query';

import { getMediasMenu } from '@/features/menu/api/getMediasMenu';
import { MediaItem, MediaMenuParams } from '@/features/menu/types/mediaTypes';

export const MEDIA_MENU_QUERY_KEY = 'MEDIA_MENU';

export interface UseGetMediasMenuOptions {
  params?: MediaMenuParams;
  staleTime?: number;
  enabled?: boolean;
}

export const useGetMediasMenu = (options: UseGetMediasMenuOptions = {}) => {
  const {
    params = {},
    staleTime = 1000 * 60 * 5, // 5 minutes default
    enabled = true,
  } = options;

  const queryResult = useQuery<MediaItem[]>({
    queryKey: [MEDIA_MENU_QUERY_KEY, params],
    queryFn: () => getMediasMenu(params),
    staleTime,
    enabled,
  });

  const { data: mediaItems = [] } = queryResult;

  return {
    ...queryResult,
    mediaItems,
    hasItems: mediaItems.length > 0,
    isEmpty: mediaItems.length === 0,
  };
};
