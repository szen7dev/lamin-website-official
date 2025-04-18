'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import {
  Area,
  AREA_LEVELS,
  AreaChild,
} from '@/features/checkout/types/areaTypes';
import { useGetAreaList } from '@/features/checkout/hooks/useGetAreaList';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { provinces } from '@/features/checkout/mocks/province';

const formSchema = z.object({
  name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  note: z.string().optional(),
  needInvoice: z.boolean().default(false),
});

export type LocationFormValues = z.infer<typeof formSchema>;

// Extended type that includes paymentMethodIndex
export type LocationFormSubmission = LocationFormValues & {
  paymentMethodIndex?: number; // Make this optional since we're using paymentMethod directly
};

interface LocationFormProps {
  onSubmit: (values: LocationFormSubmission) => void;
  isSubmitting?: boolean;
}

export type LocationFormRef = {
  submit: () => void;
};

export const LocationForm = forwardRef<LocationFormRef, LocationFormProps>(
  function LocationForm({ onSubmit, isSubmitting = false }, ref) {
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
      'delivery',
    );
    // Payment method index (1-based as requested)
    const [paymentMethodIndex, setPaymentMethodIndex] = useState<number>(2); // Default to QR (index 2)

    // Area selection state
    const [selectedProvince, setSelectedProvince] = useState<Area | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<AreaChild | null>(
      null,
    );
    const [selectedWard, setSelectedWard] = useState<AreaChild | null>(null);

    // Get districts and wards based on selected province
    const { areas, isLoading: isLoadingAreas } = useGetAreaList(
      selectedProvince ? { keyword: selectedProvince.name } : {},
    );

    const form = useForm<LocationFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        note: '',
        needInvoice: false,
      },
    });

    // Expose the submit method via ref
    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(handleFormSubmit)();
      },
    }));

    // Handler for payment method selection
    const handlePaymentMethodSelected = (index: number) => {
      setPaymentMethodIndex(index);
    };

    // Reset district and ward when province changes
    useEffect(() => {
      if (selectedProvince) {
        setSelectedDistrict(null);
        setSelectedWard(null);
        form.setValue('district', '');
        form.setValue('ward', '');
      }
    }, [selectedProvince, form]);

    // Reset ward when district changes
    useEffect(() => {
      if (selectedDistrict) {
        setSelectedWard(null);
        form.setValue('ward', '');
      }
    }, [selectedDistrict, form]);

    // Get the province data from API response
    const provinceData = useMemo(() => {
      return areas.find(area => area.level === AREA_LEVELS.PROVINCE);
    }, [areas]);

    // Get districts based on selected province
    const districts = useMemo(() => {
      if (!provinceData || !selectedProvince) return [];

      return provinceData.childs || [];
    }, [provinceData, selectedProvince]);

    // Get wards based on selected district
    const wards = useMemo(() => {
      if (!selectedDistrict) return [];

      return selectedDistrict.childs || [];
    }, [selectedDistrict]);

    // Custom submission handler to include paymentMethodIndex
    const handleFormSubmit = (values: LocationFormValues) => {
      onSubmit({
        ...values,
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Thông tin địa chỉ</h2>
        </div>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300 bg-white"
                          disabled={isSubmitting}
                          placeholder="Họ và tên"
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
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300 bg-white"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 rounded-lg border-gray-300 bg-white"
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
                          // Convert province mock data to Area type
                          const selectedProv = provinces.find(
                            p => p._id === value,
                          );

                          if (selectedProv) {
                            const areaProvince: Area = {
                              _id: selectedProv._id,
                              name: selectedProv.name,
                              level: selectedProv.level,
                              parent: null,
                              childs: [],
                              sign: selectedProv._id,
                            };

                            setSelectedProvince(areaProvince);
                          } else {
                            setSelectedProvince(null);
                          }
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
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
                        disabled={!selectedProvince || isSubmitting}
                        onValueChange={value => {
                          field.onChange(value);
                          const district =
                            districts.find(d => d._id === value) || null;

                          setSelectedDistrict(district);
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!selectedProvince ? (
                            <SelectItem disabled value="select-province">
                              Vui lòng chọn tỉnh/thành phố trước
                            </SelectItem>
                          ) : isLoadingAreas ? (
                            <SelectItem disabled value="loading">
                              Đang tải...
                            </SelectItem>
                          ) : districts.length > 0 ? (
                            districts.map(district => (
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
                        disabled={!selectedDistrict || isSubmitting}
                        onValueChange={value => {
                          field.onChange(value);
                          const ward = wards.find(w => w._id === value) || null;

                          setSelectedWard(ward);
                        }}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!selectedDistrict ? (
                            <SelectItem disabled value="select-district">
                              Vui lòng chọn quận/huyện trước
                            </SelectItem>
                          ) : isLoadingAreas ? (
                            <SelectItem disabled value="loading">
                              Đang tải...
                            </SelectItem>
                          ) : wards.length > 0 ? (
                            wards.map(ward => (
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
                          className="h-12 rounded-lg border-gray-300 bg-white"
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
                          className="min-h-32 rounded-lg border-gray-300 resize-none bg-white"
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
          </form>
        </Form>
      </div>
    );
  },
);
