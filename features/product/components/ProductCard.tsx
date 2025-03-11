'use client'

export default function ProductCard({
  id,
  name,
  price,
}: {
  id: string
  name: string
  price: number
}) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>{price}</p>
    </div>
  )
}
