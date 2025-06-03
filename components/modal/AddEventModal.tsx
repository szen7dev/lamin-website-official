'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateEvent } from '@/features/vng-event/hooks/useCreateEvent';
import { useUpdateEvent } from '@/features/vng-event/hooks/useUpdateEvent';
import { Event } from '@/features/vng-event/types/event';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event;
}

export interface EventFormValues {
  name: string;
  date: string;
  address: string;
  note: string;
}

export function AddEventModal({
  isOpen,
  onClose,
  eventToEdit,
}: AddEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!eventToEdit;

  const { createEventAsync, isLoading: isCreating } = useCreateEvent();
  const { updateEventAsync, isLoading: isUpdating } = useUpdateEvent();

  const isLoading = isCreating || isUpdating;

  const defaultValues: EventFormValues = useMemo(() => {
    if (isEditMode && eventToEdit) {
      const formattedDate = eventToEdit.date
        ? eventToEdit.date.split('T')[0]
        : '';

      return {
        name: eventToEdit.name || '',
        date: formattedDate,
        address: eventToEdit.address || '',
        note: eventToEdit.note || '',
      };
    }

    return {
      name: '',
      date: '',
      address: '',
      note: '',
    };
  }, [isEditMode, eventToEdit]);

  const form = useForm<EventFormValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);

    const payload = {
      optionSeller: 1,
      ...data,
    };

    try {
      if (isEditMode && eventToEdit) {
        await updateEventAsync({ ...payload, eventID: eventToEdit._id });
      } else {
        await createEventAsync(payload);
      }

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
            {isEditMode ? 'Cập nhật sự kiện' : 'Thêm sự kiện mới'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode
              ? 'Chỉnh sửa thông tin sự kiện'
              : 'Nhập thông tin cho sự kiện mới'}
          </DialogDescription>
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
