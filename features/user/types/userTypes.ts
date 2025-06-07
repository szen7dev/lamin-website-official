// Types for user feature
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface CreateContactParams {
  name: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
  parent?: string;
  optionSeller?: number;
}

export interface UpdateContactParams {
  contactID: string;
  name: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
}

export interface GetContactParams {
  userCreateID?: string;
  parentID?: string;
  contactID?: string;
}

export interface Contact {
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
  birthday: string | null;
  dateProvice: string | null;
  graduationYear: string | null;
  balance: number;
  familyPolicy: number;
  realStatus: number;
  workStartDate: string | null;
  dayOff: string | null;
  contractDate: string | null;
  contractValid: string | null;
  contractExpire: string | null;
  appointDate: string | null;
  annualWorkingHours: number;
  sallary: number;
  sallaryFactor: number;
  sallarySubFactor: number;
  sallaryBasic: number;
  numberOnLeave: number;
  numberOnLeavePlus: number;
  nods: number;
  changeSallaryDate: string | null;
  insuranceStatus: number;
  insuranceDate: string | null;
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
  xp: number;
  streak: number;
  energy: number;
  state: number;
  userCreate: string;
  company: string;
  funda: string;
  name: string;
  description: string;
  address: string;
  taxid: string;
  phone: string;
  email: string;
  namecv: string;
  sector1: string;
  sector2: string;
  sector3: string;
  modifyAt: string;
  createAt: string;
  joinedDate: string;
  __v: number;
}

export interface DisplayContact {
  _id: string;
  name: string;
  birthday: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  email: string;
  childs: DisplayContact[];
}

export interface UserService {
  getProfile(): Promise<User>;
  updateProfile(profileData: UpdateProfileRequest): Promise<User>;
}
