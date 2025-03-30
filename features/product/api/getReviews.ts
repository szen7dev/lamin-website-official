import {
  ProductReviewParams,
  ProductReview,
} from '@/features/product/types/productTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getCommentsByProductID = async (
  params: ProductReviewParams,
): Promise<ProductReview[]> => {
  try {
    const queryParams = {
      goodsID: params.goodsID,
      populates: params.populates
        ? JSON.stringify(params.populates)
        : JSON.stringify({
            path: 'author lastestReply',
            select: 'author name fullname sign phone rating image content',
            populate: {
              path: 'author lastestReply',
              select:
                'author name fullname sign phone rating image content createAt',
            },
          }),
      rating: params.rating !== undefined ? params.rating : undefined,
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      limit: params.limit || 5,
      type: params.type,
    };

    const { data } = await apiClient.get<ProductReview[]>(
      `/api/medias/comments`,
      queryParams,
    );

    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);

    return [];
  }
};
