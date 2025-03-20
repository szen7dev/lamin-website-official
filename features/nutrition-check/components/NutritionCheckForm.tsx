'use client';
import type { NutritionCheckFormData } from '../types/nutritionCheckTypes';

import { useForm, Controller } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

import { useNutritionCheckMutation } from '../hooks/useNutritionCheckMutation';

import { Button } from '@/components/ui/button';

const foodOptions = [
  { id: 'egg', label: 'Trứng' },
  { id: 'chicken', label: 'Thịt gà' },
  { id: 'beef', label: 'Thịt bò' },
  { id: 'pork', label: 'Thịt heo' },
  { id: 'vegetables', label: 'Rau xanh' },
];

export default function NutritionCheckForm() {
  const { mutate, isPending, error } = useNutritionCheckMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NutritionCheckFormData>({
    defaultValues: {
      name: '',
      birthDate: '',
      regularFoods: [],
      knownProduct: 'no',
    },
  });

  const onSubmit = (data: NutritionCheckFormData) => {
    mutate(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="bg-primary-5 text-white px-4 py-3 text-[15px] font-medium">
        <h2 id="nutrition-form-title">MÔ TẢ THÔNG TIN</h2>
      </header>

      <form
        aria-labelledby="nutrition-form-title"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}>
        {/* Error message */}
        {error && (
          <div
            className="bg-error-5/10 p-4 text-error-5 flex items-start gap-3"
            role="alert">
            <AlertCircle
              aria-hidden="true"
              className="h-5 w-5 shrink-0 mt-0.5"
            />
            <p>
              {error instanceof Error
                ? error.message
                : 'Có lỗi xảy ra. Vui lòng thử lại.'}
            </p>
          </div>
        )}

        {/* Name */}
        <div className="bg-white px-4 py-3">
          <label
            className="flex items-center text-sm text-grayscale-90"
            htmlFor="name">
            Họ và tên{' '}
            <span aria-hidden="true" className="text-error-5 ml-1">
              *
            </span>
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full border-b ${errors.name ? 'border-error-5' : 'border-grayscale-20'} bg-transparent px-0 py-2 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none disabled:opacity-70`}
            disabled={isPending}
            id="name"
            placeholder="Nguyễn Văn A"
            {...register('name', { required: 'Vui lòng nhập họ và tên' })}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error-5" id="name-error">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Birth Date */}
        <div className="bg-white px-4 py-3">
          <label
            className="flex items-center text-sm text-grayscale-90"
            htmlFor="birthDate">
            Ngày sinh{' '}
            <span aria-hidden="true" className="text-error-5 ml-1">
              *
            </span>
            <span className="sr-only">(bắt buộc)</span>
          </label>
          <input
            className={`w-full border-b ${errors.birthDate ? 'border-error-5' : 'border-grayscale-20'} bg-transparent px-0 py-2 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none disabled:opacity-70`}
            disabled={isPending}
            id="birthDate"
            type="date"
            {...register('birthDate', { required: 'Vui lòng chọn ngày sinh' })}
            aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
            aria-invalid={errors.birthDate ? 'true' : 'false'}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-error-5" id="birthDate-error">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Regular Foods */}
        <fieldset className="bg-white px-4 py-3">
          <legend className="flex items-center text-sm text-grayscale-90">
            Bạn đã ăn những món nào thường xuyên{' '}
            <span aria-hidden="true" className="text-error-5 ml-1">
              *
            </span>
            <span className="sr-only">(bắt buộc)</span>
          </legend>
          <div className="mt-2 space-y-2">
            <Controller
              control={control}
              name="regularFoods"
              render={({ field }) => (
                <>
                  {foodOptions.map(food => (
                    <label key={food.id} className="flex items-center gap-2">
                      <input
                        checked={field.value.includes(food.id)}
                        className="h-4 w-4 rounded border-grayscale-20 text-primary-5 focus:ring-primary-5 disabled:opacity-70"
                        disabled={isPending}
                        type="checkbox"
                        onChange={e => {
                          const checked = e.target.checked;
                          const updatedFoods = checked
                            ? [...field.value, food.id]
                            : field.value.filter(id => id !== food.id);

                          field.onChange(updatedFoods);
                        }}
                      />
                      <span className="text-sm text-grayscale-90">
                        {food.label}
                      </span>
                    </label>
                  ))}
                </>
              )}
              rules={{ required: 'Vui lòng chọn ít nhất một món ăn' }}
            />
            {errors.regularFoods && (
              <p className="mt-1 text-xs text-error-5" id="regularFoods-error">
                {errors.regularFoods.message}
              </p>
            )}
          </div>
        </fieldset>

        {/* Known Product */}
        <fieldset className="bg-white px-4 py-3">
          <legend className="flex items-center text-sm text-grayscale-90">
            Bạn đã biết tới sản phẩm của chúng tôi chưa{' '}
            <span aria-hidden="true" className="text-error-5 ml-1">
              *
            </span>
            <span className="sr-only">(bắt buộc)</span>
          </legend>
          <div className="mt-2 flex gap-6" role="radiogroup">
            <label className="flex items-center gap-2">
              <input
                className="h-4 w-4 border-grayscale-20 text-primary-5 focus:ring-primary-5 disabled:opacity-70"
                disabled={isPending}
                type="radio"
                value="yes"
                {...register('knownProduct', {
                  required: 'Vui lòng chọn một lựa chọn',
                })}
              />
              <span className="text-sm text-grayscale-90">Đã biết</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                className="h-4 w-4 border-grayscale-20 text-primary-5 focus:ring-primary-5 disabled:opacity-70"
                disabled={isPending}
                type="radio"
                value="no"
                {...register('knownProduct')}
              />
              <span className="text-sm text-grayscale-90">Chưa biết</span>
            </label>
          </div>
          {errors.knownProduct && (
            <p className="mt-1 text-xs text-error-5" id="knownProduct-error">
              {errors.knownProduct.message}
            </p>
          )}
        </fieldset>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 px-4 py-3">
          <Button
            className="rounded border border-primary-5 px-6 py-2 text-sm font-medium text-primary-5 hover:bg-primary-5/5 disabled:opacity-70"
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={handleReset}>
            Đặt lại
          </Button>
          <Button
            className="rounded bg-primary-5 px-6 py-2 text-sm font-medium text-white hover:bg-primary-20 disabled:opacity-70 flex items-center gap-2"
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
    </div>
  );
}
