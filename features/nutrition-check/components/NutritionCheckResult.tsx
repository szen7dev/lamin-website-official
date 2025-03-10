'use client'

import { CheckCircle2 } from 'lucide-react'
import { useNutritionCheckResult } from '../hooks/useNutritionCheckMutation'

interface NutritionCheckResultProps {
  resultId?: string
}

const foodLabels: Record<string, string> = {
  egg: 'Trứng',
  chicken: 'Thịt gà',
  beef: 'Thịt bò',
  pork: 'Thịt heo',
  vegetables: 'Rau xanh',
}

export default function NutritionCheckResult({ resultId }: NutritionCheckResultProps) {
  const result = useNutritionCheckResult(resultId)

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-grayscale-60">Không tìm thấy kết quả. Vui lòng thử lại.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-[#1250DC] to-[#1250DC]/90 p-4 text-white">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#38CB1C]" />
          <div>
            <h3 className="font-medium">KẾT QUẢ ĐÃ ĐƯỢC GHI NHẬN</h3>
            <p className="text-sm text-white/90">
              Cảm ơn bạn, kết quả đã được trả về Zalo OA cho bạn
            </p>
          </div>
        </div>
      </div>

      {/* Result Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm text-[#DC3545]">
            * <span className="ml-1 text-grayscale-90">Họ và tên</span>
          </label>
          <input
            type="text"
            value={result.name}
            readOnly
            className="w-full rounded border border-[#DEE2E6] bg-white px-3 py-2 text-sm text-grayscale-90"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm text-[#DC3545]">
            * <span className="ml-1 text-grayscale-90">Ngày sinh</span>
          </label>
          <input
            type="text"
            value={result.birthDate}
            readOnly
            className="w-full rounded border border-[#DEE2E6] bg-white px-3 py-2 text-sm text-grayscale-90"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm text-[#DC3545]">
            * <span className="ml-1 text-grayscale-90">Món ăn thường xuyên</span>
          </label>
          <input
            type="text"
            value={result.regularFoods.map(food => foodLabels[food]).join(', ')}
            readOnly
            className="w-full rounded border border-[#DEE2E6] bg-white px-3 py-2 text-sm text-grayscale-90"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm text-[#DC3545]">
            * <span className="ml-1 text-grayscale-90">Sản phẩm của chúng tôi</span>
          </label>
          <input
            type="text"
            value={result.knownProduct === 'yes' ? 'Đã biết' : 'Chưa biết'}
            readOnly
            className="w-full rounded border border-[#DEE2E6] bg-white px-3 py-2 text-sm text-grayscale-90"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => window.history.back()}
          className="rounded border border-[#1250DC] px-6 py-2 text-sm font-medium text-[#1250DC] hover:bg-[#1250DC]/5">
          Quay lại
        </button>
        <button className="rounded bg-[#1250DC] px-6 py-2 text-sm font-medium text-white hover:bg-[#1250DC]/90">
          Xác nhận
        </button>
      </div>
    </div>
  )
}
