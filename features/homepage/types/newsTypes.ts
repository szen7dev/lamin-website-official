export interface NewsAuthor {
  _id: string;
  image: string;
  fullname: string;
}

export interface NewsCategory {
  _id: string;
  name: string;
}

export interface NewsThumbnail {
  _id: string;
  name: string;
  path: string;
  size: number;
}

export interface News {
  _id: string;
  type: number;
  tags: string[];
  status: number;
  amountReaction: number;
  amountComment: number;
  amountView: number;
  state: number;
  company: string;
  author: NewsAuthor;
  title: string;
  content: string;
  slug: string;
  category: NewsCategory;
  thumbnail: NewsThumbnail;
  summary: string;
  description: string;
  modifyAt: string;
  createAt: string;
  __v: number;
  userUpdate: string;
}

export interface GetNewsParams {
  limit?: number;
  optionSeller?: number;
  populates?: {
    path: string;
    select: string;
  };
}
