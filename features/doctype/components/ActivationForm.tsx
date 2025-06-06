'use client';

import React from 'react';
import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useGetDoctype } from '../hooks/useGetDoctype';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useGetAddress } from '@/features/address/hooks/useGetAddress';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
    level: 1,
  });
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('');
  const { addressList: districts, isLoading: isDistrictsLoading } =
    useGetAddress({
      level: 2,
      parentID: selectedCity,
    });
  const { addressList: wards, isLoading: isWardsLoading } = useGetAddress({
    level: 3,
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
            <p className="text-3xl text-white">KÍCH HOẠT ĐIỆN TỬ</p>
            <p className="text-xl text-[#DCDFEA]">
              Kênh chăm sóc khách hàng chính thức của Lamin giúp Lamin chăm sóc khách hàng được chu đáo, tận tâm
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
                    <FormItem className="flex flex-col">
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="city">
                        Tỉnh/Thành phố (*)
                      </label>
                      <div className="relative min-h-[42px] sm:min-h-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                className={cn(
                                  'w-full flex items-center justify-between border border-gray-300 rounded-md py-2.5 px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#0051a5]',
                                  !field.value && 'text-gray-500',
                                )}
                                id="city"
                                type="button">
                                {field.value
                                  ? cities.find(
                                      city => city._id === field.value,
                                    )?.name || 'Chọn Tỉnh/Thành phố'
                                  : 'Chọn Tỉnh/Thành phố'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-full p-0">
                            <Command>
                              <CommandInput
                                className="h-9"
                                placeholder="Tìm tỉnh/thành phố..."
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Không tìm thấy tỉnh/thành phố
                                </CommandEmpty>
                                <CommandGroup>
                                  {cities.map(city => (
                                    <CommandItem
                                      key={city._id}
                                      value={city.name}
                                      onSelect={() => {
                                        const cityId = city._id;

                                        setSelectedCity(cityId);
                                        setSelectedDistrict('');
                                        form.setValue('district', '');
                                        form.setValue('ward', '');
                                        field.onChange(cityId);
                                      }}>
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === city._id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {city.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <input
                          name={field.name}
                          type="hidden"
                          value={field.value || ''}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="district">
                        Quận/Huyện (*)
                      </label>
                      <div className="relative min-h-[42px] sm:min-h-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                className={cn(
                                  'w-full flex items-center justify-between border border-gray-300 rounded-md py-2.5 px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#0051a5]',
                                  !field.value && 'text-gray-500',
                                  (!selectedCity || districts.length === 0) &&
                                    'opacity-50 cursor-not-allowed',
                                )}
                                disabled={
                                  !selectedCity || districts.length === 0
                                }
                                id="district"
                                type="button">
                                {field.value
                                  ? districts.find(
                                      district => district._id === field.value,
                                    )?.name || 'Chọn Quận/Huyện'
                                  : 'Chọn Quận/Huyện'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-full p-0">
                            <Command>
                              <CommandInput
                                className="h-9"
                                placeholder="Tìm quận/huyện..."
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Không tìm thấy quận/huyện
                                </CommandEmpty>
                                <CommandGroup>
                                  {districts.map(district => (
                                    <CommandItem
                                      key={district._id}
                                      value={district.name}
                                      onSelect={() => {
                                        const districtId = district._id;

                                        setSelectedDistrict(districtId);
                                        form.setValue('ward', '');
                                        field.onChange(districtId);
                                      }}>
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === district._id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {district.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <input
                          name={field.name}
                          type="hidden"
                          value={field.value || ''}
                        />
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
                    <FormItem className="flex flex-col">
                      <label
                        className="block text-base font-medium mb-2"
                        htmlFor="ward">
                        Phường/Xã (*)
                      </label>
                      <div className="relative min-h-[42px] sm:min-h-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                className={cn(
                                  'w-full flex items-center justify-between border border-gray-300 rounded-md py-2.5 px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#0051a5]',
                                  !field.value && 'text-gray-500',
                                  (!selectedDistrict || wards.length === 0) &&
                                    'opacity-50 cursor-not-allowed',
                                )}
                                disabled={
                                  !selectedDistrict || wards.length === 0
                                }
                                id="ward"
                                type="button">
                                {field.value
                                  ? wards.find(ward => ward._id === field.value)
                                      ?.name || 'Chọn Phường/Xã'
                                  : 'Chọn Phường/Xã'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-full p-0">
                            <Command>
                              <CommandInput
                                className="h-9"
                                placeholder="Tìm phường/xã..."
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Không tìm thấy phường/xã
                                </CommandEmpty>
                                <CommandGroup>
                                  {wards.map(ward => (
                                    <CommandItem
                                      key={ward._id}
                                      value={ward.name}
                                      onSelect={() => {
                                        const wardId = ward._id;

                                        field.onChange(wardId);
                                      }}>
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === ward._id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {ward.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <input
                          name={field.name}
                          type="hidden"
                          value={field.value || ''}
                        />
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
