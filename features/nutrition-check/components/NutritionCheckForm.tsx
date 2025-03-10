'use client'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { useNutritionCheckMutation } from '../hooks/useNutritionCheckMutation'

interface FormData {
  name: string
  birthDate: string
  regularFoods: string[]
  knownProduct: 'yes' | 'no'
}

const foodOptions = [
  { id: 'egg', label: 'Trứng' },
  { id: 'chicken', label: 'Thịt gà' },
  { id: 'beef', label: 'Thịt bò' },
  { id: 'pork', label: 'Thịt heo' },
  { id: 'vegetables', label: 'Rau xanh' },
]

export default function NutritionCheckForm() {
  const { mutate, isPending, error } = useNutritionCheckMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      birthDate: '',
      regularFoods: [],
      knownProduct: 'no',
    },
  })

  const onSubmit = (data: FormData) => {
    mutate(data)
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#1250DC] text-white px-4 py-3 text-[15px] font-medium">
        MÔ TẢ THÔNG TIN
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="bg-error-5/10 p-4 text-error-5 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'}</p>
          </div>
        )}

        {/* Name */}
        <div className="bg-white px-4 py-3">
          <label htmlFor="name" className="flex items-center text-sm text-grayscale-90">
            Họ và tên <span className="text-error-5 ml-1">*</span>
          </label>
          <input
            id="name"
            disabled={isPending}
            placeholder="Nguyễn Văn A"
            className={`w-full border-b ${errors.name ? 'border-error-5' : 'border-[#DEE2E6]'} bg-transparent px-0 py-2 text-sm text-grayscale-90 focus:border-[#1250DC] focus:outline-none disabled:opacity-70`}
            {...register('name', { required: 'Vui lòng nhập họ và tên' })}
          />
          {errors.name && <p className="mt-1 text-xs text-error-5">{errors.name.message}</p>}
        </div>

        {/* Birth Date */}
        <div className="bg-white px-4 py-3">
          <label htmlFor="birthDate" className="flex items-center text-sm text-grayscale-90">
            Ngày sinh <span className="text-error-5 ml-1">*</span>
          </label>
          <input
            id="birthDate"
            type="date"
            disabled={isPending}
            className={`w-full border-b ${errors.birthDate ? 'border-error-5' : 'border-[#DEE2E6]'} bg-transparent px-0 py-2 text-sm text-grayscale-90 focus:border-[#1250DC] focus:outline-none disabled:opacity-70`}
            {...register('birthDate', { required: 'Vui lòng chọn ngày sinh' })}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-error-5">{errors.birthDate.message}</p>
          )}
        </div>

        {/* Regular Foods */}
        <div className="bg-white px-4 py-3">
          <label className="flex items-center text-sm text-grayscale-90">
            Bạn đã ăn những món nào thường xuyên <span className="text-error-5 ml-1">*</span>
          </label>
          <div className="mt-2 space-y-2">
            <Controller
              name="regularFoods"
              control={control}
              rules={{ required: 'Vui lòng chọn ít nhất một món ăn' }}
              render={({ field }) => (
                <>
                  {foodOptions.map(food => (
                    <label key={food.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={isPending}
                        checked={field.value.includes(food.id)}
                        onChange={e => {
                          const checked = e.target.checked
                          const updatedFoods = checked
                            ? [...field.value, food.id]
                            : field.value.filter(id => id !== food.id)
                          field.onChange(updatedFoods)
                        }}
                        className="h-4 w-4 rounded border-[#DEE2E6] text-[#1250DC] focus:ring-[#1250DC] disabled:opacity-70"
                      />
                      <span className="text-sm text-grayscale-90">{food.label}</span>
                    </label>
                  ))}
                </>
              )}
            />
            {errors.regularFoods && (
              <p className="mt-1 text-xs text-error-5">{errors.regularFoods.message}</p>
            )}
          </div>
        </div>

        {/* Known Product */}
        <div className="bg-white px-4 py-3">
          <label className="flex items-center text-sm text-grayscale-90">
            Bạn đã biết tới sản phẩm của chúng tôi chưa <span className="text-error-5 ml-1">*</span>
          </label>
          <div className="mt-2 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                disabled={isPending}
                className="h-4 w-4 border-[#DEE2E6] text-[#1250DC] focus:ring-[#1250DC] disabled:opacity-70"
                {...register('knownProduct', { required: 'Vui lòng chọn một lựa chọn' })}
              />
              <span className="text-sm text-grayscale-90">Đã biết</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                disabled={isPending}
                className="h-4 w-4 border-[#DEE2E6] text-[#1250DC] focus:ring-[#1250DC] disabled:opacity-70"
                {...register('knownProduct')}
              />
              <span className="text-sm text-grayscale-90">Chưa biết</span>
            </label>
          </div>
          {errors.knownProduct && (
            <p className="mt-1 text-xs text-error-5">{errors.knownProduct.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 px-4 py-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="rounded bg-white px-6 py-2 text-sm font-medium text-[#1250DC] border border-[#1250DC] hover:bg-[#1250DC]/5 disabled:opacity-70">
            Đặt lại
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-[#1250DC] px-6 py-2 text-sm font-medium text-white hover:bg-[#1250DC]/90 disabled:opacity-70 flex items-center gap-2">
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Gửi đi'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
