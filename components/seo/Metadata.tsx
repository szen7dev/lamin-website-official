import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: "article" | "website" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other"
  canonical?: string
}

export function generateMetadata({
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

