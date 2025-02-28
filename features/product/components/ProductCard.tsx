"use client"

export default function ProductCard({ name = "Product Name", price = "100,000 VND", image = "/placeholder.jpg" }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{price}</p>
      <p>Product image: {image}</p>
    </div>
  )
}

