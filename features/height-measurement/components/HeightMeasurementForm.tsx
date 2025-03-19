'use client';
import type { HeightMeasurementFormData } from "../types/heightMeasurementTypes"
import { useForm } from "react-hook-form"
import { useHeightMeasurementMutation } from "../hooks/useHeightMeasurementMutation"
import { AlertCircle } from "lucide-react"
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function HeightMeasurementForm() {
  const { mutate, isPending, error, isSuccess, data } =
    useHeightMeasurementMutation();

  useEffect(() => {
    console.log('🖥️ Form Component: Current state:', {
      isPending,
      error,
      isSuccess,
      data,
    });
  }, [isPending, error, isSuccess, data]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
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
  });

  const onSubmit = (data: HeightMeasurementFormData) => {
    console.log('🖥️ Form Component: Form submitted with data:', data);

    // Đảm bảo số điện thoại đúng định dạng
    if (!/^[0-9]{10,11}$/.test(data.phone)) {
      console.log('🖥️ Form Component: Invalid phone number format');
      setError('phone', {
        type: 'manual',
        message: 'Số điện thoại không hợp lệ',
      });
      return;
    }

    console.log('🖥️ Form Component: Submitting data to API');
    mutate(data);
  };

  const handleReset = () => {
    console.log('🖥️ Form Component: Form reset');
    reset();
  };

  return (
    <form
      aria-labelledby="height-measurement-form-title"
      className="space-y-4 sm:space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="sr-only" id="height-measurement-form-title">
        Biểu mẫu đo cao
      </h2>

      {/* Error message */}
      {error && (
        <div
          className="rounded-lg bg-error-5/10 p-3 sm:p-4 text-error-5 flex items-start gap-2 sm:gap-3"
          role="alert">
          <AlertCircle
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm">
            {error instanceof Error
              ? error.message
              : 'Có lỗi xảy ra. Vui lòng thử lại.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="name"
            className="flex items-center text-xs sm:text-sm text-grayscale-90">
            <span aria-hidden="true" className="text-error-5 mr-1">
              *
            </span>
            Tên bé
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full rounded-lg border ${errors.name ? "border-error-5" : "border-grayscale-20"} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="name"
            placeholder="Nhập tên"
            {...register("name", { required: "Vui lòng nhập tên bé" })}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-xs sm:text-sm text-error-5" id="name-error">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="birthDate"
            className="flex items-center text-xs sm:text-sm text-grayscale-90">
            <span aria-hidden="true" className="text-error-5 mr-1">
              *
            </span>
            Ngày sinh
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full rounded-lg border ${errors.birthDate ? "border-error-5" : "border-grayscale-20"} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="birthDate"
            placeholder="Nhập ngày sinh"
            type="date"
            {...register("birthDate", { required: "Vui lòng chọn ngày sinh" })}
            aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
            aria-invalid={errors.birthDate ? "true" : "false"}
          />
          {errors.birthDate && (
            <p className="text-xs sm:text-sm text-error-5" id="birthDate-error">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="weight"
            className="flex items-center text-xs sm:text-sm text-grayscale-90">
            <span aria-hidden="true" className="text-error-5 mr-1">
              *
            </span>
            Cân nặng (kg)
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full rounded-lg border ${errors.weight ? "border-error-5" : "border-grayscale-20"} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="weight"
            placeholder="Nhập cân nặng"
            type="text"
            {...register("weight", { required: "Vui lòng nhập cân nặng" })}
            aria-describedby={errors.weight ? "weight-error" : undefined}
            aria-invalid={errors.weight ? "true" : "false"}
          />
          {errors.weight && (
            <p className="text-xs sm:text-sm text-error-5" id="weight-error">
              {errors.weight.message}
            </p>
          )}
        </div>

        {/* Height */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="height"
            className="flex items-center text-xs sm:text-sm text-grayscale-90">
            <span aria-hidden="true" className="text-error-5 mr-1">
              *
            </span>
            Chiều cao hiện tại (cm)
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full rounded-lg border ${errors.height ? "border-error-5" : "border-grayscale-20"} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="height"
            placeholder="Nhập chiều cao"
            type="text"
            {...register("height", { required: "Vui lòng nhập chiều cao" })}
            aria-describedby={errors.height ? "height-error" : undefined}
            aria-invalid={errors.height ? "true" : "false"}
          />
          {errors.height && (
            <p className="text-xs sm:text-sm text-error-5" id="height-error">
              {errors.height.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1 sm:space-y-2">
        <label
          htmlFor="phone"
          className="flex items-center text-xs sm:text-sm text-grayscale-90">
          <span aria-hidden="true" className="text-error-5 mr-1">
            *
          </span>
          Số điện thoại của bạn
          <span className="sr-only">(bắt buộc)</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.phone ? "border-error-5" : "border-grayscale-20"} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
          disabled={isPending}
          id="phone"
          placeholder="Nhập SĐT"
          type="tel"
          {...register("phone", {
            required: "Vui lòng nhập số điện thoại",
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ",
            },
          })}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          aria-invalid={errors.phone ? "true" : "false"}
        />
        {errors.phone && (
          <p className="text-xs sm:text-sm text-error-5" id="phone-error">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Gender */}
      <fieldset className="space-y-1 sm:space-y-2">
        <legend className="flex items-center text-xs sm:text-sm text-grayscale-90">
          <span aria-hidden="true" className="text-error-5 mr-1">
            *
          </span>
          Giới tính
          <span className="sr-only">(bắt buộc)</span>
        </legend>
        <div
          className="flex gap-4 sm:gap-6"
          role="radiogroup"
          aria-required="true">
          <label className="flex items-center gap-2">
            <input
              className="h-4 w-4 accent-primary-5 disabled:opacity-70"
              disabled={isPending}
              type="radio"
              value="male"
              {...register('gender', { required: 'Vui lòng chọn giới tính' })}
            />
            <span className="text-xs sm:text-sm text-grayscale-90">Nam</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              className="h-4 w-4 accent-primary-5 disabled:opacity-70"
              disabled={isPending}
              type="radio"
              value="female"
              {...register('gender')}
            />
            <span className="text-xs sm:text-sm text-grayscale-90">Nữ</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-xs sm:text-sm text-error-5" id="gender-error">
            {errors.gender.message}
          </p>
        )}
      </fieldset>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
        <Button
          className="rounded-lg bg-grayscale-5 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-grayscale-90 transition-colors hover:bg-grayscale-10 disabled:opacity-70 order-2 sm:order-1"
          disabled={isPending}
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          Đặt lại
        </Button>
        <Button
          className="rounded-lg bg-primary-5 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-20 disabled:opacity-70 flex items-center justify-center gap-2 order-1 sm:order-2"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <svg
                aria-hidden="true"
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4" />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                 />
              </svg>
              <span>Đang xử lý...</span>
            </>
          ) : (
            'Gửi đi'
          )}
        </Button>
      </div>
    </form>
  );
}
