"use client"

export default function ArticleCard({
  title = "Article Title",
  excerpt = "Article excerpt",
  image = "/placeholder.jpg",
}) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <p>Article image: {image}</p>
    </div>
  )
}

