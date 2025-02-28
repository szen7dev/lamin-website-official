"use server"

export async function useTrustedShopDetail(slug: string) {
  // Example server action for trusted shop detail
  return {
    name: `Shop ${slug}`,
    description: "Shop description",
    address: "Shop Address",
    rating: 4.5,
  }
}

