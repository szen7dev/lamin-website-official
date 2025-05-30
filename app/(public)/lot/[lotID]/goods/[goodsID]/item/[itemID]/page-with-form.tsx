'use client';

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetDoctype } from '@/features/doctype/hooks/useGetDoctype';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define form validation schema with Zod
const formSchema = z.object({
  purchaseChannel: z.string().min(1, { message: 'Vui lòng chọn kênh mua hàng' }),
  purchaseReason: z.string().min(1, { message: 'Vui lòng chọn lý do mua hàng' }),
  fullname: z.string().min(2, { message: 'Vui lòng nhập tên của bạn' }),
  phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }).max(15),
  price: z.string().optional(),
  city: z.string().min(1, { message: 'Vui lòng chọn tỉnh/thành phố' }),
  district: z.string().min(1, { message: 'Vui lòng chọn quận/huyện' }),
  ward: z.string().min(1, { message: 'Vui lòng chọn phường/xã' }),
});

type FormValues = z.infer<typeof formSchema>;

const ItemPage = () => {
  const { doctypeList: buyChannel } = useGetDoctype({
    type: 24,
  });

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseChannel: 'pharmacy',
      purchaseReason: 'quality',
      fullname: '',
      phone: '',
      price: '',
      city: 'hanoi',
      district: 'badinh',
      ward: 'trucbach',
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // Here you would normally send the data to your backend
    alert('Đăng ký kích hoạt thành công!');
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-center bg-[#0051a5] rounded-full px-4 py-2 w-32 h-16">
          <Image
            alt="Lamin Logo"
            className="object-contain"
            height={60}
            src="/images/lamin_Logo.webp"
            width={120}
          />
        </div>
        <p className="font-semibold text-xl">Kích hoạt điện tử</p>
        <p className="font-normal text-sm text-grayscale-40">
          Quý khách vui lòng nhập thông tin để kích hoạt phục vụ cho nhận các ưu
          đãi tích luỹ:{' '}
        </p>
      </div>
      <div className="flex flex-col items-center bg-white justify-between w-full max-w-3xl mx-auto">
        {/* Blue header */}
        <div className="flex items-center justify-between gap-4 bg-gradient-primary p-8 w-full">
          <Image alt="" height={200} src="/images/qrCode.webp" width={200} />
          <div>
            <p className="text-3xl text-white">KÍCH HOẠT SẢN PHẨM CỦA BẠN </p>
            <p className="text-xl text-[#DCDFEA]">
              Kênh chăm sóc khách hàng chính thức Lamin
            </p>
          </div>
        </div>

        {/* Benefits section */}
        <div className="bg-[#E5F1FF] p-6 w-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-7 h-7 bg-[#0051a5] rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-gray-700 text-base">
              1 điểm tích tích lũy (đủ 5 điểm tặng quà)
            </p>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-7 h-7 bg-[#0051a5] rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-gray-700 text-base">
              1 Sổ tay LaminGrow-Nhật ký cao lớn
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-[#0051a5] rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-gray-700 text-base">
              Ưu đãi đặc biệt cho các đơn hàng tiếp theo
            </p>
          </div>
        </div>

        {/* Form section with Shadcn Form */}
        <div className="bg-white p-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Purchase channel */}
              <FormField
                control={form.control}
                name="purchaseChannel"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">Kênh bạn mua sản phẩm</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2 mt-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pharmacy" id="pharmacy" />
                          <FormLabel htmlFor="pharmacy" className="text-sm font-normal">Nhà thuốc</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hospital" id="hospital" />
                          <FormLabel htmlFor="hospital" className="text-sm font-normal">Bệnh viện</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tiktok" id="tiktok" />
                          <FormLabel htmlFor="tiktok" className="text-sm font-normal">Tiktok</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="shopee" id="shopee" />
                          <FormLabel htmlFor="shopee" className="text-sm font-normal">Shopee</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="facebook" id="facebook" />
                          <FormLabel htmlFor="facebook" className="text-sm font-normal">Facebook</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="website" id="website" />
                          <FormLabel htmlFor="website" className="text-sm font-normal">Website</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <FormLabel htmlFor="other" className="text-sm font-normal">Khác</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Purchase reason */}
              <FormField
                control={form.control}
                name="purchaseReason"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">Lý do bạn mua sản phẩm</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-x-6 gap-y-2 mt-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="quality" id="quality" />
                          <FormLabel htmlFor="quality" className="text-sm font-normal">Chất lượng tốt</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="service" id="service" />
                          <FormLabel htmlFor="service" className="text-sm font-normal">Dịch vụ tốt</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recommended" id="recommended" />
                          <FormLabel htmlFor="recommended" className="text-sm font-normal">Bạn bè giới thiệu</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-base font-medium">Tên của bạn (*)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nguyễn Văn A" 
                        {...field} 
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-base font-medium">Điện thoại (*)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0988666888" 
                        type="tel"
                        {...field} 
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">Giá mua sản phẩm (không gồm phí ship)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="300.000 đ" 
                        {...field} 
                        className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Tỉnh/Thành phố (*)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hanoi">Hà Nội</SelectItem>
                          <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="danang">Đà Nẵng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* District */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Quận/Huyện (*)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="badinh">Quận Ba Đình</SelectItem>
                          <SelectItem value="hoankiem">Quận Hoàn Kiếm</SelectItem>
                          <SelectItem value="dongda">Quận Đống Đa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Ward */}
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Phường/Xã (*)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]">
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trucbach">Phường Trúc Bạch</SelectItem>
                          <SelectItem value="vinhphuc">Phường Vĩnh Phúc</SelectItem>
                          <SelectItem value="convi">Phường Cống Vị</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full bg-[#0051a5] text-white font-medium py-3 px-4 rounded-md hover:bg-[#004490] transition-colors"
              >
                Nhận điểm và tài liệu ngay
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
