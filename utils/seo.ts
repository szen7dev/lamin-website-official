import { siteConfig } from "@/config/siteConfig"
import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
}

export function generateMetadata({ title, description, keywords, image }: SEOProps): Metadata {
  // Convert keywords array to comma-separated string if it exists
  const keywordsString = keywords ? keywords.join(", ") : undefined

  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    openGraph: {
      images: [image || siteConfig.ogImage],
    },
    // Add keywords to the other property as per Next.js Metadata API
    ...(keywordsString && {
      other: {
        keywords: keywordsString,
      },
    }),
  }
}
