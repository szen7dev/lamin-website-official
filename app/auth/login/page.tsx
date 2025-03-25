'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { useCheckUserExists } from '@/features/auth/hooks/useCheckUserExists';
import { useGetPhoneOTP } from '@/features/auth/hooks/useGetPhoneOTP';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TermsModal } from '@/components/auth/TermsModal';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

enum LoginStep {
  PHONE_INPUT = 0,
  TERMS_AGREEMENT = 1,
  OTP_VERIFICATION = 2,
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<LoginStep>(
    LoginStep.PHONE_INPUT,
  );
  // Store the OTP response data
  const [otpData, setOtpData] = useState<string>('');

  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  // Initialize the get phone OTP mutation
  const getPhoneOTPMutation = useGetPhoneOTP({
    onSuccess: otp => {
      // Store the OTP string
      setOtpData(otp);

      setIsLoading(false);
      setCurrentStep(LoginStep.OTP_VERIFICATION);
    },
    onError: () => {
      setIsLoading(false);
      // Error toast is handled by the hook
    },
  });

  // Initialize the check user exists mutation
  const checkUserExistsMutation = useCheckUserExists({
    onUserExists: () => {
      // User exists, skip terms and go straight to OTP verification
      setIsLoading(true);

      // Get OTP for existing user
      getPhoneOTPMutation.mutate({
        phone: phoneNumber,
        optionSeller: false,
      });
    },
    onUserNotExists: () => {
      // User doesn't exist, move to terms agreement step
      setCurrentStep(LoginStep.TERMS_AGREEMENT);

      // Reset loading state
      setIsLoading(false);
    },
  });

  const validatePhoneNumber = (phone: string) => {
    // Vietnamese phone number validation
    // Formats: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx (where x is a digit)
    // Length: 10 digits (excluding country code)
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Số điện thoại không hợp lệ. Vui lòng thử lại');

      return;
    }

    // Clear error if validation passes
    setError('');
    setIsLoading(true);

    try {
      // Check if user exists - this will trigger onUserExists or onUserNotExists
      checkUserExistsMutation.mutate(phoneNumber);
    } catch (error) {
      // Handle error silently but set error message for user
      console.error('Error checking if user exists:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  const handleTermsAccept = () => {
    // Terms accepted, now send OTP and move to OTP verification
    setIsLoading(true);
    getPhoneOTPMutation.mutate({
      phone: phoneNumber,
      optionSeller: false,
    });
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);

    try {
      // Check if we have stored OTP data to compare with
      if (otpData && otp === otpData) {
        // Show intermediate success message
        toast({
          title: 'Xác thực thành công',
          description: 'Mã OTP khớp với mã đã gửi. Đang đăng nhập...',
        });

        // Use AuthContext to login with OTP
        const response = await auth.loginWithOTP(phoneNumber, otp);

        if (response.success) {
          // Login successful, redirect to home or dashboard page
          toast({
            title: 'Đăng nhập thành công',
            description: 'Bạn đã đăng nhập thành công vào hệ thống',
          });

          router.push('/');
        } else {
          // Login failed, show error message
          setError(
            response.message || 'Đăng nhập không thành công. Vui lòng thử lại.',
          );
          setIsLoading(false);
        }
      } else {
        // OTP doesn't match
        setError('Mã OTP không đúng. Vui lòng thử lại.');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    getPhoneOTPMutation.mutate({
      phone: phoneNumber,
      optionSeller: false,
    });
  };

  const resetToPhoneInput = () => {
    setCurrentStep(LoginStep.PHONE_INPUT);
    setError('');
    setOtpData(''); // Clear stored OTP data
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case LoginStep.PHONE_INPUT:
        return (
          <div className="w-full max-w-md space-y-3 p-8 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Image
                  alt="Logo"
                  className="w-auto"
                  height={80}
                  src="/images/Lamin_Logo_Colored.png"
                  width={80}
                />
                <div className="text-left font-extrabold text-[#034EA2]">
                  <div className="text-sm">NHÀ THUỐC</div>
                  <div className="text-xl leading-tight">LAMIN</div>
                </div>
              </div>

              <h2 className="mt-6 text-center text-xl font-semibold tracking-tight text-gray-900">
                Vui lòng nhập số điện thoại
              </h2>
            </div>

            <form className="space-y-6" onSubmit={handlePhoneSubmit}>
              <div>
                <div className="mt-1">
                  <Input
                    required
                    aria-label="Số điện thoại"
                    autoComplete="tel"
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-transparent"
                    id="phone"
                    name="phone"
                    placeholder="Số điện thoại *"
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle
                        aria-hidden="true"
                        className="h-5 w-5 text-[#FF0000]"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-[#FF0000]">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button
                  className="w-[120px] rounded-full bg-primary-5 text-primary hover:text-white"
                  variant="default"
                  onClick={() => (window.location.href = '/')}>
                  Thoát
                </Button>
                <Button
                  className="w-[120px] rounded-full bg-primary text-white"
                  disabled={isLoading}
                  type="submit"
                  variant="default">
                  {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                </Button>
              </div>
            </form>
          </div>
        );

      case LoginStep.OTP_VERIFICATION:
        return (
          <OTPVerification
            phoneNumber={phoneNumber}
            onCancel={resetToPhoneInput}
            onResend={handleResendOTP}
            onVerify={handleOTPVerify}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {renderStep()}

      <TermsModal
        isOpen={currentStep === LoginStep.TERMS_AGREEMENT}
        phone={phoneNumber}
        onAccept={handleTermsAccept}
        onClose={resetToPhoneInput}
      />
    </div>
  );
}
