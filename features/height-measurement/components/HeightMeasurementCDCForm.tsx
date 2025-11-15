'use client';
import type { HeightMeasurementFormData } from '../types/heightMeasurementTypes';

import { z } from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useHeightMeasurementMutation } from '../hooks/usePostHeightMeasurement';

import { Button } from '@/components/ui/button';
import { DateInput } from '@/components/ui/date-input';
import { CDCResultModal } from '@/components/modal/CDCResultModal';
import { useAuth } from '@/hooks';

const heightMeasurementSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập tên bé'),
    parentName: z.string().min(1, 'Vui lòng nhập tên bố/mẹ'),
    phone: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại')
      .transform(val => {
        if (typeof val === 'string') {
          return val.replace(/\D/g, '');
        }

        return val;
      })
      .refine(
        val => {
          const vietnamPhoneRegex = /^(03|05|07|08|09|02)[0-9]{8}$/;

          return vietnamPhoneRegex.test(val);
        },
        {
          message:
            'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 chữ số)',
        },
      ),
    birthDate: z
      .union([z.string().min(1, 'Vui lòng nhập ngày sinh'), z.date()])
      .transform(val => {
        if (typeof val === 'string' && val !== '') {
          return new Date(val);
        }

        return val;
      }),
    weight: z
      .union([
        z.string().min(1, 'Vui lòng nhập cân nặng'),
        z.number().min(0, 'Cân nặng phải lớn hơn 0'),
      ])
      .transform(val => {
        if (typeof val === 'string') {
          return Number(val.replace(',', '.'));
        }

        return val;
      }),
    height: z
      .union([
        z.string().min(1, 'Vui lòng nhập chiều cao'),
        z.number().min(0, 'Chiều cao phải lớn hơn 0'),
      ])
      .transform(val => {
        if (typeof val === 'string') {
          return Number(val.replace(',', '.'));
        }

        return val;
      }),
    gender: z.union([z.string(), z.number()]).transform(val => Number(val)),
    boneAge: z
      .union([z.string(), z.number()])
      .transform(val => {
        if (typeof val === 'string') {
          return val === '' ? undefined : Number(val);
        }

        return val;
      })
      .optional(),
    pubertyOnsetDate: z
      .union([z.string(), z.date()])
      .transform(val => {
        if (typeof val === 'string') {
          return val === '' ? undefined : new Date(val);
        }

        return val;
      })
      .optional(),
    note: z.string().optional(),
  })
  .refine(
    data => {
      if (data.pubertyOnsetDate && data.birthDate) {
        return data.pubertyOnsetDate > data.birthDate;
      }

      return true;
    },
    {
      message: 'Ngày dậy thì phải sau ngày sinh',
      path: ['pubertyOnsetDate'],
    },
  );

type FormValues = z.infer<typeof heightMeasurementSchema>;

