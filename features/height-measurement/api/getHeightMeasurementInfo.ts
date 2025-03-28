import type { GrowTrackApiResponse } from '@/features/height-measurement/types/heightMeasurementTypes';

import { apiClient } from '@/services/api/apiClient';

export const getHeightMeasurementInfo = async (
  trackId: string,
): Promise<GrowTrackApiResponse> => {
  try {
    if (!trackId) {
      throw new Error('Track ID không được cung cấp');
    }

    const queryParams = {
      trackID: trackId,
    };

    const { data, response } = await apiClient.get<GrowTrackApiResponse, any>(
      `/api/crm/grow_track`,
      queryParams,
    );

    if (!data) {
      throw new Error('Không thể lấy thông tin đo chiều cao');
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Lỗi khi lấy thông tin đo cao: ${error.message}`);
    }
    throw new Error('Có lỗi xảy ra khi lấy thông tin đo cao');
  }
};
