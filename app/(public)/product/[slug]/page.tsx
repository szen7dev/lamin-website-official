export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <div>Product Detail Page: {params.slug}</div>
}

