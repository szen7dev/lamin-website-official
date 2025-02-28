"use server"

import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonical?: string
}

export function useSEO({
  title = "Elena Pharmacy",
  description = "Your trusted health partner",
  keywords = "pharmacy, health, medicine",
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonical = "https://elela.vn",
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: ogType,
    },
    alternates: {
      canonical,
    },
  }
}

