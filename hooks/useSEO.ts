import type { Metadata } from 'next'
import { siteConfig } from '@/config/siteConfig'

interface UseSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
}

export function useSEO({ title, description, keywords, image }: UseSEOProps): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    keywords: keywords || siteConfig.keywords,
    openGraph: {
      images: [image || siteConfig.ogImage],
    },
  }
}
