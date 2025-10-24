'use client';

import type { DisplayContact } from '../types/userTypes';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import Link from 'next/link';

import { useUpdateContact } from '../hooks/useUpdateContact';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import AddContactModal from '@/components/modal/AddContactModal';

const customerFormSchema = z.object({
  name: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
  birthday: z.string().min(1, { message: 'Vui lòng nhập ngày sinh' }),
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
  email: z
    .string()
    .email({ message: 'Email không hợp lệ' })
    .optional()
    .or(z.literal('')),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerDetailViewProps {
  customer: DisplayContact;
  childContacts: DisplayContact[];
  onBack?: () => void;
  onContactUpdated?: () => void;
}

export function CustomerDetailView({
  customer,
  childContacts,
  onBack,
  onContactUpdated,
}: CustomerDetailViewProps) {
  const [openModal, setOpenModal] = useState(false);
  const [addChildren, setAddChildren] = useState(false);
  const { mutateAsync: updateContact, isPending: isUpdatingContact } =
    useUpdateContact();

  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer.name,
      birthday: customer.birthday || '',
      phone: customer.phone || '',
      email: customer.email || '',
      gender: customer.gender || 'Nam',
    },
  });

  const onCustomerSubmit = async (data: CustomerFormValues) => {
    if (customer) {
      try {
        const genderValue =
          data.gender === 'Nam' ? '0' : data.gender === 'Nữ' ? '1' : '2';

        await updateContact({
          contactID: customer._id,
          name: data.name,
          birthday: data.birthday,
          gender: genderValue,
          phone: data.phone,
          email: data.email || '',
        });

        if (onContactUpdated) {
          onContactUpdated();
        }
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="space-y-3">
        {onBack && (
          <div className="flex items-center gap-4 mb-4">
            <button
              aria-label="Go back to customer list"
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={onBack}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h2 className="text-lg font-semibold">{customer.name}</h2>
            </div>
          </div>
        )}

        {!onBack && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-lg font-semibold">{customer.name}</h2>
          </div>
        )}

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
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm text-gray-500 mb-1">
                      Ngày sinh
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DateInput
                          className="w-full pr-10"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </div>
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
              {childContacts.length === 0 && (
                <Button
                  type="button"
                  onClick={() => {
                    setAddChildren(true);
                    setOpenModal(true);
                  }}>
                  Thêm mới con
                </Button>
              )}
              <Button
                className="bg-[#E6F8FF] hover:bg-[#E6F8FF]/80 text-primary px-6 py-2 rounded-lg border border-primary hover:border-primary/80"
                disabled={isUpdatingContact}
                type="submit">
                {isUpdatingContact ? 'Đang cập nhật...' : 'Lưu thông tin'}
              </Button>
            </div>
          </form>
        </Form>

        {childContacts.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Danh sách con</h3>
            </div>
            <div className="border rounded-xl p-6 space-y-3">
              <div className="flex flex-col gap-4">
                {childContacts.map(child => (
                  <Link
                    key={child._id}
                    className="decoration-transparent cursor-pointer"
                    href={`/account/for-seller/${customer?._id}/${child._id}`}>
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {child.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ngày sinh:{' '}
                            {child.birthday
                              ? formatDate(
                                  new Date(child.birthday),
                                  'dd/MM/yyyy',
                                )
                              : 'N/A'}{' '}
                            | Số điện thoại: {child.phone || 'N/A'} | Giới tính:{' '}
                            {child.gender} | Email: {child.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
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

      <AddContactModal
        addChildren={addChildren}
        isOpen={openModal}
        selectedCustomer={customer}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

export default CustomerDetailView;
