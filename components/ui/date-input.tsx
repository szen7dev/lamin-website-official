'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string | Date;
  onChange?: (value: string) => void;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, disabled, placeholder = 'dd/mm/yyyy', ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
    const [month, setMonth] = React.useState<Date | undefined>();
    const [isOpen, setIsOpen] = React.useState(false);

    // Convert value to Date object and display format
    React.useEffect(() => {
      if (!value) {
        setDisplayValue('');
        setSelectedDate(undefined);
        setMonth(undefined);
        return;
      }

      const dateObj = typeof value === 'string' ? new Date(value) : value;

      if (dateObj && !isNaN(dateObj.getTime())) {
        setSelectedDate(dateObj);
        setMonth(dateObj);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        setDisplayValue(`${day}/${month}/${year}`);
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value;

      // Remove all non-numeric characters except /
      input = input.replace(/[^\d/]/g, '');

      // Auto-add slashes as user types
      if (input.length === 2 && displayValue.length === 1) {
        input += '/';
      } else if (input.length === 5 && displayValue.length === 4) {
        input += '/';
      }

      // Limit to dd/mm/yyyy format (10 characters)
      if (input.length > 10) {
        input = input.slice(0, 10);
      }

      setDisplayValue(input);

      // Parse and validate the date when complete
      if (input.length === 10) {
        const parts = input.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);

          // Basic validation
          if (
            day >= 1 &&
            day <= 31 &&
            month >= 1 &&
            month <= 12 &&
            year >= 1900 &&
            year <= 2100
          ) {
            // Create date and verify it's valid
            const dateObj = new Date(year, month - 1, day);

            if (
              dateObj.getDate() === day &&
              dateObj.getMonth() === month - 1 &&
              dateObj.getFullYear() === year
            ) {
              setSelectedDate(dateObj);
              setMonth(dateObj);
              const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              onChange?.(isoDate);
              return;
            }
          }
        }
      }

      // If incomplete or invalid, clear the onChange
      if (input.length < 10) {
        onChange?.('');
      }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      setSelectedDate(date);
      if (date) {
        setMonth(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const isoDate = `${year}-${month}-${day}`;
        setDisplayValue(`${day}/${month}/${year}`);
        onChange?.(isoDate);
      } else {
        setDisplayValue('');
        onChange?.('');
      }
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          className={cn(className)}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-grayscale-40 hover:text-grayscale-90 transition-colors disabled:opacity-50"
              disabled={disabled}
              onClick={() => setIsOpen(!isOpen)}>
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              mode="single"
              month={month}
              selected={selectedDate}
              toYear={new Date().getFullYear() + 10}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

export { DateInput };
