import { Thumbnail } from '@/types';
import { ComboProduct } from '@/features/homepage/types/comboTypes';

export interface Product extends ComboProduct {}

export interface ProductListParams {
  limit?: number;
  optionSeller?: number;
  status?: number;
  page?: number;
  populates?: string | Record<string, any>;
  category?: string;
  menuSlug?: string;
  sort?:
    | 'price-asc'
    | 'price-desc'
    | 'name-asc'
    | 'name-desc'
    | 'rating-asc'
    | 'rating-desc';
  [key: string]: any;
}
