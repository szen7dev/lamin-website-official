"use server"

export async function useProductDetail(slug: string) {
  // Example server action for product detail
  return {
    name: `Product ${slug}`,
    description: "Product description",
    price: "100,000 VND",
    images: ["/placeholder1.jpg", "/placeholder2.jpg"],
  }
}

