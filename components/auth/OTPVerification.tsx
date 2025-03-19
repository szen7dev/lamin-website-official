'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onCancel: () => void;
  onZaloVerification: () => void;
}

export function OTPVerification({
  phoneNumber,
  onVerify,
  onResend,
  onCancel,
  onZaloVerification,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(290); // 4 minutes 50 seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const router = useRouter();

  // Format phone number for display
  const formattedPhone = phoneNumber.replace(
    /(\d{4})(\d{3})(\d{3})/,
    '$1 $2 $3',
  );

  // Handle countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Format countdown time
  const formatCountdown = () => {
    if (countdown <= 0) return '';
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return `(${seconds})`;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // Only allow one digit
    if (value.length > 1) return;

    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    // Update OTP array
    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user types
    if (error) setError('');

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('') === '111111') {
      onVerify(newOtp.join(''));
    } else if (
      newOtp.every(digit => digit !== '') &&
      newOtp.join('') === '000000'
    ) {
      setError('Xác thực không thành công: 0123456789, Mã OTP không đúng');
    }
  };

  // Handle key down events
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle input focus
  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only allow digits
    if (!/^\d+$/.test(pastedData)) return;

    // Fill OTP inputs with pasted data
    const newOtp = [...otp];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');

    if (nextEmptyIndex !== -1) {
      setActiveInput(nextEmptyIndex);
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      setActiveInput(5);
      inputRefs.current[5]?.focus();
    }

    // Check if all inputs are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('') === '111111') {
      onVerify(newOtp.join(''));
    } else if (
      newOtp.every(digit => digit !== '') &&
      newOtp.join('') === '000000'
    ) {
      setError('Xác thực không thành công: 0123456789, Mã OTP không đúng');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-col items-center">
            <Image
              alt="FPT Retail"
              className="h-14 w-auto mb-2"
              height={60}
              src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
              width={60}
            />
            <div className="text-center">
              <div className="text-sm font-medium text-primary">NHÀ THUỐC</div>
              <div className="text-xl font-bold text-primary leading-tight">
                LONG CHÂU
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold text-center mb-2">
            Nhập mã xác thực
          </h1>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Mã xác thực được gửi đến số điện thoại
            </p>
            <p className="font-medium">
              {formattedPhone} có hiệu lực trong 4 phút 50 giây
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <div key={index} className="w-12 h-12">
                <input
                  ref={el => (inputRefs.current[index] = el)}
                  className={`w-full h-full text-center text-xl font-semibold rounded-full border-2 focus:outline-none ${
                    error
                      ? 'border-red-500 text-red-500'
                      : digit
                        ? 'border-blue-500 text-blue-500'
                        : 'border-gray-300'
                  }`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={digit}
                  onChange={e => handleChange(e, index)}
                  onFocus={() => handleFocus(index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center mb-4 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Resend Options */}
          <div className="text-center mb-6">
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={onResend}>
              Gửi lại mã OTP cho tôi {formatCountdown()}
            </button>

            <div className="mt-2 text-sm">
              Hoặc có thể{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={onZaloVerification}>
                nhận mã qua Zalo
              </button>
            </div>
          </div>

          {/* Exit Button */}
          <div className="flex justify-center">
            <button
              className="px-10 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              onClick={onCancel}>
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
