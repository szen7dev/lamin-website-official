import { Populate } from '@/types';

export interface Field {
  _id: string;
  name: string;
}

export interface Position {
  _id: string;
  name: string;
}

export interface Coach {
  _id: string;
  isDefault: number;
  childs: any[];
  level: number;
  nestedParents: any[];
  nestedChilds: any[];
  documents: any[];
  type: number;
  subtype: number;
  status: number;
  gender: number;
  birthday: null | string;
  dateProvice: null | string;
  graduationYear: null | number;
  balance: number;
  familyPolicy: number;
  realStatus: number;
  workStartDate: null | string;
  dayOff: null | string;
  contractDate: null | string;
  contractValid: null | string;
  contractExpire: null | string;
  appointDate: null | string;
  annualWorkingHours: number;
  sallary: number;
  sallaryFactor: number;
  sallarySubFactor: number;
  sallaryBasic: number;
  numberOnLeave: number;
  nods: number;
  changeSallaryDate: null | string;
  insuranceStatus: number;
  insuranceDate: null | string;
  insuranceFee: number;
  union: number;
  share: number;
  files: any[];
  image: string;
  amountWorkHistory: number;
  amountProjectHistory: number;
  amountContractHistory: number;
  amountEducationHistory: number;
  amountCertificateHistory: number;
  amountChilds: number;
  achievements: any[];
  getVouchers: any[];
  usedVouchers: any[];
  getStoreVouchers: any[];
  usedStoreVouchers: any[];
  nonResident: number;
  new: number;
  numberOfOrders: number;
  total: number;
  purchasedValue: number;
  numberOfCancelOrders: number;
  totalOfCancelOrders: number;
  purchasedOffValue: number;
  totalLoyaltyPoints: number;
  usedLoyaltyPoints: number;
  remainLoyaltyPoints: number;
  membershipLevel: number;
  state: number;
  userCreate: string;
  company: string;
  funda: string;
  name: string;
  phone: string;
  email: string;
  namecv: string;
  modifyAt: string;
  createAt: string;
  joinedDate: string;
  __v: number;
  linkUser: string;
  userUpdate: string;
  field: Field;
  note: string;
  position: Position;
}

export interface GetCoachParams {
  optionSeller?: number;
  limit?: number;
  status?: number;
  page?: number;
  sort?: string;
}

export interface GetDetailCoachParams {
  contactID: string;
  populates?: Populate;
  select?: string;
}
