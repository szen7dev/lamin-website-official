export interface IPaymentData {
  orderID: string;
  orderDescription: string;
  amount: number;
  callbackURL: string;
  userID?: string;
}

export interface IPaymentResponse {
  txId: string;
  neo_ResponseCode: number;
  neo_ResponseData: {
    amount: number;
    bankAccountName: string;
    bankAccount: string;
    bankName: string;
    redirect: string;
    qrData: string;
    remark: string;
  };
}

export interface IPaymentService {
  getPaymentUrl(data: IPaymentData): Promise<IPaymentResponse>;
}
