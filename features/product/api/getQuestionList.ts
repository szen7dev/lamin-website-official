import {
  Question,
  QuestionListParams,
} from '@/features/product/types/questionTypes';
import apiClient from '@/services/api/apiClient';

/**
 * Fetches a list of questions for a specific product
 * @param params - Parameters for fetching questions
 * @returns The list of questions
 */
export const getQuestionList = async (
  params: QuestionListParams,
): Promise<Question[]> => {
  try {
    const queryParams = {
      select: 'name note goods',
      ...(params.slug ? { slug: params.slug } : {}),
      ...(params.goodsId ? { goodsID: params.goodsId } : {}),
      ...(params.limit ? { limit: params.limit } : {}),
      ...(params.page ? { page: params.page } : {}),
      ...(params.cursor ? { cursor: params.cursor } : {}),
    };

    const response = await apiClient.get<Question[]>(
      '/api/medias/question',
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching question list:', error);
    throw error;
  }
};
