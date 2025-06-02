import { Populate } from '@/types';

export interface FundUpsertParams {
  optionSeller?: number;
  type?: 1 | 2;
  date: string;
  name?: string;
  eventID: string;
  address?: string;
  amount: number;
  note: string;
}

export interface Fund extends FundUpsertParams {
  images: any[];
  status: 1;
  state: 1;
  _id: string;
  company: string;
  userCreate: string;
  event: {
    _id: string;
    name: string;
  };
  namecv: string;
  modifyAt: string;
  createAt: string;
  __v: number;
}

export interface FundListParams {
  limit?: number;
  keyword?: string;
  lastestID?: string;
  optionSeller?: number;
  contactID?: string;
  populates?: Populate;
  type?: 1 | 2;
  eventID?: string;
  fundID?: string;
}
