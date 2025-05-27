import { Populate, Thumbnail } from '@/types';

export interface BannerQueryParams {
  status?: number;
  select?: string;
  optionSeller?: number;
  populates?: Populate;
  type?: number;
  limit?: number;
}

export interface Banner {
  _id: string;
  name: string;
  link: string;
  type: number;
  thumbnail: Thumbnail;
  slug: string;
}
