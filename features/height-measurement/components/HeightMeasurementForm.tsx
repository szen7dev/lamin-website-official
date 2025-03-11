'use client'
import { useForm } from 'react-hook-form'
import { useHeightMeasurementMutation } from '../hooks/useHeightMeasurementMutation'
import { AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  birthDate: string
  weight: string
  height: string
  phone: string
  gender: 'male' | 'female'
}

export default function HeightMeasurementForm() {
  const { mutate, isPending, error } = useHeightMeasurementMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeightMeasurementFormData>({
    defaultValues: {
      name: '',
      birthDate: '',
      weight: '',
      height: '',
      phone: '',
      gender: 'male',
    },
  })

  const onSubmit = (data: HeightMeasurementFormData) => {
    mutate(data)
  }

  const handleReset = () => {
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 sm:space-y-6"
      aria-labelledby="height-measurement-form-title">
      <h2 id="height-measurement-form-title" className="sr-only">
        Biểu mẫu đo cao
      </h2>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-error-5/10 p-4 text-error-5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'}</p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center text-sm text-grayscale-90">
          <span className="text-error-5 mr-1">*</span>
          Tên bé
        </label>
        <input
          id="name"
          disabled={isPending}
          placeholder="Nhập tên"
          className={`w-full rounded-lg border ${errors.name ? 'border-error-5' : 'border-[#DEE2E6]'} bg-white px-4 py-3 text-sm text-grayscale-90 placeholder:text-[#ADB5BD] focus:border-[#1250DC] focus:outline-none focus:ring-1 focus:ring-[#1250DC] disabled:opacity-70`}
          {...register('name', { required: 'Vui lòng nhập tên bé' })}
        />
        {errors.name && <p className="text-sm text-error-5">{errors.name.message}</p>}
      </div>

      {/* Birth Date */}
      <div className="space-y-2">
        <label htmlFor="birthDate" className="flex items-center text-sm text-grayscale-90">
          <span className="text-error-5 mr-1">*</span>
          Ngày sinh
        </label>
        <input
          id="birthDate"
          type="date"
          disabled={isPending}
          placeholder="Nhập ngày sinh"
          className={`w-full rounded-lg border ${errors.birthDate ? 'border-error-5' : 'border-[#DEE2E6]'} bg-white px-4 py-3 text-sm text-grayscale-90 focus:border-[#1250DC] focus:outline-none focus:ring-1 focus:ring-[#1250DC] disabled:opacity-70`}
          {...register('birthDate', { required: 'Vui lòng chọn ngày sinh' })}
        />
        {errors.birthDate && <p className="text-sm text-error-5">{errors.birthDate.message}</p>}
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <label htmlFor="weight" className="flex items-center text-sm text-grayscale-90">
          <span className="text-error-5 mr-1">*</span>
          Cân nặng (kg)
        </label>
        <input
          id="weight"
          type="text"
          disabled={isPending}
          placeholder="Nhập cân nặng"
          className={`w-full rounded-lg border ${errors.weight ? 'border-error-5' : 'border-[#DEE2E6]'} bg-white px-4 py-3 text-sm text-grayscale-90 placeholder:text-[#ADB5BD] focus:border-[#1250DC] focus:outline-none focus:ring-1 focus:ring-[#1250DC] disabled:opacity-70`}
          {...register('weight', { required: 'Vui lòng nhập cân nặng' })}
        />
        {errors.weight && <p className="text-sm text-error-5">{errors.weight.message}</p>}
      </div>

      {/* Height */}
      <div className="space-y-2">
        <label htmlFor="height" className="flex items-center text-sm text-grayscale-90">
          <span className="text-error-5 mr-1">*</span>
          Chiều cao hiện tại (cm)
        </label>
        <input
          id="height"
          type="text"
          disabled={isPending}
          placeholder="Nhập chiều cao"
          className={`w-full rounded-lg border ${errors.height ? 'border-error-5' : 'border-[#DEE2E6]'} bg-white px-4 py-3 text-sm text-grayscale-90 placeholder:text-[#ADB5BD] focus:border-[#1250DC] focus:outline-none focus:ring-1 focus:ring-[#1250DC] disabled:opacity-70`}
          {...register('height', { required: 'Vui lòng nhập chiều cao' })}
        />
        {errors.height && <p className="text-sm text-error-5">{errors.height.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1 sm:space-y-2">
        <label htmlFor="phone" className="flex items-center text-xs sm:text-sm text-grayscale-90">
          <span className="text-error-5 mr-1" aria-hidden="true">
            *
          </span>
          Số điện thoại của bạn
          <span className="sr-only">(bắt buộc)</span>
        </label>
        <input
          id="phone"
          type="tel"
          disabled={isPending}
          placeholder="Nhập SĐT"
          className={`w-full rounded-lg border ${errors.phone ? 'border-error-5' : 'border-[#DEE2E6]'} bg-white px-4 py-3 text-sm text-grayscale-90 placeholder:text-[#ADB5BD] focus:border-[#1250DC] focus:outline-none focus:ring-1 focus:ring-[#1250DC] disabled:opacity-70`}
          {...register('phone', {
            required: 'Vui lòng nhập số điện thoại',
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: 'Số điện thoại không hợp lệ',
            },
          })}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-xs sm:text-sm text-error-5">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Gender */}
      <fieldset className="space-y-1 sm:space-y-2">
        <legend className="flex items-center text-xs sm:text-sm text-grayscale-90">
          <span className="text-error-5 mr-1" aria-hidden="true">
            *
          </span>
          Giới tính
          <span className="sr-only">(bắt buộc)</span>
        </legend>
        <div className="flex gap-4 sm:gap-6" role="radiogroup" aria-required="true">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="male"
              disabled={isPending}
              className="h-4 w-4 accent-[#1250DC] disabled:opacity-70"
              {...register('gender', { required: 'Vui lòng chọn giới tính' })}
            />
            <span className="text-xs sm:text-sm text-grayscale-90">Nam</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="female"
              disabled={isPending}
              className="h-4 w-4 accent-[#1250DC] disabled:opacity-70"
              {...register('gender')}
            />
            <span className="text-xs sm:text-sm text-grayscale-90">Nữ</span>
          </label>
        </div>
        {errors.gender && (
          <p id="gender-error" className="text-xs sm:text-sm text-error-5">
            {errors.gender.message}
          </p>
        )}
      </fieldset>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
        <Button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="rounded-lg bg-[#E9ECEF] px-6 py-2.5 text-sm font-medium text-[#212529] transition-colors hover:bg-[#DEE2E6] disabled:opacity-70">
          Đặt lại
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#1250DC] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1250DC]/90 disabled:opacity-70 flex items-center gap-2">
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
              <span>Đang xử lý...</span>
            </>
          ) : (
            'Gửi đi'
          )}
        </Button>
      </div>
    </form>
  )
}
