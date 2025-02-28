// Generate a slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

// Truncate text to a specific length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Get image URL with fallback
export function getImageUrl(path: string | null | undefined, fallback = "/placeholder.jpg"): string {
  if (!path) return fallback
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_ASSET_URL || ""}${path}`
}

