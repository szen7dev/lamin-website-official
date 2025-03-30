import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postSendReview, SendReviewParams } from '../api/postSendReview';

interface UsePostSendReviewOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for sending a review or reply to a product
 * @param options - Optional callbacks for success and error handling
 * @returns Mutation object for sending reviews
 */
export function usePostSendReview(options?: UsePostSendReviewOptions) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SendReviewParams>({
    mutationFn: (params: SendReviewParams) => postSendReview(params),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['productReviews', variables.goodsID, variables.type],
      });

      // Call the onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: error => {
      // Call the onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}
