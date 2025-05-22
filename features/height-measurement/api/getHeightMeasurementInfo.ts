import type {
  GrowTrackApiResponse,
  GrowTrackInformation,
} from '@/features/height-measurement/types/heightMeasurementTypes';

import { apiClient } from '@/services/api/apiClient';

export const getHeightMeasurementInfo = async (
  trackId: string,
): Promise<{
  response: GrowTrackApiResponse;
  growTrack: GrowTrackInformation;
}> => {
  try {
    if (!trackId) {
      throw new Error('Track ID không được cung cấp');
    }

    const queryParams = {
      trackID: trackId,
    };

    const { data: response, information: growTrack } =
      await apiClient.get<GrowTrackApiResponse>(
        `/api/crm/grow_track`,
        queryParams,
      );

    if (!response) {
      throw new Error('Không thể lấy thông tin đo chiều cao');
    }

    return { response, growTrack };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Lỗi khi lấy thông tin đo cao: ${error.message}`);
    }
    throw new Error('Có lỗi xảy ra khi lấy thông tin đo cao');
  }
};
