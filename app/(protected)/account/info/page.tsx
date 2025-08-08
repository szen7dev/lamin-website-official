'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { apiClient } from '@/services';
import { genderOptions } from '@/utils';

const personalInfoSchema = z.object({
  name: z.string().min(1, 'Họ và tên không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  gender: z.number().min(1, 'Giới tính không được để trống'),
  birthDay: z.string(),
  email: z.string().email('Email không hợp lệ'),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: string | null | undefined): string | undefined => {
    if (!date) return undefined;
    const [year, month, day] = date.split('-');

    return `${year}-${month}-${day}`;
  };

  const formatDateSafely = (date: string | null | undefined): string => {
    if (!date) return '';
    const dateObj = new Date(date);

    return `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const formatDateForInput = (dateValue: string | null | undefined): string => {
    // If it's empty, return empty string
    if (!dateValue) return '';

    // If it's already a string in YYYY-MM-DD format, return it
    if (
      typeof dateValue === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
      return dateValue;
    }

    // Otherwise, try to convert it to a Date and format it
    try {
      const date = new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) return '';

      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.fullname || '',
      phone: user?.phone || '',
      gender: user?.gender || 1,
      birthDay: formatDateForInput(user?.birthDay || ''),
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: PersonalInfoForm) => {
    try {
      setIsSubmitting(true);
      await updateUser({
        fullname: data.name,
        phone: data.phone,
        gender: data.gender,
        birthDay: formatDate(data.birthDay),
        email: data.email,
      });
      setIsEditing(false);
      reset({
        name: data.name,
        phone: data.phone,
        gender: data.gender,
        birthDay: data.birthDay,
        email: data.email,
      });
    } catch (error) {
      console.error('Error updating user info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      reset({
        name: user?.fullname || '',
        phone: user?.phone || '',
        gender: user?.gender || 1,
        birthDay: formatDateForInput(user?.birthDay || ''),
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  if (!isEditing) {
    return (
      <div className="space-y-8 rounded-2xl p-6 bg-white">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={
                  user?.image
                    ? apiClient.getUserImageUrl(user.image)
                    : '/images/default-avatar.png'
                }
              />
              <AvatarFallback className="text-2xl">
                {user?.fullname?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="max-w-md mx-auto">
            <div className="text-gray-600 flex justify-between items-center border-b-2 py-4">
              <span className="text-sm font-normal text-grayscale-80">
                Họ và tên
              </span>
              <span className="text-sm font-medium text-grayscale-90">
                {user?.fullname}
              </span>
            </div>
            <div className="text-gray-600 flex justify-between items-center border-b-2 py-4">
              <span className="text-sm font-normal text-grayscale-80">
                Số điện thoại
              </span>
              <span className="text-sm font-medium text-grayscale-90">
                {user?.phone}
              </span>
            </div>
            <div className="text-gray-600 flex justify-between items-center border-b-2 py-4">
              <span className="text-sm font-normal text-grayscale-80">
                Giới tính
              </span>
              <span className="text-sm font-medium text-grayscale-90">
                {user?.gender ? genderOptions[user.gender] : 'Khác'}
              </span>
            </div>
            <div className="text-gray-600 flex justify-between items-center border-b-2 py-4">
              <span className="text-sm font-normal text-grayscale-80">
                Ngày sinh
              </span>
              <span className="text-sm font-medium text-grayscale-90">
                {formatDateSafely(user?.birthDay)}
              </span>
            </div>
            <div className="text-gray-600 flex justify-between items-center pt-4">
              <span className="text-sm font-normal text-grayscale-80">
                Email
              </span>
              <span className="text-sm font-medium text-grayscale-90">
                {user?.email}
              </span>
            </div>
          </div>

          <Button
            className="mt-6 px-4 py-2 rounded-full bg-primary/10 border border-primary text-primary hover:text-white"
            onClick={toggleEdit}>
            Chỉnh sửa thông tin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 bg-white">
      <div className="space-y-8 max-w-md mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={
                  user?.image
                    ? apiClient.getUserImageUrl(user.image)
                    : '/images/default-avatar.png'
                }
              />
              <AvatarFallback className="text-2xl">
                {user?.fullname?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2">
            <label
              className="flex items-center text-sm text-grayscale-90"
              htmlFor="name">
              <span aria-hidden="true" className="text-error mr-1">
                *
              </span>
              Họ và tên
            </label>
            <input
              {...register('name')}
              required
              className={`px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
              id="name"
              type="text"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label
              className="flex items-center text-sm text-grayscale-90"
              htmlFor="gender">
              <span aria-hidden="true" className="text-error mr-1">
                *
              </span>
              Giới tính
            </label>
            <select
              {...register('gender')}
              required
              className={`px-3 py-2 border rounded-md ${errors.gender ? 'border-red-500' : ''}`}
              id="gender">
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
              <option value="3">Khác</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label
              className="flex items-center text-sm text-grayscale-90"
              htmlFor="birthDay">
              <span aria-hidden="true" className="text-error mr-1">
                *
              </span>
              Ngày sinh
            </label>
            <input
              {...register('birthDay')}
              required
              className={`px-3 py-2 border rounded-md ${errors.birthDay ? 'border-red-500' : ''}`}
              id="birthDay"
              type="date"
            />
            {errors.birthDay && (
              <p className="text-sm text-red-500">{errors.birthDay.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-grayscale-90" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              {...register('phone')}
              className={`px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
              id="phone"
              type="tel"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-grayscale-90" htmlFor="email">
              Email
            </label>
            <input
              {...register('email')}
              className={`px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
              id="email"
              type="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              className="px-4 py-2 rounded-full border bg-primary text-primary-foreground text-white hover:bg-primary/10 hover:text-primary hover:border-primary"
              disabled={isSubmitting}
              type="submit">
              Cập nhật thông tin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
