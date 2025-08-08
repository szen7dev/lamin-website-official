'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

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
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  companyName: z.string().min(2, 'Tên công ty phải có ít nhất 2 ký tự'),
  taxId: z.string().min(10, 'Mã số thuế phải có ít nhất 10 ký tự'),
  businessName: z
    .string()
    .min(2, 'Tên nhà bán hàng rút gọn phải có ít nhất 2 ký tự'),
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
});

type SellerRegistrationForm = z.infer<typeof sellerRegistrationSchema>;

export default function SellerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SellerRegistrationForm>({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
      companyName: '',
      taxId: '',
      businessName: '',
      phoneNumber: '',
      address: '',
    },
  });

  const onSubmit = async (data: SellerRegistrationForm) => {
    setIsSubmitting(true);
    try {
      console.log('Seller registration data:', data);
      // TODO: Implement actual registration API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert('Đăng ký thành công!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Có lỗi xảy ra khi đăng ký!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SellerHeader />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left side - Form */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Đăng ký trở thành nhà bán hàng
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

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Địa chỉ email{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập địa chỉ email"
                              type="email"
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

                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Họ và tên <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Họ và tên của người đại diện"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Name */}
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên công ty <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Tên công ty thể hiện trên giấy phép ĐKKD"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tax ID */}
                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mã số thuế <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Mã số thuế" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Name */}
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên nhà bán hàng rút gọn{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên nhà bán hàng rút gọn"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Số điện thoại{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Số điện thoại nhà bán hàng"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Địa chỉ <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="">Chọn địa chỉ</option>
                              <option value="Việt Nam">Việt Nam</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button
                      className="w-full bg-primary-60 hover:bg-primary-70 text-white py-3 mt-6"
                      disabled={isSubmitting}
                      type="submit">
                      {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                    </Button>
                  </form>
                </Form>

                {/* Already have an account */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link
                      className="text-blue-600 hover:underline"
                      href="/auth/login/seller">
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Marketing content */}
            <div className="w-full max-w-lg text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Kết nối với các Chủ cửa hàng
              </h2>
              <h3 className="text-3xl font-bold text-blue-600 mb-6">
                tiện lợi
              </h3>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
