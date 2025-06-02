export interface AddressParams {
  level?: number;
  parentID?: string;
  lastestID?: string;
}

export interface Address {
  _id: string;
  childs: string[];
  level: number;
  name: string;
  sign: string;
  parent: string;
  modifyAt: string;
  createAt: string;
  userCreate: string;
  __v: number;
}
