export interface Event {
  _id: string;
  income: number;
  expense: number;
  images: any[];
  status: number;
  state: number;
  company: string;
  userCreate: string;
  date: string;
  address: string;
  name: string;
  note: string;
  namecv: string;
  modifyAt: string;
  createAt: string;
  __v: number;
  userUpdate: string;
}

export interface EventListParams {
  limit?: number;
  keyword?: string;
  lastestID?: string;
  optionSeller?: number;
  contactID?: string;
  eventID?: string;
}

export interface EventUpsertParams {
  optionSeller: number;
  date?: string;
  name?: string;
  address?: string;
  note?: string;
  fundID?: string;
  eventID?: string;
}
