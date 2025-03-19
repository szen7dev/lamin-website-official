'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface VerificationMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSelectZalo: () => void;
  onSelectSMS: () => void;
}

export function VerificationMethodModal({
  isOpen,
  onClose,
  phoneNumber,
  onSelectZalo,
  onSelectSMS,
}: VerificationMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
        <div className="absolute right-4 top-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-10 flex flex-col items-center">
          <div className="mb-6 w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <rect
                fill="#0066FF"
                height="140"
                rx="10"
                width="80"
                x="60"
                y="30"
              />
              <rect fill="white" height="100" rx="5" width="60" x="70" y="40" />
              <circle cx="100" cy="155" fill="white" r="8" />
              <rect
                fill="#0066FF"
                height="20"
                rx="2"
                width="30"
                x="85"
                y="60"
              />
              <path d="M85 90 L115 90" stroke="#0066FF" strokeWidth="2" />
              <path d="M85 100 L115 100" stroke="#0066FF" strokeWidth="2" />
              <path d="M85 110 L115 110" stroke="#0066FF" strokeWidth="2" />
              <circle
                cx="130"
                cy="60"
                fill="white"
                r="15"
                stroke="#0066FF"
                strokeWidth="2"
              />
              <path
                d="M125 60 L135 60 M130 55 L130 65"
                stroke="#0066FF"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Mã xác thực được gửi đến số điện thoại
          </h2>
          <p className="font-medium mb-4">{phoneNumber}</p>

          <p className="text-center mb-6">Vui lòng chọn hình thức nhận mã</p>

          <div className="w-full space-y-3">
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={onSelectZalo}>
              Nhận mã qua Zalo
            </Button>

            <Button
              className="w-full text-primary"
              variant="link"
              onClick={onSelectSMS}>
              Nhận mã qua SMS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
