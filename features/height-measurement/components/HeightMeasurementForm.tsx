'use client';
import type { HeightMeasurementFormData } from '../types/heightMeasurementTypes';

import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

import { useHeightMeasurementMutation } from '../hooks/usePostHeightMeasurement';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

export default function HeightMeasurementForm() {
  const { user, isAuthenticated } = useAuth();

  // Only pass contactID if user is authenticated and has contacts
  const mutationOptions =
    isAuthenticated && user?.contacts?.[0]?._id
      ? { contactID: user.contacts[0]._id }
      : undefined;

  const { createHeightMeasurement, isPending, error } =
    useHeightMeasurementMutation(mutationOptions);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<HeightMeasurementFormData>({
    defaultValues: {
      parentName: '',
      fatherHeight: '',
      motherHeight: '',
      email: '',
      desiredHeight: '',
      routine: '',
      date: new Date(),
      name: '',
      birthDate: '' as unknown as Date,
      weight: '',
      height: '',
      phone: '',
      gender: 1,
      note: 'Đo chiều cao từ website',
    },
  });

  const onSubmit = (formData: HeightMeasurementFormData) => {
    // Đảm bảo số điện thoại đúng định dạng
    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      setError('phone', {
        type: 'manual',
        message: 'Số điện thoại không hợp lệ',
      });

      return;
    }

    try {
      // Always use today's date for the measurement date
      formData.date = new Date();

      // Chuyển đổi birthDate từ string sang Date
      if (typeof formData.birthDate === 'string') {
        formData.birthDate = new Date(formData.birthDate);
      }

      // Chuyển đổi height/weight sang số
      formData.height = Number(formData.height);
      formData.weight = Number(formData.weight);

      // Đảm bảo gender là số
      formData.gender = Number(formData.gender);

      // Thêm note mặc định nếu không có
      if (!formData.note) {
        formData.note = 'Đo chiều cao từ website';
      }

      createHeightMeasurement(formData);
    } catch (err) {
      console.error('🖥️ Form Component: Error processing form data:', err);
      setError('root', {
        type: 'manual',
        message: 'Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại.',
      });
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <form
      aria-labelledby="height-measurement-form-title"
      className="space-y-4 sm:space-y-6"
      onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-base font-semibold">Thông tin của bạn</h2>

      {/* Error message */}
      {error && (
        <div
          className="rounded-lg bg-error-5/10 p-3 sm:p-4 text-error-5 flex items-start gap-2 sm:gap-3"
          role="alert">
          <AlertCircle
            aria-hidden="true"
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
          />
          <p className="text-sm">
            {error instanceof Error
              ? error.message
              : 'Có lỗi xảy ra. Vui lòng thử lại.'}
          </p>
        </div>
      )}

      {/* Parent name */}
      <div className="space-y-1 sm:space-y-2">
        <label
          className="flex items-center text-xs sm:text-sm text-grayscale-90"
          htmlFor="parentName">
          <span aria-hidden="true" className="text-error mr-1">
            *
          </span>
          Họ và tên (bố/mẹ)
        </label>
        <input
          className={`w-full rounded-lg border ${errors.parentName ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
          disabled={isPending}
          id="parentName"
          placeholder="Nhập tên"
          type="text"
          {...register('parentName', {
            required: 'Vui lòng nhập họ và tên',
          })}
          aria-describedby={errors.parentName ? 'parentName-error' : undefined}
          aria-invalid={errors.parentName ? 'true' : 'false'}
        />
        {errors.parentName && (
          <p className="text-xs sm:text-sm text-error" id="parentName-error">
            {errors.parentName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Phone */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="phone">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Số điện thoại
          </label>
          <input
            className={`w-full rounded-lg border ${errors.phone ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="phone"
            placeholder="Nhập số điện thoại"
            type="tel"
            {...register('phone', {
              required: 'Vui lòng nhập số điện thoại',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="text-xs sm:text-sm text-error" id="phone-error">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="email">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Email
          </label>
          <input
            className={`w-full rounded-lg border ${errors.email ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="email"
            placeholder="Nhập email"
            type="email"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            })}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-xs sm:text-sm text-error" id="email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Dad's height */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="fatherHeight">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Chiều cao của bố (cm)
          </label>
          <input
            className={`w-full rounded-lg border ${errors.fatherHeight ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="fatherHeight"
            placeholder="Nhập chiều cao"
            type="text"
            {...register('fatherHeight', {
              required: 'Vui lòng nhập chiều cao của bố',
            })}
            aria-describedby={
              errors.fatherHeight ? 'fatherHeight-error' : undefined
            }
            aria-invalid={errors.fatherHeight ? 'true' : 'false'}
          />
          {errors.fatherHeight && (
            <p
              className="text-xs sm:text-sm text-error"
              id="fatherHeight-error">
              {errors.fatherHeight.message}
            </p>
          )}
        </div>

        {/* Mom's height */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="motherHeight">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Chiều cao của mẹ (cm)
          </label>
          <input
            className={`w-full rounded-lg border ${errors.motherHeight ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="motherHeight"
            placeholder="Nhập chiều cao"
            type="text"
            {...register('motherHeight', {
              required: 'Vui lòng nhập chiều cao của mẹ',
            })}
            aria-describedby={
              errors.motherHeight ? 'motherHeight-error' : undefined
            }
            aria-invalid={errors.motherHeight ? 'true' : 'false'}
          />
          {errors.motherHeight && (
            <p
              className="text-xs sm:text-sm text-error"
              id="motherHeight-error">
              {errors.motherHeight.message}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-base font-semibold">Thông tin của bé</h2>

      {/* Child name */}
      <div className="space-y-1 sm:space-y-2">
        <label
          className="flex items-center text-xs sm:text-sm text-grayscale-90"
          htmlFor="name">
          <span aria-hidden="true" className="text-error mr-1">
            *
          </span>
          Tên bé
        </label>
        <input
          className={`w-full rounded-lg border ${errors.name ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
          disabled={isPending}
          id="name"
          placeholder="Nhập tên"
          {...register('name', { required: 'Vui lòng nhập tên bé' })}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-xs sm:text-sm text-error" id="name-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Evaluation Date */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="date">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Ngày đo
          </label>
          <input
            aria-describedby="date-description"
            className="w-full rounded-lg border border-grayscale-20 bg-grayscale-5 px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 disabled:opacity-90"
            disabled={true}
            id="date"
            type="date"
            value={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Birth Date */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="birthDate">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Ngày sinh
          </label>
          <input
            className={`w-full rounded-lg border ${errors.birthDate ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="birthDate"
            placeholder="Nhập ngày sinh"
            type="date"
            {...register('birthDate', { required: 'Vui lòng chọn ngày sinh' })}
            aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
            aria-invalid={errors.birthDate ? 'true' : 'false'}
          />
          {errors.birthDate && (
            <p className="text-xs sm:text-sm text-error" id="birthDate-error">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Height */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="height">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Chiều cao hiện tại (cm)
          </label>
          <input
            className={`w-full rounded-lg border ${errors.height ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="height"
            placeholder="Nhập chiều cao"
            type="text"
            {...register('height', { required: 'Vui lòng nhập chiều cao' })}
            aria-describedby={errors.height ? 'height-error' : undefined}
            aria-invalid={errors.height ? 'true' : 'false'}
          />
          {errors.height && (
            <p className="text-xs sm:text-sm text-error" id="height-error">
              {errors.height.message}
            </p>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="weight">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Cân nặng hiện tại (kg)
          </label>
          <input
            className={`w-full rounded-lg border ${errors.weight ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="weight"
            placeholder="Nhập cân nặng"
            type="text"
            {...register('weight', { required: 'Vui lòng nhập cân nặng' })}
            aria-describedby={errors.weight ? 'weight-error' : undefined}
            aria-invalid={errors.weight ? 'true' : 'false'}
          />
          {errors.weight && (
            <p className="text-xs sm:text-sm text-error" id="weight-error">
              {errors.weight.message}
            </p>
          )}
        </div>

        {/* Dream height */}
        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="desiredHeight">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Chiều cao mong muốn (cm)
          </label>
          <input
            className={`w-full rounded-lg border ${errors.desiredHeight ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="desiredHeight"
            placeholder="Nhập chiều cao"
            type="text"
            {...register('desiredHeight', {
              required: 'Vui lòng nhập chiều cao mong muốn',
            })}
            aria-describedby={
              errors.desiredHeight ? 'desiredHeight-error' : undefined
            }
            aria-invalid={errors.desiredHeight ? 'true' : 'false'}
          />
          {errors.desiredHeight && (
            <p
              className="text-xs sm:text-sm text-error"
              id="desiredHeight-error">
              {errors.desiredHeight.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <fieldset className="flex flex-row space-y-1 sm:space-y-2">
          <legend className="invisible flex items-center text-xs sm:text-sm text-grayscale-90 h-5">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Giới tính
          </legend>
          <div
            aria-required="true"
            className="flex gap-4 sm:gap-6"
            role="radiogroup">
            <legend className="flex items-center text-xs sm:text-sm text-grayscale-90">
              <span aria-hidden="true" className="text-error mr-1">
                *
              </span>
              Giới tính
            </legend>
            <label className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                disabled={isPending}
                type="radio"
                value={1}
                {...register('gender', { required: 'Vui lòng chọn giới tính' })}
              />
              <span className="text-xs sm:text-sm text-grayscale-90">Nam</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                className="h-4 w-4"
                disabled={isPending}
                type="radio"
                value={2}
                {...register('gender')}
              />
              <span className="text-xs sm:text-sm text-grayscale-90">Nữ</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-xs sm:text-sm text-error" id="gender-error">
              {errors.gender.message}
            </p>
          )}
        </fieldset>
      </div>

      {/* Phone */}
      <div className="space-y-1 sm:space-y-2">
        <label
          className="flex items-center text-xs sm:text-sm text-grayscale-90"
          htmlFor="routine">
          <span aria-hidden="true" className="text-error mr-1">
            *
          </span>
          Lịch sinh hoạt
        </label>
        <input
          className={`w-full rounded-lg border ${errors.routine ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
          disabled={isPending}
          id="routine"
          placeholder="Nhập nội dung"
          type="text"
          {...register('routine', {
            required: 'Vui lòng nhập lịch sinh hoạt',
          })}
          aria-describedby={errors.routine ? 'routine-error' : undefined}
          aria-invalid={errors.routine ? 'true' : 'false'}
        />
        {errors.routine && (
          <p className="text-xs sm:text-sm text-error" id="routine-error">
            {errors.routine.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
        <Button
          className="rounded-lg bg-grayscale-5 border-primary text-primary px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium transition-colors hover:bg-grayscale-10 disabled:opacity-70 order-2 sm:order-1"
          disabled={isPending}
          type="button"
          variant="outline"
          onClick={handleReset}>
          Đặt lại
        </Button>
        <Button
          className="rounded-lg bg-primary px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-20 disabled:opacity-70 flex items-center justify-center gap-2 order-1 sm:order-2"
          disabled={isPending}
          type="submit">
          {isPending ? (
            <>
              <svg
                aria-hidden="true"
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
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
