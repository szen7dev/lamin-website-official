import apiClient from '@/services/api/apiClient';

export interface OrderProduct {
  productID: string;
  quantity: number;
  unitPrice: number;
  listedUnitprice: number;
  name: string;
  note: string;
}

export interface CreateOrderData {
  optionSeller: number;
  customerID?: string;
  outin: number;
  type: number;
  paymentMethod: string;
  voucherID?: string;
  name: string;
  note: string;
  total: string;
  offer: string;
  salesoff: string;
  credit: string;
  shippingFee: string;
  recipientAddress: string;
  areaID: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  recipientName: string;
  recipientPhone: string;
  products: OrderProduct[];
}

/**
 * Creates a new order
 * @param data - Order data to be submitted
 * @returns The created order data from the API response
 */
export const createOrder = async (data: CreateOrderData) => {
  try {
    const response = await apiClient.postNormalizedResponse<CreateOrderData>(
      '/api/store/orders/insert-full',
      data,
    );

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
