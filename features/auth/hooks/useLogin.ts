import { useMutation } from '@tanstack/react-query';

import { login, type LoginParams, type LoginResponse } from '../api/login';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UseLoginParams {
  onSuccess?: (data: LoginResponse) => void;
  onError?: () => void;
}

/**
 * Hook for logging in using email/password or phone/OTP
 * @param params Optional callbacks for success and error
 * @returns Mutation object for login
 */
export const useLogin = (params?: UseLoginParams) => {
  const { toast } = useToast();
  const { setAuthUser } = useAuth();
  const { onSuccess, onError } = params || {};

  return useMutation({
    mutationFn: (data: LoginParams) => login(data),
    onSuccess: async response => {
      if (!response.success) {
        // Show error toast
        toast({
          title: 'Lỗi',
          description:
            response.message || 'Đăng nhập không thành công. Vui lòng thử lại.',
          variant: 'destructive',
        });

        // Call error callback if provided
        if (onError) onError();
      } else {
        if (response.token && response.user && response.user.contacts) {
          const userData = {
            ...response.user,
            id: response.user.contacts[0]._id || '',
            _id: response.user._id || '',
          };

          setAuthUser(userData, response.token);
        }

        // Show success toast
        toast({
          title: 'Đăng nhập thành công',
          description: 'Bạn đã đăng nhập thành công vào hệ thống',
          variant: 'default',
        });

        if (onSuccess) onSuccess(response);
      }
    },
    onError: error => {
      // Show error toast
      toast({
        title: 'Lỗi',
        description:
          error instanceof Error
            ? error.message
            : 'Đăng nhập không thành công. Vui lòng thử lại.',
        variant: 'destructive',
      });

      // Call error callback if provided
      if (onError) onError();
    },
  });
};
