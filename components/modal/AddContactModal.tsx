'use client';

import type {
  CreateContactParams,
  DisplayContact,
} from '@/features/user/types/userTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useCreateContact } from '@/features/user/hooks/useCreateContact';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface AddContactModalProps {
  addChildren?: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer?: DisplayContact | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
  birthday: z.string().min(1, { message: 'Vui lòng nhập ngày sinh' }),
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
  email: z
    .string()
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
});

type FormValues = z.infer<typeof formSchema>;

const AddContactModal = ({
  isOpen,
  onClose,
  addChildren,
  selectedCustomer,
}: AddContactModalProps) => {
  const { mutate: createContactMutate, isPending: isCreatingContact } =
    useCreateContact();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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

    const params: CreateContactParams = {
      name: data.name,
      birthday: data.birthday,
      gender: genderValue,
      phone: data.phone,
      email: data.email,
      parent: selectedCustomer?._id,
      optionSeller: selectedCustomer ? 1 : 0,
    };

    createContactMutate(params, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          variant={'outline'}>
                          {field.value ? (
                            format(new Date(field.value), 'dd/MM/yyyy')
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date: Date | undefined) =>
                          field.onChange(
                            date ? date.toISOString().split('T')[0] : undefined,
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
