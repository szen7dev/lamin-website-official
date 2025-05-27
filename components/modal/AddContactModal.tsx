'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
  birthdate: z.string().min(1, { message: 'Vui lòng nhập ngày sinh' }),
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

const AddContactModal = ({ isOpen, onClose }: AddContactModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthdate: '',
      gender: 'Nam',
      phone: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold flex items-center justify-center">
            Thêm liên hệ mới
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
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập ngày sinh" {...field} />
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
              type="submit">
              Lưu liên hệ
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
