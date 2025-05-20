import { Populate, Thumbnail } from '@/types';

export interface UserUpdate {
  _id: string;
  image: string;
  fullname: string;
  position: string;
  note: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Post {
  title: string;
  slug: string;
  description: string;
  thumbnail: Thumbnail;
}

export interface Article {
  _id: string;
  type: number;
  tags: string[];
  status: number;
  amountReaction: number;
  amountComment: number;
  amountView: number;
  state: number;
  company: string;
  author: Author | string;
  title: string;
  content: string;
  slug: string;
  category: Category;
  thumbnail: Thumbnail;
  summary: string;
  description: string;
  modifyAt: string;
  createAt: string;
  __v: number;
  userUpdate: UserUpdate;
  caption?: string;
  updateAt?: string;
}

export interface ArticleCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  parentId?: string;
  order?: number;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  role?: string;
  experience?: string;
  verified?: boolean;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ArticleComment {
  _id: string;
  articleId: string;
  author: Author;
  content: string;
  createdAt: string;
  replies?: ArticleComment[];
  likes: number;
  verified?: boolean;
}

export interface ArticleListParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  select?: string;
  featured?: boolean;
  sort?: 'latest' | 'popular' | 'oldest';
  authorId?: string;
  tag?: string;
  verified?: boolean;
  optionSeller?: number;
  populates?: Populate;
  menuSlug?: string;
  lastestID?: string;
  option?: number;
}

export interface ArticleProperty {
  category: Category;
  posts: Post[];
}

export interface ArticleDetailParams {
  slug: string;
  optionSeller?: number;
  select?: string;
  populates?: Populate;
}
