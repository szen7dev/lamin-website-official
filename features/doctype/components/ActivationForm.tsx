'use client';

import React from 'react';
import Image from 'next/image';

import { useGetDoctype } from '../hooks/useGetDoctype';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetAddress } from '@/features/address/hooks/useGetAddress';

interface ActivationFormProps {
  form: any;
  isActivating: boolean;
  onSubmit: (data: any) => void;
}

const ActivationForm = ({
  form,
  isActivating,
  onSubmit,
}: ActivationFormProps) => {
  const { doctypeList: buyChannel } = useGetDoctype({
    type: 24,
  });
  const { doctypeList: buyReason } = useGetDoctype({
    type: 19,
  });

  const { addressList: cities } = useGetAddress({
    type: 1,
  });
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('');
  const { addressList: districts, isLoading: isDistrictsLoading } =
    useGetAddress({
      type: 2,
      parentID: selectedCity,
    });
  const { addressList: wards, isLoading: isWardsLoading } = useGetAddress({
    type: 3,
    parentID: selectedDistrict,
  });

  return (
    <div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-center bg-[#0051a5] rounded-full px-4 py-2 w-32 h-16">
          <Image
            priority
            alt="Lamin Logo"
            className="object-contain"
            height={60}
            src="/images/Lamin_Logo.webp"
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
        <div className="flex items-center justify-between gap-4 bg-gradient-primary p-8 w-full">
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
              <FormField
                control={form.control}
                name="purchaseChannel"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <p className="text-base font-medium mb-3">
                      Kênh bạn mua sản phẩm
                    </p>
                    <FormControl>
                      <RadioGroup
                        className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2"
                        value={field.value}
                        onValueChange={field.onChange}>
                        {buyChannel.map(channel => (
                          <div
                            key={channel._id}
                            className="flex items-center space-x-2">
                            <RadioGroupItem
                              id={channel._id}
                              value={channel._id}
                            />
                            <label className="text-sm" htmlFor={channel._id}>
                              {channel.name}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseReason"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <p className="text-base font-medium mb-3">
                      Lý do bạn mua sản phẩm
                    </p>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-wrap gap-x-6 gap-y-2"
                        value={field.value}
                        onValueChange={field.onChange}>
                        {buyReason.map(reason => (
                          <div
                            key={reason._id}
                            className="flex items-center space-x-2">
                            <RadioGroupItem
                              id={reason._id}
                              value={reason._id}
                            />
                            <label className="text-sm" htmlFor={reason._id}>
                              {reason.name}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 mb-6">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="fullname">
                        Tên của bạn (*)
                      </label>
                      <FormControl>
                        <input
                          className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                          id="fullname"
                          placeholder="Nguyễn Văn A"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="phone">
                        Điện thoại (*)
                      </label>
                      <FormControl>
                        <input
                          className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                          id="phone"
                          placeholder="0988666888"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="price">
                        Giá mua sản phẩm (không gồm phí ship)
                      </label>
                      <FormControl>
                        <input
                          className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                          id="price"
                          placeholder="300.000 đ"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 min-h-[120px] sm:min-h-0">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="city">
                        Tỉnh/Thành phố (*)
                      </label>
                      <div className="relative">
                        <FormControl>
                          <select
                            className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                            id="city"
                            value={field.value}
                            onChange={e => {
                              const cityId = e.target.value;

                              setSelectedCity(cityId);
                              setSelectedDistrict('');
                              form.setValue('district', '');
                              form.setValue('ward', '');

                              field.onChange(e);
                            }}>
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {cities.map(city => (
                              <option key={city._id} value={city._id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="district">
                        Quận/Huyện (*)
                      </label>
                      <div className="relative">
                        <FormControl>
                          <select
                            className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                            disabled={!selectedCity || districts.length === 0}
                            id="district"
                            value={field.value}
                            onChange={e => {
                              const districtId = e.target.value;

                              setSelectedDistrict(districtId);
                              form.setValue('ward', '');
                              field.onChange(e);
                            }}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map(district => (
                              <option key={district._id} value={district._id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
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
                      {isDistrictsLoading && (
                        <p className="text-sm text-gray-500 mt-1">
                          Đang tải...
                        </p>
                      )}
                      {!isDistrictsLoading &&
                        districts.length === 0 &&
                        selectedCity && (
                          <p className="text-sm text-gray-500 mt-1">
                            Không có dữ liệu quận/huyện
                          </p>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="ward">
                        Phường/Xã (*)
                      </label>
                      <div className="relative">
                        <FormControl>
                          <select
                            className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0051a5]"
                            disabled={!selectedDistrict || wards.length === 0}
                            id="ward"
                            value={field.value}
                            onChange={field.onChange}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map(ward => (
                              <option key={ward._id} value={ward._id}>
                                {ward.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
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
                      {isWardsLoading && (
                        <p className="text-sm text-gray-500 mt-1">
                          Đang tải...
                        </p>
                      )}
                      {!isWardsLoading &&
                        wards.length === 0 &&
                        selectedDistrict && (
                          <p className="text-sm text-gray-500 mt-1">
                            Không có dữ liệu phường/xã
                          </p>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <button
                className="w-full bg-[#0051a5] text-white font-medium py-3 px-4 rounded-md hover:bg-[#004490] transition-colors"
                disabled={isActivating}
                type="submit">
                {isActivating ? 'Đang xử lý...' : 'Nhận điểm và tài liệu ngay'}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ActivationForm;
