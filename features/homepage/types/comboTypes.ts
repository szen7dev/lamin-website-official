import { Thumbnail } from '@/types';

export interface ComboProduct {
  _id: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  quantity: number;
  sellingUnitprice: number;
  listedUnitprice: number;
  name: string;
  unit: string;
  expired?: string;
  unitNote?: string;
  slug: string;
  thumbnail: Thumbnail;
}

export interface Combo {
  _id: string;
  status: number;
  type: number;
  products: ComboProduct[];
  images: string[];
  state: number;
  userCreate: string;
  company: string;
  name: string;
  slug: string;
  note: string;
  expired: Date;
  modifyAt: string;
  createAt: string;
  __v: number;
  thumbnail: string;
  userUpdate: string;
}

export interface GetSaledComboParams {
  limit?: number;
  optionSeller?: number;
  status?: number;
  populates?: {
    path: string;
    select: string;
    populate?: {
      path: string;
      select: string;
    };
  };
}