export default function HeightMeasurementCDCForm() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const mutationOptions = {
    onSuccess: isAuthenticated ? undefined : handleOpenModal,
  };

  const { createHeightMeasurement, isPending, error } =
    useHeightMeasurementMutation(mutationOptions);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(heightMeasurementSchema),
    defaultValues: {
      // date: new Date().toISOString().split('T')[0],
      name: '',
      birthDate: undefined,
      weight: '',
      height: '',
      phone: '',
      gender: '1',
      boneAge: '',
      note: 'Đo chiều cao từ website',
      pubertyOnsetDate: undefined,
      parentName: '',
    } as unknown as FormValues,
  });

  const onSubmit = (formData: FormValues) => {
    try {
      createHeightMeasurement({
        ...formData,
        note: formData.note || 'Đo chiều cao từ website',
        // date: new Date()
      } as HeightMeasurementFormData);
    } catch (err) {
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
      className="space-y-4 sm:space-y-6 [&_input]:text-base sm:[&_input]:text-sm"
      onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div
          className="rounded-lg bg-error-5 p-3 sm:p-4 text-error flex items-start gap-2 sm:gap-3"
          role="alert">
          <AlertCircle
            aria-hidden="true"
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
          />
          <p className="text-sm">Có lỗi xảy ra. Vui lòng thử lại.</p>
        </div>
      )}

      <h2 className="text-base font-semibold mt-2">
        Nhập thông tin chi tiết để đo cao
      </h2>

      <div className="space-y-1 sm:space-y-2">
        <label
          className="flex items-center text-xs sm:text-sm text-grayscale-90"
          htmlFor="name">
          <span aria-hidden="true" className="text-error mr-1">
            *
          </span>
          Tên bố/mẹ
        </label>
        <input
          className={`w-full rounded-lg border ${errors.parentName ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
          disabled={isPending}
          id="parentName"
          placeholder="Nhập tên bố/mẹ"
          {...register('parentName')}
          aria-describedby={errors.parentName ? 'parentName-error' : undefined}
          aria-invalid={errors.parentName ? 'true' : 'false'}
        />
        {errors.parentName && (
          <p className="text-xs sm:text-sm text-error" id="parentName-error">
            {errors.parentName.message}
          </p>
        )}
      </div>

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
          {...register('phone')}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          aria-invalid={errors.phone ? 'true' : 'false'}
        />
        {errors.phone && (
          <p className="text-xs sm:text-sm text-error" id="phone-error">
            {errors.phone.message}
          </p>
        )}
      </div>

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
          {...register('name')}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-xs sm:text-sm text-error" id="name-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <fieldset className="flex flex-row">
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
              {...register('gender')}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* <div className="space-y-1 sm:space-y-2">
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
            className="w-full rounded-lg border border-grayscale-20 bg-grayscale-5 px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90"
            id="date"
            type="date"
            {...register('date', { required: 'Vui lòng chọn ngày đo' })}
            aria-invalid={errors.date ? 'true' : 'false'}
          />
          {errors.date && (
            <p className="text-xs sm:text-sm text-error" id="date-error">
              {errors.date.message}
            </p>
          )}
        </div> */}

        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="birthDate">
            <span aria-hidden="true" className="text-error mr-1">
              *
            </span>
            Ngày sinh
          </label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DateInput
                aria-describedby={
                  errors.birthDate ? 'birthDate-error' : undefined
                }
                aria-invalid={errors.birthDate ? 'true' : 'false'}
                className={`w-full rounded-lg border ${errors.birthDate ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                disabled={isPending}
                id="birthDate"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.birthDate && (
            <p className="text-xs sm:text-sm text-error" id="birthDate-error">
              {errors.birthDate.message}
            </p>
          )}
        </div>

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
            {...register('height')}
            aria-describedby={errors.height ? 'height-error' : undefined}
            aria-invalid={errors.height ? 'true' : 'false'}
          />
          {errors.height && (
            <p className="text-xs sm:text-sm text-error" id="height-error">
              {errors.height.message}
            </p>
          )}
        </div>

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
            {...register('weight')}
            aria-describedby={errors.weight ? 'weight-error' : undefined}
            aria-invalid={errors.weight ? 'true' : 'false'}
          />
          {errors.weight && (
            <p className="text-xs sm:text-sm text-error" id="weight-error">
              {errors.weight.message}
            </p>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="boneAge">
            Tuổi xương thực
          </label>
          <input
            className={`w-full rounded-lg border ${errors.boneAge ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
            disabled={isPending}
            id="boneAge"
            placeholder="Nhập ngày tuổi xương"
            type="number"
            {...register('boneAge')}
            aria-describedby={errors.boneAge ? 'boneAge-error' : undefined}
            aria-invalid={errors.boneAge ? 'true' : 'false'}
          />
          {errors.boneAge && (
            <p className="text-xs sm:text-sm text-error" id="boneAge-error">
              {errors.boneAge.message}
            </p>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label
            className="flex items-center text-xs sm:text-sm text-grayscale-90"
            htmlFor="pubertyOnsetDate">
            Ngày dậy thì
          </label>
          <Controller
            control={control}
            name="pubertyOnsetDate"
            render={({ field }) => (
              <DateInput
                aria-describedby={
                  errors.pubertyOnsetDate ? 'pubertyOnsetDate-error' : undefined
                }
                aria-invalid={errors.pubertyOnsetDate ? 'true' : 'false'}
                className={`w-full rounded-lg border ${errors.pubertyOnsetDate ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                disabled={isPending}
                id="pubertyOnsetDate"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.pubertyOnsetDate && (
            <p
              className="text-xs sm:text-sm text-error"
              id="pubertyOnsetDate-error">
              {errors.pubertyOnsetDate.message}
            </p>
          )}
        </div>
      </div>

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

      <CDCResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </form>
  );
}
