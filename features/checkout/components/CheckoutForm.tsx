'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { MapPin, User } from 'lucide-react';

import { useAreaSelector } from '../hooks/useAreaSelector';

import { PaymentMethodSelector } from './PaymentMethodSelector';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { provinces } from '@/features/checkout/mocks/province';

const formSchema = z.object({
  // Người đặt
  customerName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  customerPhone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  customerEmail: z
    .string()
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')),

  // Người nhận
  receiverName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  receiverPhone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  note: z.string().optional(),
  paymentMethod: z.enum(['1', '2', '3', '4', '5', '6'], {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
  needInvoice: z.boolean().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;

// Extended type that includes paymentMethodIndex
export type CheckoutFormSubmission = CheckoutFormValues & {
  paymentMethodIndex?: number; // Make this optional since we're using paymentMethod directly
};

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormSubmission) => void;
  isSubmitting?: boolean;
}

export type CheckoutFormRef = {
  submit: () => void;
};

export const CheckoutForm = forwardRef<CheckoutFormRef, CheckoutFormProps>(
  function CheckoutForm({ onSubmit, isSubmitting = false }, ref) {
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
      'delivery',
    );
    // Payment method index (1-based as requested)
    const [paymentMethodIndex, setPaymentMethodIndex] = useState<number>(2); // Default to QR (index 2)

    const form = useForm<CheckoutFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        receiverName: '',
        receiverPhone: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        note: '',
        paymentMethod: '1', // Default to QR
        needInvoice: false,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(handleFormSubmit)();
      },
    }));

    const areaSelector = useAreaSelector(form, provinces);

    // Custom submission handler to include paymentMethodIndex
    const handleFormSubmit = (values: CheckoutFormValues) => {
      onSubmit({
        ...values,
        paymentMethodIndex,
      });
    };

    // Handler for payment method selection
    const handlePaymentMethodSelected = (index: number) => {
      setPaymentMethodIndex(index);
    };

    return (
      <div className="space-y-6">
        {/* Delivery Method Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Hình thức nhận hàng</h2>
          {/* <div className="flex overflow-hidden border border-gray-200 rounded-lg w-1/2">
            <button
              className={`flex-1 py-1 px-3 font-sm transition-colors rounded-l-xl ${
                deliveryMethod === 'delivery'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-700'
              }`}
              disabled={isSubmitting}
              type="button"
              onClick={() => setDeliveryMethod('delivery')}>
              Giao hàng tận nơi
            </button>
            <button
              className={`flex-1 py-1 px-3 font-sm transition-colors rounded--rxl ${
                deliveryMethod === 'pickup'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-700'
              }`}
              disabled={isSubmitting}
              type="button"
              onClick={() => setDeliveryMethod('pickup')}>
              Nhận tại cửa hàng
            </button>
          </div> */}
        </div>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-600 h-5 w-5" />
                <h2 className="text-lg font-medium">Thông tin người đặt</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Họ và tên người đặt"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Số điện thoại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 mb-8">
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Email (không bắt buộc)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600 h-5 w-5" />
                <h2 className="text-lg font-medium">Địa chỉ nhận hàng</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="receiverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Họ và tên người nhận"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Số điện thoại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value}
                        disabled={isSubmitting}
                        onValueChange={value => {
                          field.onChange(value);
                          form.setValue('district', '');
                          form.setValue('ward', '');
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province._id} value={province._id}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value}
                        disabled={!areaSelector.provinceValue || isSubmitting}
                        onValueChange={value => {
                          field.onChange(value);
                          form.setValue('ward', '');
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!areaSelector.provinceValue ? (
                            <SelectItem disabled value="select-province">
                              Vui lòng chọn tỉnh/thành phố trước
                            </SelectItem>
                          ) : areaSelector.isLoadingAreas ? (
                            <SelectItem disabled value="loading">
                              Đang tải...
                            </SelectItem>
                          ) : areaSelector.districts.length > 0 ? (
                            areaSelector.districts.map((district: any) => (
                              <SelectItem
                                key={district._id}
                                value={district._id}>
                                {district.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-results">
                              Không có kết quả
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value}
                        disabled={
                          !areaSelector.selectedDistrict || isSubmitting
                        }
                        onValueChange={value => {
                          field.onChange(value);
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300">
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!areaSelector.selectedDistrict ? (
                            <SelectItem disabled value="select-district">
                              Vui lòng chọn quận/huyện trước
                            </SelectItem>
                          ) : areaSelector.isLoadingAreas ? (
                            <SelectItem disabled value="loading">
                              Đang tải...
                            </SelectItem>
                          ) : areaSelector.wards.length > 0 ? (
                            areaSelector.wards.map((ward: any) => (
                              <SelectItem key={ward._id} value={ward._id}>
                                {ward.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-results">
                              Không có kết quả
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300"
                          disabled={isSubmitting}
                          placeholder="Nhập số nhà, tên đường..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-32 rounded-lg border-gray-300 resize-none"
                          disabled={isSubmitting}
                          placeholder="Ghi chú (không bắt buộc)
VD: Hãy gọi cho tôi 15 phút trước khi giao hàng"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Invoice Toggle */}
            {/* <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-b-2xl shadow-sm">
              <span className="text-gray-800 font-normal">
                Yêu cầu xuất hóa đơn điện tử
              </span>
              <FormField
                control={form.control}
                name="needInvoice"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="data-[state=checked]:bg-blue-500"
                        disabled={isSubmitting}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div> */}

            {/* Payment Method Section */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <PaymentMethodSelector
                    control={form.control}
                    disabled={isSubmitting}
                    onPaymentSelected={handlePaymentMethodSelected}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  },
);
