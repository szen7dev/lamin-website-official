'use client';

import { useMutation } from '@tanstack/react-query';

import {
  sendBusinessForm,
  type BusinessFormPayload,
} from '@/features/documents/api/sendBusinessForm';

export function useSendBusinessForm() {
  return useMutation({
    mutationKey: ['SEND_BUSINESS_FORM'],
    mutationFn: (payload: BusinessFormPayload) => sendBusinessForm(payload),
  });
}
