export default function TrustedShopDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div>
      <h1>Trusted Shop: {params.slug}</h1>
      <p>This is the detail page for trusted shop with slug: {params.slug}</p>
    </div>
  )
}

