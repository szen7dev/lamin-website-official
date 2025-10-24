'use client';

import type {
  CreateContactParams,
  DisplayContact,
} from '@/features/user/types/userTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { useCreateContact } from '@/features/user/hooks/useCreateContact';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddContactModalProps {
  addChildren?: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer?: DisplayContact | null;
  metadata?: Record<string, any>;
}

// Create a function to generate schema based on whether we're adding children
const createFormSchema = (isAddingChildren: boolean) => {
  return z.object({
    name: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
    birthday: z.string().min(1, { message: 'Vui lòng nhập ngày sinh' }),
    gender: z.enum(['Nam', 'Nữ', 'Khác'], {
      required_error: 'Vui lòng chọn giới tính',
    }),
    phone: isAddingChildren
      ? z.string().optional()
      : z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
    email: isAddingChildren
      ? z.string().optional()
      : z
          .string()
          .min(1, { message: 'Vui lòng nhập email' })
          .email({ message: 'Email không hợp lệ' }),
  });
};

const formSchema = createFormSchema(false);

type FormValues = z.infer<typeof formSchema>;

const AddContactModal = ({
  isOpen,
  onClose,
  addChildren,
  selectedCustomer,
  metadata,
}: AddContactModalProps) => {
  const { mutate: createContactMutate, isPending: isCreatingContact } =
    useCreateContact();
  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(!!addChildren)),
    defaultValues: {
      name: metadata?.initialName || '',
      birthday: '',
      gender: 'Nam',
      phone: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    let genderValue: string;

    switch (data.gender) {
      case 'Nam':
        genderValue = '0';
        break;
      case 'Nữ':
        genderValue = '1';
        break;
      default:
        genderValue = '2';
        break;
    }

    // Create the params object with required fields
    const params: CreateContactParams = {
      name: data.name,
      birthday: data.birthday,
      gender: genderValue,
      phone: addChildren ? data.phone || '' : data.phone,
      email: addChildren ? data.email || '' : data.email,
      parent: selectedCustomer?._id,
      optionSeller: selectedCustomer ? 1 : 0,
    };

    createContactMutate(params, {
      onSuccess: data => {
        console.log('Contact created successfully:', data);

        if (metadata?.callback) {
          metadata.callback(data);
        }
        form.reset();
        onClose();
      },
    });
  };

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      name: metadata?.initialName || '',
    });
  }, [metadata?.initialName || '']);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold flex items-center justify-center">
            {addChildren ? 'Thêm mới con cái' : 'Thêm liên hệ mới'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 py-2"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
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
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DateInput
                        className="w-full pr-10"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                        <FormLabel
                          className="cursor-pointer"
                          htmlFor="gender-male">
                          Nam
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="gender-female" value="Nữ" />
                        <FormLabel
                          className="cursor-pointer"
                          htmlFor="gender-female">
                          Nữ
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="gender-other" value="Khác" />
                        <FormLabel
                          className="cursor-pointer"
                          htmlFor="gender-other">
                          Khác
                        </FormLabel>
                      </div>
                    </RadioGroup>
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
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 mt-6 text-lg font-medium rounded-full"
              disabled={isCreatingContact}
              type="submit">
              {isCreatingContact
                ? 'Đang lưu...'
                : addChildren
                  ? 'Thêm mới'
                  : 'Lưu liên hệ'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
