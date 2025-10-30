import { apiClient } from '@/services/api/apiClient';

export type BusinessFormPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
  type?: number; // defaults to 2 if not provided
};

export async function sendBusinessForm(payload: BusinessFormPayload) {
  const body = { ...payload, type: payload.type ?? 2 };

  try {
    const response = await apiClient.post('/api/crm/register', body);

    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message;

    throw new Error(message);
  }
}
