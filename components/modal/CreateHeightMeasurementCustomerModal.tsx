'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

import { useHeightMeasurementMutation } from '@/features/height-measurement/hooks/usePostHeightMeasurement';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateHeightMeasurementCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
  initialData?: {
    name?: string;
    birthDate?: Date;
    gender?: number;
    phone?: string;
    email?: string;
    parentName?: string;
  };
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Vui lòng nhập tên' }),
  birthday: z.string().min(1, { message: 'Vui lòng chọn ngày sinh' }),
  gender: z.number().min(1, { message: 'Vui lòng chọn giới tính' }),
  height: z
    .string()
    .min(1, { message: 'Vui lòng nhập chiều cao' })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Chiều cao phải là số dương',
    }),
  weight: z
    .string()
    .optional()
    .refine(val => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Cân nặng phải là số dương hoặc bỏ trống',
    }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateHeightMeasurementCustomerModal = ({
  isOpen,
  onClose,
  contactId,
}: CreateHeightMeasurementCustomerModalProps) => {
  const { mutate: createHeightMeasurement, isPending } =
    useHeightMeasurementMutation({
      contactID: contactId,
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthday: '',
      gender: 0,
      height: '',
      weight: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    const submissionData = {
      contactID: contactId,
      name: data.name,
      birthDate: new Date(data.birthday),
      gender: data.gender,
      height: data.height,
      weight: data.weight || '0',
    };

    createHeightMeasurement(submissionData, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-start">
            Nhập thông tin chi tiết để đo cao
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            aria-labelledby="height-measurement-form-title"
            className="space-y-4 sm:space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2">
                  <FormLabel className="flex items-center text-xs sm:text-sm text-grayscale-90">
                    <span aria-hidden="true" className="text-error mr-1">
                      *
                    </span>
                    Tên bé
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`w-full rounded-lg border ${form.formState.errors.name ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                      disabled={isPending}
                      placeholder="Nhập tên"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="flex items-center text-xs sm:text-sm text-grayscale-90">
                    <span aria-hidden="true" className="text-error mr-1">
                      *
                    </span>
                    Giới tính
                  </FormLabel>
                  <FormControl className="!mt-0">
                    <RadioGroup
                      className="flex items-center gap-4 sm:gap-6"
                      defaultValue={field.value?.toString()}
                      disabled={isPending}
                      onValueChange={value => field.onChange(Number(value))}>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem id="male" value="1" />
                        </FormControl>
                        <FormLabel
                          className="text-xs sm:text-sm text-grayscale-90 font-normal !mt-0"
                          htmlFor="male">
                          Nam
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem id="female" value="2" />
                        </FormControl>
                        <FormLabel
                          className="text-xs sm:text-sm text-grayscale-90 font-normal !mt-0"
                          htmlFor="female">
                          Nữ
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-3">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 w-full">
                    <FormLabel className="flex items-center text-xs sm:text-sm text-grayscale-90">
                      <span aria-hidden="true" className="text-error mr-1">
                        *
                      </span>
                      Ngày sinh
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`w-full rounded-lg border ${form.formState.errors.birthday ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                        disabled={isPending}
                        placeholder="Nhập ngày sinh"
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 w-full">
                    <FormLabel className="flex items-center text-xs sm:text-sm text-grayscale-90">
                      <span aria-hidden="true" className="text-error mr-1">
                        *
                      </span>
                      Chiều cao hiện tại (cm)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`w-full rounded-lg border ${form.formState.errors.height ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                        disabled={isPending}
                        placeholder="Nhập chiều cao"
                        type="text" // Or number
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2">
                  <FormLabel className="flex items-center text-xs sm:text-sm text-grayscale-90">
                    <span aria-hidden="true" className="text-error mr-1">
                      *
                    </span>
                    Cân nặng hiện tại (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`w-full rounded-lg border ${form.formState.errors.weight ? 'border-error-5' : 'border-grayscale-20'} bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-grayscale-90 placeholder:text-grayscale-40 focus:border-primary-5 focus:outline-none focus:ring-1 focus:ring-primary-5 disabled:opacity-70`}
                      disabled={isPending}
                      placeholder="Nhập cân nặng"
                      type="text" // Or number
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button
                className="rounded-lg bg-grayscale-5 border-primary text-primary px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium transition-colors hover:bg-grayscale-10 disabled:opacity-70 order-2 sm:order-1"
                disabled={isPending}
                type="button"
                variant="outline"
                onClick={() => form.reset()}>
                Đặt lại
              </Button>
              <Button
                className="rounded-lg bg-primary px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-20 disabled:opacity-70 flex items-center justify-center gap-2 order-1 sm:order-2"
                disabled={isPending}
                type="submit">
                {isPending ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  'Gửi đi'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHeightMeasurementCustomerModal;
