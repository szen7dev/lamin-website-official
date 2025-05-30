'use client';

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams } from 'next/navigation';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetDoctype } from '@/features/doctype/hooks/useGetDoctype';
import { Form } from '@/components/ui/form';
import ProductInfo from '@/features/doctype/components/ProductInfo';
import ActivationStatus from '@/features/doctype/components/ActivationStatus';

const formSchema = z.object({
  purchaseChannel: z
    .string()
    .min(1, { message: 'Vui lòng chọn kênh mua hàng' }),
  purchaseReason: z
    .string()
    .min(1, { message: 'Vui lòng chọn lý do mua hàng' }),
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
  const params = useParams();

  console.log('params', params);

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

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
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
      <div className="flex flex-col items-center bg-white justify-between w-full max-w-3xl mx-auto mt-4">
        <div className="flex items-center justify-between gap-4 bg-gradient-primary p-8 w-full mt-4">
          <Image alt="" height={200} src="/images/qrCode.webp" width={200} />
          <div>
            <p className="text-3xl text-white">KÍCH HOẠT SẢN PHẨM CỦA BẠN </p>
            <p className="text-xl text-[#DCDFEA]">
              Kênh chăm sóc khách hàng chính thức Lamin
            </p>
          </div>
        </div>
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
        <div className="bg-white p-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6">
                <p className="text-base font-medium mb-3">
                  Kênh bạn mua sản phẩm
                </p>
                <RadioGroup
                  className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2"
                  defaultValue="pharmacy">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="pharmacy" value="pharmacy" />
                    <label className="text-sm" htmlFor="pharmacy">
                      Nhà thuốc
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="hospital" value="hospital" />
                    <label className="text-sm" htmlFor="hospital">
                      Bệnh viện
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="tiktok" value="tiktok" />
                    <label className="text-sm" htmlFor="tiktok">
                      Tiktok
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="shopee" value="shopee" />
                    <label className="text-sm" htmlFor="shopee">
                      Shopee
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="facebook" value="facebook" />
                    <label className="text-sm" htmlFor="facebook">
                      Facebook
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="website" value="website" />
                    <label className="text-sm" htmlFor="website">
                      Website
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="other" value="other" />
                    <label className="text-sm" htmlFor="other">
                      Khác
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-6">
                <p className="text-base font-medium mb-3">
                  Lý do bạn mua sản phẩm
                </p>
                <RadioGroup
                  className="flex flex-wrap gap-x-6 gap-y-2"
                  defaultValue="quality">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="quality" value="quality" />
                    <label className="text-sm" htmlFor="quality">
                      Chất lượng tốt
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="service" value="service" />
                    <label className="text-sm" htmlFor="service">
                      Dịch vụ tốt
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="recommended" value="recommended" />
                    <label className="text-sm" htmlFor="recommended">
                      Bạn bè giới thiệu
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="fullname">
                    Tên của bạn (*)
                  </label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                    id="fullname"
                    placeholder="Nguyễn Văn A"
                    type="text"
                  />
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="phone">
                    Điện thoại (*)
                  </label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                    id="phone"
                    placeholder="0988666888"
                    type="tel"
                  />
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="price">
                    Giá mua sản phẩm (không gồm phí ship)
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                    id="price"
                    placeholder="300.000 đ"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="city">
                    Tỉnh/Thành phố (*)
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      id="city">
                      <option value="hanoi">Hà Nội</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          d="M19 9l-7 7-7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="district">
                    Quận/Huyện (*)
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      id="district">
                      <option value="badinh">Quận Ba Đình</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          d="M19 9l-7 7-7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    htmlFor="ward">
                    Phường/Xã (*)
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                      id="ward">
                      <option value="trucbach">Phường Trúc Bạch</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          d="M19 9l-7 7-7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-[#0051a5] text-white font-medium py-3 px-4 rounded-md hover:bg-[#004490] transition-colors"
                type="submit">
                Nhận điểm và tài liệu ngay
              </button>
            </form>
          </Form>
        </div>
      </div>
      <ProductInfo
        expiryDate="31/12/2027"
        lotNumber="12345"
        manufacturer="Opella Healthcare Italy S.R.L."
        note="Hỗn dịch uống"
        productName="Viên uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ đường ruột"
      />
      <ActivationStatus
        activationBy="Nguyễn Văn A"
        activationDate="31/12/2027"
        activationPhone="0988666888"
        status="Kích hoạt"
      />
    </div>
  );
};

export default ItemPage;
