'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

import { useGetContact } from '../hooks/useGetContact';

import { useAuth } from '@/hooks';
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

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export function CustomerTabInformation({
  tabInfo,
}: CustomerTabInformationProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [addChildren, setAddChildren] = useState(false);
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
  const { user } = useAuth();
  const { contactList } = useGetContact({
    userCreateID: user?.id || '',
  });

  console.log('contactList', contactList);

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

  useEffect(() => {
    if (selectedCustomer) {
      customerForm.reset({
        name: selectedCustomer.name,
        birthDate: selectedCustomer.birthDate,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email || '',
        gender: selectedCustomer.gender as 'Nam' | 'Nữ' | 'Khác',
        parentPhone: '',
      });
    }
  }, [selectedCustomer, customerForm]);

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

  return (
    <>
      {tabInfo.type === 'customer' && (
        <>
          {!selectedCustomer ? (
            <div className="flex flex-col gap-4 border border-gray-200 p-6 bg-white rounded-2xl">
              <h2 className="text-lg font-semibold">{tabInfo.name}</h2>
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
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCustomer(customer)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedCustomer(customer);
                        }
                      }}>
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
              <div className="flex justify-end">
                <Button
                  className="bg-[#E6F8FF] hover:bg-[#E6F8FF]/80 text-primary px-6 py-2 rounded-lg border border-primary hover:border-primary/80"
                  onClick={() => setOpenModal(true)}>
                  Tạo liên hệ mới
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold">
                    {selectedCustomer.name}
                  </h2>
                </div>

                <Form {...customerForm}>
                  <form
                    className="border rounded-xl p-6 space-y-3 min-h-[300px] sm:min-h-0"
                    onSubmit={customerForm.handleSubmit(onCustomerSubmit)}>
                    <h3 className="text-lg font-medium text-blue-900 pb-2">
                      Thông tin cá nhân
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={customerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-500 mb-1">
                              Họ và tên
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập họ và tên" {...field} />
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
                            <FormLabel className="text-sm text-gray-500 mb-1">
                              Ngày sinh
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="DD/MM/YYYY" {...field} />
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
                            <FormLabel className="text-sm text-gray-500 mb-1">
                              Số điện thoại
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập số điện thoại"
                                {...field}
                              />
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
                            <FormLabel className="text-sm text-gray-500 mb-1">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập email" {...field} />
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
                            <FormLabel className="text-sm text-gray-500 mb-1">
                              Giới tính
                            </FormLabel>
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  checked={field.value === 'Nam'}
                                  className="form-radio text-primary"
                                  type="radio"
                                  {...field}
                                  value="Nam"
                                />
                                <span>Nam</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  checked={field.value === 'Nữ'}
                                  className="form-radio text-primary"
                                  type="radio"
                                  {...field}
                                  value="Nữ"
                                />
                                <span>Nữ</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  checked={field.value === 'Khác'}
                                  className="form-radio text-primary"
                                  type="radio"
                                  {...field}
                                  value="Khác"
                                />
                                <span>Khác</span>
                              </label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <Button
                        className="bg-[#E6F8FF] hover:bg-[#E6F8FF]/80 text-primary px-6 py-2 rounded-lg border border-primary hover:border-primary/80"
                        type="submit"
                        onClick={() => setOpenModal(true)}>
                        Lưu thông tin
                      </Button>
                    </div>
                  </form>
                </Form>

                {selectedCustomer.children &&
                  selectedCustomer.children.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <h3 className="text-lg font-semibold">Danh sách con</h3>
                      </div>
                      <div className="border rounded-xl p-6 space-y-3">
                        <div className="space-y-4">
                          {selectedCustomer.children.map(child => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {child.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Ngày sinh: {child.birthDate} | Số điện
                                    thoại: {child.phone} | Giới tính:{' '}
                                    {child.gender} | Email: {child.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-end mt-6">
                            <Button
                              onClick={() => {
                                setAddChildren(true);
                                setOpenModal(true);
                              }}>
                              Thêm mới con
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          )}
        </>
      )}

      <AddContactModal
        addChildren={addChildren}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
