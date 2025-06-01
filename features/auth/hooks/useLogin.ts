import { useMutation } from '@tanstack/react-query';

import { login, type LoginParams, type LoginResponse } from '../api/login';

import { useToast } from '@/hooks/use-toast';

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
  const { onSuccess, onError } = params || {};

  return useMutation({
    mutationFn: (data: LoginParams) => login(data),
    onSuccess: response => {
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
        // Show success toast
        toast({
          title: 'Đăng nhập thành công',
          description: 'Bạn đã đăng nhập thành công vào hệ thống',
          variant: 'default',
        });

        // Call success callback if provided with the response data
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
