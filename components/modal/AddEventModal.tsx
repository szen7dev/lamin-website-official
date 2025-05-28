'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateEvent } from '@/features/vng-event/hooks/useCreateEvent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EventFormValues {
  name: string;
  date: string;
  address: string;
  note: string;
}

export function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEventAsync, isLoading } = useCreateEvent();

  const form = useForm<EventFormValues>({
    defaultValues: {
      name: '',
      date: '',
      address: '',
      note: '',
    },
  });

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);

      await createEventAsync({
        optionSeller: 1,
        name: data.name,
        date: data.date,
        address: data.address,
        note: data.note,
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl min-h-[300px] sm:min-h-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thông tin sự kiện
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sự kiện</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên sự kiện" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: 'Vui lòng nhập tên sự kiện' }}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày tổ chức</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: 'Vui lòng nhập ngày tổ chức' }}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa điểm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: 'Vui lòng nhập địa điểm' }}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Nhập ghi chú về sự kiện"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{ required: 'Vui lòng nhập ghi chú' }}
            />

            <DialogFooter className="pt-4">
              <Button
                disabled={isSubmitting || isLoading}
                type="button"
                variant="outline"
                onClick={onClose}>
                Hủy
              </Button>
              <Button disabled={isSubmitting || isLoading} type="submit">
                {isSubmitting || isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
