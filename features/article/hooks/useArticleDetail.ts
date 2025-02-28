"use server"

export async function useArticleDetail(slug: string) {
  // Example server action for article detail
  return {
    title: `Article ${slug}`,
    content: "Article content",
    author: "Author Name",
    publishDate: "2023-01-01",
  }
}

