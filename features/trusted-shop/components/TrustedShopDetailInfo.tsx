export default function TrustedShopDetailInfo({
  name = "Shop Name",
  description = "Shop description",
  address = "Shop Address",
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Address: {address}</p>
    </div>
  )
}

