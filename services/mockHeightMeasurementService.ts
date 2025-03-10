// Định nghĩa kiểu dữ liệu cho form
export interface HeightMeasurementFormData {
  name: string
  birthDate: string
  weight: string
  height: string
  phone: string
  gender: 'male' | 'female'
}

// Định nghĩa kiểu dữ liệu cho kết quả phân tích
export interface HeightMeasurementResult {
  id: string
  name: string
  birthDate: string
  weight: string
  height: string
  phone: string
  gender: 'male' | 'female'
  predictedHeight: number
  growthRate: number
  percentile: number
  analysisDate: string
  coach: string
  recommendations: string[]
  heightData: Array<{ age: number; height: number }>
}

// Dữ liệu chiều cao cố định
const fixedHeightData = [
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
]

// Định nghĩa dữ liệu percentile cố định
const percentileData = {
  P3: [110, 111, 117, 123, 128, 133, 139, 146, 152, 156, 157, 158, 159, 160, 161, 162],
  P5: [111, 112, 118, 124, 129, 134, 140, 147, 153, 157, 158, 159, 160, 161, 162, 163],
  P10: [
    111.5, 112.5, 118.5, 124.5, 129.5, 134.5, 140.5, 147.5, 153.5, 157.5, 158.5, 159.5, 160.5,
    161.5, 162.5, 163.5,
  ],
  P25: [112, 113, 119, 125, 130, 135, 141, 148, 154, 158, 159, 160, 161, 162, 163, 164],
  P50: [
    112.5, 113.5, 119.5, 125.5, 130.5, 135.5, 141.5, 148.5, 154.5, 158.5, 159.5, 160.5, 161.5,
    162.5, 163.5, 164.5,
  ],
  P75: [113, 114, 120, 126, 131, 136, 142, 149, 155, 159, 160, 161, 162, 163, 164, 165],
  P90: [
    113.5, 114.5, 120.5, 126.5, 131.5, 136.5, 142.5, 149.5, 155.5, 159.5, 160.5, 161.5, 162.5,
    163.5, 164.5, 165.5,
  ],
  P95: [114, 115, 121, 127, 132, 137, 143, 150, 156, 160, 161, 162, 163, 164, 165, 166],
  P97: [
    114.5, 115.5, 121.5, 127.5, 132.5, 137.5, 143.5, 150.5, 156.5, 160.5, 161.5, 162.5, 163.5,
    164.5, 165.5, 166.5,
  ],
}

// Cập nhật hàm generateHeightData để sử dụng dữ liệu cố định
function generateHeightData(
  currentAge: number,
  currentHeight: number,
  gender: string,
): Array<{ age: number; height: number }> {
  return fixedHeightData
}

// Hàm giả lập API để gửi dữ liệu form và nhận kết quả
export async function submitHeightMeasurement(
  data: HeightMeasurementFormData,
): Promise<HeightMeasurementResult> {
  // Giả lập độ trễ network
  await new Promise(resolve => setTimeout(resolve, 800))

  // Giả lập xác suất lỗi (10%)
  if (Math.random() < 0.1) {
    throw new Error('Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại sau.')
  }

  // Tính toán chiều cao dự đoán dựa trên dữ liệu đầu vào
  const age = calculateAge(data.birthDate)
  const baseHeight = Number.parseFloat(data.height)
  const predictedHeight = data.gender === 'male' ? baseHeight * 1.5 + 10 : baseHeight * 1.4 + 8

  // Trả về kết quả giả lập với dữ liệu chiều cao cố định
  return {
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
    heightData: fixedHeightData,
  }
}

// Hàm tính tuổi từ ngày sinh
function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
