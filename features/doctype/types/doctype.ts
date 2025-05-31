export interface DoctypeParams {
  type: number;
  optionSeller?: number;
}

export interface Doctype {
  _id: string;
  type: number;
  belongSystem: number;
  level: number;
  childs: any[];
  amount: number;
  alert: number;
  salesChannel: number;
  amountChilds: number;
  state: number;
  name: string;
  description: string;
  sign: string;
  unit: string;
  company: string;
  userCreate: string;
  userUpdate: string;
  modifyAt: string;
  namecv: string;
  createAt: string;
  __v: number;
  grade: number;
}
