import type { Metadata } from "next"
import { siteConfig } from "@/config/siteConfig"

interface MetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
}

export function generateMetadata({ title, description, keywords, image }: MetadataProps): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    keywords: keywords || siteConfig.keywords,
    openGraph: {
      images: [image || siteConfig.ogImage],
    },
  }
}

