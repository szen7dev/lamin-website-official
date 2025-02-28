export default function ProductDetailInfo({
  name = "Product Name",
  description = "Product description",
  price = "100,000 VND",
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Price: {price}</p>
    </div>
  )
}

