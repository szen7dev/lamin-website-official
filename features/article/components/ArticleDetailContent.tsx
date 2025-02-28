export default function ArticleDetailContent({
  title = "Article Title",
  content = "Article content",
  author = "Author Name",
}) {
  return (
    <div>
      <h2>{title}</h2>
      <p>By {author}</p>
      <div>{content}</div>
    </div>
  )
}

