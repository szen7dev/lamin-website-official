export default function BlogArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div>
      <h1>Blog Article: {params.slug}</h1>
      <p>This is the detail page for blog article with slug: {params.slug}</p>
    </div>
  )
}

