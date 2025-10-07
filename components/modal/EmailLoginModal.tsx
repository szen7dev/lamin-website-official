'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { useLogin } from '@/features/auth/hooks/useLogin';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface EmailLoginModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmailLoginModal({
  children,
  open,
  onOpenChange,
}: EmailLoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending: isLoading } = useLogin({
    onSuccess: async () => {
      onOpenChange?.(false);
      reset();
    },
    onError: () => {
      setError('root', {
        type: 'manual',
        message: 'Email hoặc mật khẩu không đúng',
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('root', { type: 'manual', message: '' });

    login({
      email: data.email,
      password: data.password,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <VisuallyHidden>
        <DialogTitle>Đăng nhập</DialogTitle>
      </VisuallyHidden>
      <DialogContent
        className="sm:max-w-xl w-full mx-4 rounded-3xl border-0 p-0 overflow-hidden bg-white"
        onPointerDownOutside={e => {
          e.preventDefault();
          handleClose();
        }}>
        <div className="relative">
          <div className="px-8 py-8 space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image
                  alt="Authentication"
                  className="w-45 h-45"
                  height={180}
                  src="/images/Authentication 3.svg"
                  width={180}
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
              <p className="text-gray-600 text-base leading-relaxed px-2">
                Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.
              </p>
            </div>

            <form
              noValidate
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-900"
                  htmlFor="email">
                  Email
                </label>
                <Input
                  className={cn(
                    'h-14 rounded-full border-2 px-6 text-base placeholder:text-gray-400 focus:border-cyan-400 focus-visible:ring-0 focus-visible:ring-offset-0',
                    errors.email
                      ? 'border-red-300 focus:border-red-400 focus-visible:ring-0'
                      : 'border-gray-200',
                  )}
                  id="email"
                  placeholder="Nhập email tại đây"
                  type="email"
                  {...register('email')}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-900"
                  htmlFor="password">
                  Mật khẩu
                </label>
                <Input
                  className={cn(
                    'h-14 rounded-full border-2 px-6 text-base placeholder:text-gray-400 focus:border-cyan-400 focus-visible:ring-0 focus-visible:ring-offset-0',
                    errors.password
                      ? 'border-red-300 focus:border-red-400 focus-visible:ring-0'
                      : 'border-gray-200',
                  )}
                  id="password"
                  placeholder="Nhập mật khẩu tại đây"
                  type="password"
                  {...register('password')}
                />
              </div>

              {(errors.email || errors.password || errors.root) && (
                <div className="text-red-500 text-sm text-left">
                  {errors.email && <p>{errors.email.message}</p>}
                  {errors.password && <p>{errors.password.message}</p>}
                  {errors.root && <p>{errors.root.message}</p>}
                </div>
              )}

              <Button
                className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-base transition-colors disabled:opacity-50"
                disabled={isLoading}
                type="submit">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EmailLoginModal;
