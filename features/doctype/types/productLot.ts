import { Populate } from '@/types';

export interface ProductLot {
  _id: string;
  status: number;
  amount: number;
  channelType: number;
  reasonType: number;
  state: number;
  userCreate: string;
  company: string;
  lot: {
    _id: string;
    expired: string;
    name: string;
    sign: string;
    note: string;
  };
  goods: {
    _id: string;
    name: string;
  };
  date: string;
  expired: string;
  name: string;
  sign: string;
  note: string;
  namecv: string;
  customerPhone: string;
  activationDate: string;
  customerName: string;
  area1: string;
  area2: string;
  area3: string;
  modifyAt: string;
  createAt: string;
  __v: number;
}

export interface ProductLotParams {
  sign: string;
  optionSeller?: number;
  populates?: Populate;
}
