'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useHeightMeasurementMutation } from '@/features/height-measurement/hooks/usePostHeightMeasurement';
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
import { cn } from '@/lib/utils';

interface CreateHeightMeasurementModalProps {
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
  date: z.string().min(1, { message: 'Vui lòng chọn ngày đo' }),
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
  desiredHeight: z
    .string()
    .optional()
    .refine(val => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Chiều cao mong muốn phải là số dương hoặc bỏ trống',
    }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateHeightMeasurementModal = ({
  isOpen,
  onClose,
  contactId,
}: CreateHeightMeasurementModalProps) => {
  const { mutate: createHeightMeasurement, isPending } =
    useHeightMeasurementMutation({
      contactID: contactId,
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
      desiredHeight: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    createHeightMeasurement(
      {
        contactID: contactId,
        date: data.date,
        height: data.height,
        weight: data.weight || '0',
        desiredHeight: data.desiredHeight || '0',
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-center">
            Tạo đo cao
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày đo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          variant="outline">
                          {field.value ? (
                            format(new Date(field.value), 'dd/MM/yyyy')
                          ) : (
                            <span>Nhập ngày đo</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        disabled={date =>
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
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều cao (cm)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập chiều cao"
                      {...field}
                      min="0"
                      step="0.1"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cân nặng (kg - Nếu có )</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập cân nặng"
                      {...field}
                      min="0"
                      step="0.1"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desiredHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều cao mong muốn (cm - Nếu có )</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập chiều cao mong muốn"
                      {...field}
                      min="0"
                      step="0.1"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 mt-6 text-lg font-medium rounded-full"
              disabled={isPending}
              type="submit">
              {isPending ? 'Đang lưu...' : 'Lưu đo cao'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHeightMeasurementModal;
