import type {
  HeightMeasurementFormData,
  HeightMeasurementResult,
  HeightMeasurementService,
} from '../types/heightMeasurementTypes';

// Helper function để tính tuổi từ ngày sinh
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export class HeightMeasurementMockService implements HeightMeasurementService {
  private mockResults: HeightMeasurementResult[] = [];

  async submitHeightMeasurement(
    data: HeightMeasurementFormData,
  ): Promise<HeightMeasurementResult> {
    console.log('📊 MOCK: Submitting height measurement data:', data);

    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 800));

    // Giả lập xác suất lỗi (10%)
    if (Math.random() < 0.1) {
      const error = new Error(
        'Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại sau.',
      );

      console.error('📊 MOCK: Error submitting height measurement:', error);
      throw error;
    }

    // Tính toán chiều cao dự đoán dựa trên dữ liệu đầu vào
    const age = calculateAge(data.birthDate);
    const baseHeight = Number.parseFloat(data.height);
    const predictedHeight =
      data.gender === 'male' ? baseHeight * 1.5 + 10 : baseHeight * 1.4 + 8;

    // Dữ liệu chiều cao cố định
    const heightData = [
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

    // Tạo kết quả mock
    const result: HeightMeasurementResult = {
      id: `HM-${Date.now()}`,
      ...data,
      predictedHeight: Math.round(predictedHeight),
      growthRate: 36,
      percentile: 75,
      analysisDate: new Date().toISOString().split('T')[0],
      coach: 'Hoàng Thảo',
      recommendations: [
        'Ngủ trước 10h tối',
        'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
        'Bổ sung Protein, Canxi, D3, K2',
      ],
      heightData,
    };

    // Lưu kết quả vào danh sách mock
    this.mockResults.push(result);

    console.log('📊 MOCK: Height measurement result:', result);

    return result;
  }

  async getHeightMeasurementById(id: string): Promise<HeightMeasurementResult> {
    console.log('📊 MOCK: Getting height measurement by ID:', id);

    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = this.mockResults.find(r => r.id === id);

    if (!result) {
      console.log('📊 MOCK: No result found, returning default data');

      // Trả về kết quả mặc định nếu không tìm thấy
      return {
        id: 'HM-default',
        name: 'Nguyễn Văn A',
        birthDate: '2019-04-12',
        weight: '25',
        height: '112',
        phone: '0987654321',
        gender: 'male',
        predictedHeight: 161,
        growthRate: 36,
        percentile: 75,
        analysisDate: '2025-03-11',
        coach: 'Hoàng Thảo',
        recommendations: [
          'Ngủ trước 10h tối',
          'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
          'Bổ sung Protein, Canxi, D3, K2',
        ],
        heightData: [
          { age: 5, height: 112 },
          { age: 6, height: 113 },
          // ... các dữ liệu khác
          { age: 20, height: 164 },
        ],
      };
    }

    console.log('📊 MOCK: Found height measurement result:', result);

    return result;
  }

  async getHeightMeasurementsByContact(
    contactID: string,
  ): Promise<HeightMeasurementResult[]> {
    console.log('📊 MOCK: Getting height measurements for contact:', contactID);

    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 600));

    // Trả về danh sách kết quả đo cao của người dùng
    const results = this.mockResults.filter(r => r.phone === contactID);

    console.log('📊 MOCK: Found height measurement results:', results);

    return results;
  }
}

// Export một instance singleton
export const heightMeasurementMockService = new HeightMeasurementMockService();
