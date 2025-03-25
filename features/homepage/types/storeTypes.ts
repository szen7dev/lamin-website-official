import { Populate, Thumbnail } from '@/types';

export interface Area {
  _id: number;
  name: string;
}

export interface TrustedStore {
  _id: number;
  name: string;
  rating: number;
  numberOfRating: number;
  thumbnail: Thumbnail;
  address: string;
  area1: Area;
  area2: Area;
  area3: Area;
  phone?: string;
  description?: string;
}

export interface GetTrustedStoreParams {
  optionSeller?: number;
  select?: string;
  populates?: Populate;
  keyword?: string;
  fundaID?: string;
}
