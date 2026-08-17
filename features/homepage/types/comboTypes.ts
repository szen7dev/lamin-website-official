import { Thumbnail } from '@/types';

export interface ComboProduct {
  _id: string;
  // Mã sản phẩm. `ProductDetail` đã khai trường này từ trước, các danh sách thì chưa — nên bổ sung ở đây
  // chứ không phải phát minh ra trường mới. Cần cho việc đặt hàng qua s7-data-hub: id sản phẩm hai hệ
  // thống khác nhau, `sign` là khoá nối duy nhất giống nhau ở cả hai bên.
  sign?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  quantity?: number;
  sellingUnitprice: number;
  listedUnitprice: number;
  name: string;
  unit?: string;
  expired?: string;
  unitNote?: string;
  slug?: string;
  thumbnail?: Thumbnail;
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
