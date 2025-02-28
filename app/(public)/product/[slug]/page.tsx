export default function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div>
      <h1>Product: {params.slug}</h1>
      <p>This is the detail page for product with slug: {params.slug}</p>
    </div>
  )
}

