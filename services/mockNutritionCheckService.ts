// Định nghĩa kiểu dữ liệu cho form
export interface NutritionCheckFormData {
  name: string
  birthDate: string
  regularFoods: string[]
  knownProduct: "yes" | "no"
}

// Định nghĩa kiểu dữ liệu cho kết quả
export interface NutritionCheckResult {
  id: string
  name: string
  birthDate: string
  regularFoods: string[]
  knownProduct: "yes" | "no"
  submittedAt: string
}

// Hàm giả lập API để gửi dữ liệu form và nhận kết quả
export async function submitNutritionCheck(data: NutritionCheckFormData): Promise<NutritionCheckResult> {
  // Giả lập độ trễ network
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Giả lập xác suất lỗi (10%)
  if (Math.random() < 0.1) {
    throw new Error("Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại sau.")
  }

  // Trả về kết quả giả lập
  return {
    id: `NC-${Date.now()}`,
    ...data,
    submittedAt: new Date().toISOString(),
  }
}

