export interface Voucher {
  _id: string;
  name: string;
  sign: string;
  expired: Date;
  salesoffAmount: number;
  salesoffRate: number;
  minOrderAmount: number;
}

export interface VoucherParams {
  customerID?: string;
  select?: string;
}
