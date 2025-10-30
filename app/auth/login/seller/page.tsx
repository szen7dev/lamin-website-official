'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SellerHeader } from '@/components/layout/SellerHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Zod validation schema
const sellerRegistrationSchema = z.object({
  username: z.string().nonempty('Tên đăng nhập là bắt buộc'),
  password: z.string().nonempty('Mật khẩu là bắt buộc'),
});

type SellerRegistrationForm = z.infer<typeof sellerRegistrationSchema>;

export default function SellerLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SellerRegistrationForm>({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: SellerRegistrationForm) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      router.push('/seller/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SellerHeader />
      <main className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left side - Form */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Đăng nhập Chủ cửa hàng
                </h1>

                <Form {...form}>
                  <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên đăng nhập{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên đăng nhập"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mật khẩu <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                className="pr-10"
                                placeholder="Nhập mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                              />
                            </FormControl>
                            <button
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button
                      className="w-full bg-primary-60 hover:bg-primary-70 text-white py-3 mt-6"
                      disabled={isSubmitting}
                      type="submit">
                      {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                  </form>
                </Form>

                {/* Don't have an account */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link
                      className="text-primary-600 hover:underline"
                      href="/auth/register/seller">
                      Đăng ký
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Marketing content */}
            <div className="w-full max-w-lg text-center lg:text-left">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Chào mừng trở lại!
                </h2>
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">
                  Quản lý cửa hàng dễ dàng
                </h3>

                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-lg">
                      Theo dõi đơn hàng và doanh thu theo thời gian thực
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-lg">
                      Quản lý sản phẩm và kho hàng một cách hiệu quả
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-lg">
                      Kết nối với khách hàng và xây dựng lòng tin
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xl font-medium text-gray-800">
                    Hãy đăng nhập để bắt đầu quản lý cửa hàng của bạn!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
