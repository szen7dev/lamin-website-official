"use client"

export default function TrustedShopCard({ name = "Shop Name", address = "Shop Address", image = "/placeholder.jpg" }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{address}</p>
      <p>Shop image: {image}</p>
    </div>
  )
}

