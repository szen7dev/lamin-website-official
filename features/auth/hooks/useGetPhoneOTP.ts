import { useMutation } from '@tanstack/react-query';

import { getPhoneOTP } from '../api/getPhoneOTP';

import { useToast } from '@/components/ui/use-toast';

interface UseGetPhoneOTPParams {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Hook for sending OTP to user's phone
 * @param params Optional callbacks for success and error
 * @returns Mutation object for sending OTP
 */
export const useGetPhoneOTP = (params?: UseGetPhoneOTPParams) => {
  const { toast } = useToast();
  const { onSuccess, onError } = params || {};

  return useMutation({
    mutationFn: (data: { phone: string; optionSeller: boolean }) =>
      getPhoneOTP(data),
    onSuccess: response => {
      if (response.error) {
        // Show error toast
        toast({
          title: 'Lỗi',
          description:
            response.message ||
            'Không thể gửi mã OTP, hãy kiểm tra lại số điện thoại của bạn',
          variant: 'destructive',
        });

        // Call error callback if provided
        if (onError) onError();
      } else {
        // Show success toast
        toast({
          title: 'Thành công',
          description: 'Đã xác nhận số điện thoại và gửi mã OTP thành công',
          variant: 'default',
        });

        // Call success callback if provided
        if (onSuccess) onSuccess();
      }
    },
    onError: () => {
      // Show error toast
      toast({
        title: 'Lỗi',
        description:
          'Không thể gửi mã OTP, hãy kiểm tra lại số điện thoại của bạn',
        variant: 'destructive',
      });

      // Call error callback if provided
      if (onError) onError();
    },
  });
};
