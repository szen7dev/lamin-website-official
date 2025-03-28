import type {
  ArticleService,
  Article,
  ArticleCategory,
  ArticleListParams,
  ArticleComment,
} from '../types/articleTypes';

import axios from 'axios';

// Create an axios instance with baseURL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export class ArticleRealService implements ArticleService {
  async getArticles(params?: ArticleListParams): Promise<Article[]> {
    const response = await apiClient.get('/api/medias', { params });

    return response.data;
  }

  async getArticleBySlugID(slug: string): Promise<Article> {
    const response = await apiClient.get(`/api/medias/${slug}`);

    return response.data;
  }

  async getArticleCategories(): Promise<ArticleCategory[]> {
    const response = await apiClient.get('/api/articles/categories');

    return response.data;
  }

  async getRelatedArticles(
    articleSlug: string,
    limit?: number,
  ): Promise<Article[]> {
    const response = await apiClient.get(
      `/api/articles/${articleSlug}/related`,
      {
        params: { limit },
      },
    );

    return response.data;
  }

  async getFeaturedArticles(limit?: number): Promise<Article[]> {
    const response = await apiClient.get('/api/articles/featured', {
      params: { limit },
    });

    return response.data;
  }

  async getPopularArticles(limit?: number): Promise<Article[]> {
    const response = await apiClient.get('/api/articles/popular', {
      params: { limit },
    });

    return response.data;
  }

  async getArticleComments(articleId: string): Promise<ArticleComment[]> {
    const response = await apiClient.get(`/api/articles/${articleId}/comments`);

    return response.data;
  }

  async addArticleComment(
    articleId: string,
    comment: Omit<ArticleComment, 'id' | 'createdAt'>,
  ): Promise<ArticleComment> {
    const response = await apiClient.post(
      `/api/articles/${articleId}/comments`,
      comment,
    );

    return response.data;
  }

  async likeArticle(articleId: string): Promise<void> {
    await apiClient.post(`/api/articles/${articleId}/like`);
  }

  async shareArticle(
    articleId: string,
    platform: 'facebook' | 'twitter' | 'linkedin',
  ): Promise<void> {
    await apiClient.post(`/api/articles/${articleId}/share`, { platform });
  }
}

// Export a singleton instance
export const articleRealService = new ArticleRealService();
