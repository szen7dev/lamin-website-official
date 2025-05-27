import { Event } from '@/features/vng-event/types/event';
import apiClient from '@/services/api/apiClient';

export const getGoodsInfo = async (goodsId: string): Promise<Event[]> => {
  try {
    const populatesObject = {
      path: 'images userUpdate category company',
      select: 'path size image note fullname name slug',
      populate: { path: 'position', select: 'name' },
    };

    const queryParams = {
      populates: JSON.stringify(populatesObject),
      goodsID: goodsId,
    };

    const response = await apiClient.getNormalizedResponse<Event[]>(
      `/api/item/goods`,
      queryParams,
    );

    return response as Event[];
  } catch (error) {
    console.error('Error fetching goods info:', error);
    throw error;
  }
};
