'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddContactModal from '@/components/modal/AddContactModal';

interface Customer {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  email: string;
  relation?: string;
  children?: Customer[];
}

interface CustomerTabInformationProps {
  tabInfo: {
    name: string;
    type: 'customer' | 'height';
  };
}

const customerFormSchema = z.object({
  name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  birthDate: z.string().min(1, 'Vui lòng nhập ngày sinh'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  parentPhone: z.string().optional().or(z.literal('')),
  gender: z.enum(['Nam', 'Nữ', 'Khác']),
});

const heightFormSchema = z.object({
  date: z.string().min(1, 'Vui lòng nhập ngày đo'),
  height: z.string().min(1, 'Vui lòng nhập chiều cao'),
  weight: z.string().min(1, 'Vui lòng nhập cân nặng'),
  desiredHeight: z.string().min(1, 'Vui lòng nhập chiều cao mong muốn'),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;
type HeightFormValues = z.infer<typeof heightFormSchema>;

export function CustomerTabInformation({
  tabInfo,
}: CustomerTabInformationProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A (Bố)',
      birthDate: '20/10/1970',
      phone: '0123456789',
      gender: 'Nam',
      email: 'nguyen@gmail.com',
      relation: 'Bố',
    },
    {
      id: '2',
      name: 'Nguyễn Thị B (Mẹ)',
      birthDate: '20/10/1970',
      phone: '0123456789',
      gender: 'Nữ',
      email: 'nguyen@gmail.com',
      relation: 'Mẹ',
      children: [
        {
          id: '1',
          name: 'Nguyễn Văn C',
          birthDate: '20/10/2018',
          phone: '0123456789',
          gender: 'Nam',
          email: 'nguyen@gmail.com',
        },
        {
          id: '2',
          name: 'Nguyễn Văn C2',
          birthDate: '20/10/2018',
          phone: '0123456789',
          gender: 'Nam',
          email: 'nguyen@gmail.com',
        },
        {
          id: '3',
          name: 'Nguyễn Văn C3',
          birthDate: '20/10/2018',
          phone: '0123456789',
          gender: 'Nam',
          email: 'nguyen@gmail.com',
        },
      ],
    },
    {
      id: '3',
      name: 'Nguyễn Văn C',
      birthDate: '20/10/2018',
      phone: '0123456789',
      gender: 'Nam',
      email: 'nguyen@gmail.com',
    },
  ]);

  const [heightMeasurements, setHeightMeasurements] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn C',
      age: '5',
      height: '110',
      weight: '20',
      gender: 'Nam',
      date: '20/05/2025',
    },
    {
      id: '2',
      name: 'Lê Thị D',
      age: '6',
      height: '115',
      weight: '22',
      gender: 'Nữ',
      date: '19/05/2025',
    },
  ]);

  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      phone: '',
      email: '',
      parentPhone: '',
      gender: 'Nam',
    },
  });

  const heightForm = useForm<HeightFormValues>({
    resolver: zodResolver(heightFormSchema),
    defaultValues: {
      height: '',
      weight: '',
      desiredHeight: '',
      date: '',
    },
  });

  const onCustomerSubmit = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: (customers.length + 1).toString(),
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone,
      gender: data.gender as 'Nam' | 'Nữ',
      email: data.email || '',
    };

    setCustomers([...customers, newCustomer]);
    customerForm.reset();
  };

  const onHeightSubmit = (data: HeightFormValues) => {
    const newMeasurement = {
      id: (heightMeasurements.length + 1).toString(),
      name: 'Người dùng mới',
      age: '0',
      height: data.height,
      weight: data.weight,
      gender: 'Nam',
      desiredHeight: data.desiredHeight,
      date: new Date().toLocaleDateString('vi-VN'),
    };

    setHeightMeasurements([...heightMeasurements, newMeasurement]);
    heightForm.reset();
  };

  return (
    <div className="flex flex-col gap-4 border border-gray-200 p-6 bg-white rounded-2xl">
      <h2 className="text-xl font-semibold text-blue-900">{tabInfo.name}</h2>

      {tabInfo.type === 'customer' ? (
        <>
          {!selectedCustomer ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between gap-5 mb-6">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <Input
                    className="pl-10 py-3 border border-gray-300 rounded-md"
                    placeholder="Họ và tên, Số điện thoại..."
                  />
                </div>
                <Button className=" bg-primary hover:bg-primary/80 text-white rounded-r-md">
                  Tìm kiếm
                </Button>
              </div>

              <div className="space-y-6">
                {customers.map(customer => (
                  <div
                    key={customer.id}
                    className="border-b border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-md p-2"
                    onClick={() => setSelectedCustomer(customer)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {customer.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 ml-10">
                      <div>Ngày sinh: {customer.birthDate} |</div>
                      <div>Số điện thoại: {customer.phone} |</div>
                      <div>Giới tính: {customer.gender} |</div>
                      <div>Email: {customer.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="mb-6">
                <Button
                  className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-blue-50 pl-2 pr-4 py-2 rounded-md"
                  variant="ghost"
                  onClick={() => setSelectedCustomer(null)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </Button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold text-blue-900">
                    {selectedCustomer.name}
                  </h2>
                </div>

                <div className="border rounded-xl p-6 space-y-6">
                  <h3 className="text-lg font-medium text-blue-900 border-b pb-2">
                    Thông tin cá nhân
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Họ và tên</h4>
                      <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Ngày sinh</h4>
                      <p className="text-gray-900">
                        {selectedCustomer.birthDate}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">
                        Số điện thoại
                      </h4>
                      <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Email</h4>
                      <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Giới tính</h4>
                      <p className="text-gray-900">{selectedCustomer.gender}</p>
                    </div>

                    {selectedCustomer.relation && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Quan hệ</h4>
                        <p className="text-gray-900">
                          {selectedCustomer.relation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCustomer.children &&
                  selectedCustomer.children.length > 0 && (
                    <div className="border rounded-xl p-6 space-y-6">
                      <h3 className="text-lg font-medium text-blue-900 border-b pb-2">
                        Danh sách con
                      </h3>

                      <div className="space-y-4">
                        {selectedCustomer.children.map(child => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-600">👤</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {child.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Ngày sinh: {child.birthDate}
                                </p>
                              </div>
                            </div>
                            <Button
                              className="text-primary hover:text-primary/80 hover:bg-blue-50"
                              variant="ghost"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedCustomer(child);
                              }}>
                              Xem chi tiết
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex justify-end space-x-3">
                  <Button className="bg-white text-primary border border-primary hover:bg-blue-50">
                    Chỉnh sửa
                  </Button>
                  <Button className="bg-primary text-white hover:bg-primary/80">
                    Lưu thông tin
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">
              Thông tin cá nhân
            </h2>

            <Form {...customerForm}>
              <form
                className="space-y-6"
                onSubmit={customerForm.handleSubmit(onCustomerSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={customerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập ngày sinh"
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số điện thoại" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bố mẹ (nếu có)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số điện thoại" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <RadioGroup
                            className="flex gap-6"
                            value={field.value}
                            onValueChange={field.onChange}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem id="gender-male" value="Nam" />
                              <Label htmlFor="gender-male">Nam</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem id="gender-female" value="Nữ" />
                              <Label htmlFor="gender-female">Nữ</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem id="gender-other" value="Khác" />
                              <Label htmlFor="gender-other">Khác</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    className="bg-white hover:bg-primary-10 text-primary px-6 py-2 rounded-lg border border-primary"
                    type="submit">
                    Tạo danh bạ
                  </Button>
                </div>
              </form>
            </Form>
          </div> */}
        </>
      ) : (
        <>
          {/* <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              <Input
                className="pl-10 py-3 border border-gray-300 rounded-md"
                placeholder="Họ và tên, Tuổi..."
              />
            </div>

            <div className="space-y-6">
              {heightMeasurements.map(measurement => (
                <div
                  key={measurement.id}
                  className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600">📏</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {measurement.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 ml-10">
                    <div>Tuổi: {measurement.age} |</div>
                    <div>Chiều cao: {measurement.height} cm |</div>
                    <div>Cân nặng: {measurement.weight} kg |</div>
                    <div>Giới tính: {measurement.gender} |</div>
                    <div>Ngày đo: {measurement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">
              Thông tin đo cao
            </h2>

            <Form {...heightForm}>
              <form
                className="space-y-6"
                onSubmit={heightForm.handleSubmit(onHeightSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={heightForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày đo</FormLabel>
                        <FormControl>
                          <Input
                            className="pr-10"
                            placeholder="Nhập ngày đo"
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heightForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cân nặng (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập cân nặng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heightForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chiều cao (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập chiều cao" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heightForm.control}
                    name="desiredHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chiều cao mong muốn (cm)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập chiều cao mong muốn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    className="bg-primary-50 hover:bg-primary-60 text-white px-6 py-2 rounded-lg border border-primary hover:border-primary-60"
                    type="submit">
                    Đo cao
                  </Button>
                </div>
              </form>
            </Form>
          </div> */}
        </>
      )}
      <div className="flex justify-end">
        <Button
          className="bg-[#E6F8FF] hover:bg-[#E6F8FF]/80 text-primary px-6 py-2 rounded-lg border border-primary hover:border-primary/80"
          onClick={() => setOpenModal(true)}>
          Tạo liên hệ mới
        </Button>
      </div>

      <AddContactModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
