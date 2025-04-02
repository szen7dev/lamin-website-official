import type {
  IPaymentService,
  IPaymentData,
  IPaymentResponse,
} from '../types/paymentTypes';

import { apiClient } from '@/services/api/apiClient';

export class PaymentService implements IPaymentService {
  async getPaymentUrl(data: IPaymentData): Promise<IPaymentResponse> {
    const response = await apiClient.post('/api/payment/url/public', data);

    return response.data;
  }
}

export const paymentService = new PaymentService();
