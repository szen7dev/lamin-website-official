import { useMutation } from '@tanstack/react-query';

import { checkUserExists } from '../api/checkUserExists';

import { useToast } from '@/hooks/use-toast';

interface UseCheckUserExistsParams {
  onUserExists?: () => void;
  onUserNotExists?: () => void;
}

/**
 * Hook to check if a user exists using React Query
 * @param params Optional callbacks for user exists/not exists scenarios
 * @returns Mutation object with mutate function to check user existence
 */
export const useCheckUserExists = ({
  onUserExists,
  onUserNotExists,
}: UseCheckUserExistsParams = {}) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phone: string) => {
      return await checkUserExists({ phone });
    },
    onSuccess: data => {
      if (data.exists) {
        // User exists - no longer showing auto-login toast
        // Just call the callback to proceed to OTP verification
        if (onUserExists) {
          onUserExists();
        }
      } else {
        // User does not exist
        if (onUserNotExists) {
          onUserNotExists();
        }
      }
    },
    onError: error => {
      console.error('Error checking user existence:', error);
      toast({
        title: 'Lỗi',
        description:
          'Đã xảy ra lỗi khi kiểm tra tài khoản. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    },
  });
};
