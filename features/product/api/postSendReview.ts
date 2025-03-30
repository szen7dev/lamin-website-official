import { apiClient } from '@/services';
import { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export interface SendReviewParams {
  optionSeller?: string;
  goodsID: string;
  parentID?: string; // Optional parameter for replies
  content: string;
  rating?: number; // Optional parameter for initial reviews
  type?: number;
}

/**
 * Send a review or reply to a product
 * @param params - The review parameters
 * @returns The response with the created review data
 */
export async function postSendReview(params: SendReviewParams): Promise<any> {
  try {
    // Ensure rating is a valid number or undefined
    let validRating = undefined;

    if (params.rating !== undefined) {
      const ratingNum = Number(params.rating);

      if (!Number.isNaN(ratingNum)) {
        validRating = Math.min(Math.max(Math.round(ratingNum), 1), 5);
      }
    }

    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER || 1,
      goodsID: params.goodsID,
      parentID: params.parentID || undefined,
      content: params.content,
      rating: validRating,
      type: params.type,
    };

    const response = await apiClient.post<any>(
      `/api/medias/comments`,
      queryParams,
    );

    return response;
  } catch (error) {
    throw error;
  }
}
