import { Product } from '@/features/product/types/productTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getGoodsInfoBySlug = async (slug: string): Promise<Product> => {
  try {
    const populatesObject = {
      path: 'images userUpdate category company',
      select: 'path size image note fullname name slug',
      populate: { path: 'position', select: 'name' },
    };

    // Ensure the slug is decoded first (in case it's already encoded)
    // and then properly encoded once to handle special characters
    const decodedSlug = decodeURIComponent(slug);

    const queryParams = {
      populates: JSON.stringify(populatesObject),
      slug: decodedSlug, // Use the decoded slug to avoid double encoding
      optionSeller: DEFAULT_OPTION_SELLER || 1,
    };

    const response = await apiClient.get<Product>(
      `/api/item/goods`,
      queryParams,
    );

    return response as Product;
  } catch (error) {
    console.error('Error fetching goods info:', error);
    throw error;
  }
};
