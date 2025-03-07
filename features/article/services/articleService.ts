import axios from "axios"
import type { ArticleService, Article, ArticleListParams, ArticleListResponse } from "../types/articleTypes"

export class ArticleRealService implements ArticleService {
  async getArticles(params?: ArticleListParams): Promise<ArticleListResponse> {
    const response = await axios.get("/api/articles", { params })
    return response.data
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await axios.get(`/api/articles/${slug}`)
    return response.data
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const response = await axios.get("/api/articles/featured")
    return response.data
  }
}

// Export a singleton instance
export const articleRealService = new ArticleRealService()

