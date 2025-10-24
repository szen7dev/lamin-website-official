'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DateInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string | Date;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      className,
      value,
      onChange,
      disabled,
      placeholder = 'dd/mm/yyyy',
      ...props
    },
    ref,
  ) => {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

    // Convert value to Date object
    React.useEffect(() => {
      if (!value) {
        setSelectedDate(undefined);

        return;
      }

      const dateObj = typeof value === 'string' ? new Date(value) : value;

      if (dateObj && !isNaN(dateObj.getTime())) {
        setSelectedDate(dateObj);
      }
    }, [value]);

    const handleSelect = (date: Date | undefined) => {
      setSelectedDate(date);
      if (date) {
        // Convert to ISO format (YYYY-MM-DD)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const isoDate = `${year}-${month}-${day}`;

        onChange?.(isoDate);
      } else {
        onChange?.('');
      }
    };

    return (
      <div ref={ref} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'w-full justify-start text-left font-normal bg-white border-grayscale-20 hover:bg-white hover:border-grayscale-20',
                !selectedDate && 'text-grayscale-40',
                className,
              )}
              disabled={disabled}
              variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'dd/MM/yyyy')
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              mode="single"
              selected={selectedDate}
              toYear={new Date().getFullYear() + 10}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

export { DateInput };
