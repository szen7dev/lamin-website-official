import type {
  HeightMeasurementFormData,
  HeightMeasurementResult,
  HeightMeasurementService,
} from '../types/heightMeasurementTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export class HeightMeasurementRealService implements HeightMeasurementService {
  async submitHeightMeasurement(
    data: HeightMeasurementFormData,
  ): Promise<HeightMeasurementResult> {
    try {
      console.log('🌐 REAL API: Submitting height measurement data:', data);

      // Chuyển đổi dữ liệu form sang định dạng API
      const apiData = {
        optionSeller: DEFAULT_OPTION_SELLER,
        phone: data.phone,
        birthday: data.birthDate,
        gender: data.gender === 'male' ? 1 : 2, // Chuyển đổi sang định dạng số
        height: Number(data.height),
        weight: Number(data.weight),
        name: data.name,
        note: `Đo cao từ website Elena Pharmacy`,
      };

      console.log('🌐 REAL API: Converted API data:', apiData);

      // Gọi API
      const response = await apiClient.post('/api/crm/grow_track', apiData);

      console.log('🌐 REAL API: Raw API response:', response);

      // Chuyển đổi dữ liệu API sang định dạng frontend
      const result = this.mapApiResponseToResult(response);

      console.log('🌐 REAL API: Mapped result:', result);

      return result;
    } catch (error) {
      console.error('🌐 REAL API: Error submitting height measurement:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi gửi dữ liệu đo cao',
      );
    }
  }

  async getHeightMeasurementById(id: string): Promise<HeightMeasurementResult> {
    try {
      console.log('🌐 REAL API: Getting height measurement by ID:', id);

      // Gọi API
      const response = await apiClient.get(`/api/crm/grow_track/${id}`);

      console.log('🌐 REAL API: Raw API response for ID:', response);

      // Chuyển đổi dữ liệu API sang định dạng frontend
      const result = this.mapApiResponseToResult(response);

      console.log('🌐 REAL API: Mapped result for ID:', result);

      return result;
    } catch (error) {
      console.error('🌐 REAL API: Error fetching height measurement:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi lấy dữ liệu đo cao',
      );
    }
  }

  async getHeightMeasurementsByContact(
    contactID: string,
  ): Promise<HeightMeasurementResult[]> {
    try {
      console.log(
        '🌐 REAL API: Getting height measurements for contact:',
        contactID,
      );

      // Gọi API
      const response = await apiClient.get('/api/crm/grow_track', {
        contactID,
      });

      console.log('🌐 REAL API: Raw API response for contact:', response);

      // Chuyển đổi dữ liệu API sang định dạng frontend
      if (response && response.data && response.data.listRecords) {
        const results = response.data.listRecords.map((item: any) =>
          this.mapApiResponseToResult(item),
        );

        console.log('🌐 REAL API: Mapped results for contact:', results);

        return results;
      }

      console.log(
        '🌐 REAL API: No records found for contact, returning empty array',
      );

      return [];
    } catch (error) {
      console.error(
        '🌐 REAL API: Error fetching height measurements for contact:',
        error,
      );

      return [];
    }
  }

  // Helper method để chuyển đổi dữ liệu API sang định dạng frontend
  private mapApiResponseToResult(apiResponse: any): HeightMeasurementResult {
    console.log('🌐 REAL API: Mapping API response to result:', apiResponse);

    // Xử lý dữ liệu từ API
    const growTrackData = apiResponse.growTrack || {};

    console.log('🌐 REAL API: Growth track data:', growTrackData);

    // Tạo dữ liệu chiều cao theo tuổi từ ageHeightNow hoặc hdfs
    let heightData = [];

    if (
      growTrackData.ageHeightNow &&
      Array.isArray(growTrackData.ageHeightNow)
    ) {
      // Sử dụng dữ liệu ageHeightNow nếu có
      heightData = growTrackData.ageHeightNow.map((item: any) => ({
        age: item.age,
        height: item.height,
      }));
      console.log('🌐 REAL API: Using ageHeightNow data for height data');
    } else if (growTrackData.hdfs && Array.isArray(growTrackData.hdfs)) {
      // Sử dụng dữ liệu hdfs nếu có
      heightData = growTrackData.hdfs.map((item: any) => ({
        age: item.age,
        height: item.height,
      }));
      console.log('🌐 REAL API: Using hdfs data for height data');
    } else {
      // Dữ liệu mặc định nếu không có dữ liệu từ API
      heightData = [
        { age: 5, height: 112 },
        { age: 6, height: 113 },
        { age: 7, height: 119 },
        { age: 8, height: 125 },
        { age: 9, height: 130 },
        { age: 10, height: 135 },
        { age: 11, height: 141 },
        { age: 12, height: 148 },
        { age: 13, height: 154 },
        { age: 14, height: 158 },
        { age: 15, height: 159 },
        { age: 16, height: 160 },
        { age: 17, height: 161 },
        { age: 18, height: 162 },
        { age: 19, height: 163 },
        { age: 20, height: 164 },
      ];
      console.log('🌐 REAL API: Using default data for height data');
    }

    // Tính percentile dựa trên chiều cao hiện tại
    const percentile = 50; // Mặc định

    // Dự đoán chiều cao khi trưởng thành (sử dụng P50 hoặc giá trị mặc định)
    const predictedHeight =
      growTrackData.ageHeightP50 && growTrackData.ageHeightP50.length > 0
        ? Math.round(
            growTrackData.ageHeightP50[growTrackData.ageHeightP50.length - 1]
              .height,
          )
        : apiResponse.gender === 1
          ? 170
          : 160; // Giá trị mặc định dựa trên giới tính

    console.log('🌐 REAL API: Predicted height:', predictedHeight);

    // Tạo kết quả
    const result = {
      id: apiResponse._id || apiResponse.data?._id || `HM-${Date.now()}`,
      name: apiResponse.name || apiResponse.data?.name || '',
      birthDate: apiResponse.birthday || apiResponse.data?.birthday || '',
      weight: String(apiResponse.weight || apiResponse.data?.weight || ''),
      height: String(apiResponse.height || apiResponse.data?.height || ''),
      phone: apiResponse.phone || apiResponse.data?.phone || '',
      gender:
        apiResponse.gender === 1 || apiResponse.data?.gender === 1
          ? 'male'
          : 'female',
      predictedHeight,
      growthRate: 36, // Giá trị mặc định
      percentile,
      analysisDate: apiResponse.createAt
        ? new Date(apiResponse.createAt).toISOString().split('T')[0]
        : apiResponse.data?.createAt
          ? new Date(apiResponse.data.createAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      coach: 'Hoàng Thảo', // Giá trị mặc định
      recommendations: [
        'Ngủ trước 10h tối',
        'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
        'Bổ sung Protein, Canxi, D3, K2',
      ],
      heightData,
    };

    console.log('🌐 REAL API: Final mapped result:', result);

    return result;
  }
}

// Export một instance singleton
export const heightMeasurementRealService = new HeightMeasurementRealService();
