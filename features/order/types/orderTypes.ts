// Base interfaces for common fields
interface BaseOrderFields {
  optionSeller: number;
  customerID?: string;
  outin: number;
  type: number;
  paymentMethod: string;
  voucherID?: string;
  name: string;
  note: string;
  total: number;
  offer: number;
  salesoff: number;
  credit: number;
  shippingFee: number;
  recipientAddress: string;
  areaID: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  recipientName: string;
  recipientPhone: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  productID: string;
  quantity: number;
  unitPrice: number;
  listedUnitprice: number;
  name: string;
  note: string;
}

export interface Funda {
  _id: string;
  name: string;
  sign: string;
}

export interface Customer {
  _id: string;
  name: string;
}

// Main order type with additional fields for full order
export interface Order extends BaseOrderFields {
  id: string;
  sign: string;
  createAt: string;
  amount: number;
  customer: Customer;
  status: number;
  loyaltyPoints: number;
  totalShippingFee: number;
  deliveryStartETA?: string;
  deliveryEndETA?: string;
  processingTime?: string;
  deliveryStartTime?: string;
  deliveredTime?: string;
  funda: Funda;
}

// Type for creating a new order
export interface CreateOrderData extends BaseOrderFields {}

// Type for API response when creating an order
export interface CreateOrderResponse extends BaseOrderFields {
  _id: string;
}

export interface OrderService {
  getOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order>;
  createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse>;
}
