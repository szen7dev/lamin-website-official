export interface Voucher {
  name: string;
  sign: string;
  expired: string;
  salesoffAmount: number;
  salesoffRate: number;
  minOrderAmount: number;
}

export interface VoucherParams {
  customerID: string;
  select?: string;
}
