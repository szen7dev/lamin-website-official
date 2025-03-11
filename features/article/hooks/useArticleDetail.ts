<<<<<<< HEAD
'use server'

export async function useArticleDetail(slug: string) {
  // Server action to fetch article detail
  return { id: '1', title: 'Article', content: 'Content' }
=======
"use client"

import { useQuery } from "@tanstack/react-query"
import { articleService } from "../services/articleServiceFactory"

export function useArticleDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => articleService.getArticleBySlug(slug as string),
    enabled: !!slug,
  })
>>>>>>> 0ad2be227c52fae9a0bc42a12f5f2c1f1ba86480
}
