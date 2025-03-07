// Types for article feature
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  image: string
  category: string
  tags: string[]
}

export interface ArticleListParams {
  category?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export interface ArticleListResponse {
  articles: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ArticleService {
  getArticles(params?: ArticleListParams): Promise<ArticleListResponse>
  getArticleBySlug(slug: string): Promise<Article>
  getFeaturedArticles(): Promise<Article[]>
}

