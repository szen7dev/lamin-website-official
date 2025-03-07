import type { ArticleService, Article, ArticleListParams, ArticleListResponse } from "../types/articleTypes"

// Mock article data
const mockArticles: Article[] = [
  {
    id: "1",
    title:
      "Chính thức: Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em và đánh giá an toàn tiêm chủng cho toàn dân",
    slug: "chinh-thuc-tiem-chung-elela-thong-tin-ve-ket-qua-kiem-tra",
    content: "Nội dung chi tiết về tiêm chủng Elela...",
    excerpt: "Thông tin về kết quả kiểm tra của trẻ em và đánh giá an toàn tiêm chủng cho toàn dân",
    author: "Nguyễn Văn A",
    publishedAt: "2023-10-27",
    image: "/placeholder.svg?height=400&width=600",
    category: "Truyền Thông",
    tags: ["tiêm chủng", "trẻ em", "an toàn"],
  },
  {
    id: "2",
    title: "Tiêm chủng Elela thông tin về kết quả kiểm tra của trẻ em",
    slug: "tiem-chung-elela-thong-tin-ve-ket-qua-kiem-tra-cua-tre-em",
    content: "Nội dung chi tiết về tiêm chủng Elela cho trẻ em...",
    excerpt: "Thông tin về kết quả kiểm tra của trẻ em",
    author: "Nguyễn Văn B",
    publishedAt: "2023-10-26",
    image: "/placeholder.svg?height=100&width=150",
    category: "Truyền Thông",
    tags: ["tiêm chủng", "trẻ em"],
  },
  // Add more mock articles as needed
]

export class ArticleMockService implements ArticleService {
  async getArticles(params?: ArticleListParams): Promise<ArticleListResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredArticles = [...mockArticles]

    // Apply filters
    if (params?.category) {
      filteredArticles = filteredArticles.filter((a) => a.category === params.category)
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (a) => a.title.toLowerCase().includes(searchLower) || a.content.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    if (params?.sort) {
      switch (params.sort) {
        case "date-asc":
          filteredArticles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
          break
        case "date-desc":
          filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          break
        case "title-asc":
          filteredArticles.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "title-desc":
          filteredArticles.sort((a, b) => b.title.localeCompare(a.title))
          break
        default:
          // Default sorting by date desc
          filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          break
      }
    } else {
      // Default sorting by date desc
      filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
      page,
      limit,
      totalPages: Math.ceil(filteredArticles.length / limit),
    }
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const article = mockArticles.find((a) => a.slug === slug)

    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`)
    }

    return article
  }

  async getFeaturedArticles(): Promise<Article[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return the first 5 articles as featured
    return mockArticles.slice(0, 5)
  }
}

// Export a singleton instance
export const articleMockService = new ArticleMockService()

