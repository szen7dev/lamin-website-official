import api from "./api"

export const articleService = {
  getArticles: async (params?: any) => {
    const response = await api.get("/articles", { params })
    return response.data
  },
  getArticleBySlug: async (slug: string) => {
    const response = await api.get(`/articles/${slug}`)
    return response.data
  },
  getArticleCategories: async () => {
    const response = await api.get("/article-categories")
    return response.data
  },
}

