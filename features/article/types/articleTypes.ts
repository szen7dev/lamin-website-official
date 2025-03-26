import { Thumbnail } from '@/types';

// Types for article feature
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
  category: string;
  thumbnail: Thumbnail;
  summary: string;
  description: string;
  modifyAt: Date;
  createAt: Date;
  __v: number;
  userUpdate: string;
  caption?: string;
  updateAt?: Date;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  parentId?: string; // For nested categories
  order?: number;
}

// Update the Author interface to include experience field
export interface Author {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  bio?: string;
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
  id: string;
  articleId: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  replies?: ArticleComment[];
  likes: number;
  verified?: boolean;
}

// API Params & Responses
export interface ArticleListParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  sort?: 'latest' | 'popular' | 'oldest';
  authorId?: string;
  tag?: string;
  verified?: boolean;
  optionSeller?: number;
}

// Service Interface
export interface ArticleService {
  getArticles(params?: ArticleListParams): Promise<Article[]>;
  getArticleBySlugID(slug: string): Promise<Article>;
  getRelatedArticles(articleSlug: string, limit?: number): Promise<Article[]>;
  // getArticleCategories(): Promise<ArticleCategory[]>;
  // getFeaturedArticles(limit?: number): Promise<Article[]>;
  // getPopularArticles(limit?: number): Promise<Article[]>;
  // getArticleComments(articleId: string): Promise<ArticleComment[]>;
  // addArticleComment(
  //   articleId: string,
  //   comment: Omit<ArticleComment, 'id' | 'createdAt'>,
  // ): Promise<ArticleComment>;
  // likeArticle(articleId: string): Promise<void>;
  // shareArticle(
  //   articleId: string,
  //   platform: 'facebook' | 'twitter' | 'linkedin',
  // ): Promise<void>;
}
