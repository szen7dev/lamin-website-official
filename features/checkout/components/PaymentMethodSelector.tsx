'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { Control, useWatch } from 'react-hook-form';

import { PAYMENT_METHODS } from '../utils/paymentMethods';
import { CheckoutFormValues } from './CheckoutForm';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSelectorProps {
  control: Control<CheckoutFormValues>;
  onPaymentSelected?: (index: number) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  control,
  onPaymentSelected,
  disabled = false,
}: PaymentMethodSelectorProps) {
  // Watch for value changes to call the onPaymentSelected callback
  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  // Call onPaymentSelected whenever payment method changes
  useEffect(() => {
    if (paymentMethod && onPaymentSelected) {
      const index = PAYMENT_METHODS.findIndex(
        method => method.value === paymentMethod,
      );

      if (index !== -1) {
        onPaymentSelected(index + 1); // +1 because we want indexes to start from 1
      }
    }
  }, [paymentMethod, onPaymentSelected]);

  // Render icon using Next.js Image component
  const renderIcon = (method: (typeof PAYMENT_METHODS)[0]) => {
    return (
      <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1">
        <Image
          alt={method.label}
          className="object-contain"
          height={40}
          src={method.icon}
          width={40}
        />
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Chọn phương thức thanh toán</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <RadioGroup
                  className="divide-y divide-gray-100"
                  disabled={disabled}
                  value={field.value}
                  onValueChange={field.onChange}>
                  {PAYMENT_METHODS.map(method => (
                    <div
                      key={method.id}
                      className={`flex items-center py-4 px-5 ${
                        disabled
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}>
                      <div className="flex items-center gap-3 flex-1">
                        <RadioGroupItem
                          className="border-gray-300 text-blue-600"
                          disabled={disabled}
                          id={method.id}
                          value={method.value}
                        />
                        {renderIcon(method)}
                        <label
                          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          htmlFor={method.id}>
                          {method.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
