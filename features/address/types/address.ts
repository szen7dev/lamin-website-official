export interface AddressParams {
  type?: number;
  parentID?: string;
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
