"use client"

export default function CartItem({ name = "Product Name", price = "100,000 VND", quantity = 1 }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Price: {price}</p>
      <p>Quantity: {quantity}</p>
    </div>
  )
}

