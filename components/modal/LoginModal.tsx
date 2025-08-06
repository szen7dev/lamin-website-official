'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';

interface LoginModalProps {
  isOpen: boolean;
  content?: string;
  onClose: () => void;
  onLoginForSeller?: () => void;
}

export function LoginModal({
  isOpen,
  content,
  onClose,
  onLoginForSeller,
}: LoginModalProps) {
  const router = useRouter();

  const handleContinue = () => {
    onClose(); // Close the modal
    router.push('/auth/login'); // Redirect to the login page
  };

  return (
    <Modal className="max-w-md p-6" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <rect
                fill="#0066FF"
                height="120"
                rx="10"
                width="80"
                x="60"
                y="40"
              />
              <rect fill="white" height="90" rx="5" width="60" x="70" y="50" />
              <circle cx="100" cy="150" fill="white" r="8" />
              <rect fill="#0066FF" height="5" rx="2" width="30" x="85" y="70" />
              <rect fill="#0066FF" height="5" rx="2" width="30" x="85" y="85" />
              <rect
                fill="#0066FF"
                height="5"
                rx="2"
                width="30"
                x="85"
                y="100"
              />
              <path
                d="M130 90 L150 110 L140 120"
                fill="none"
                stroke="#0066FF"
                strokeWidth="5"
              />
              <g transform="translate(50, 90) scale(0.8)">
                <rect fill="#333" height="60" rx="5" width="40" x="0" y="0" />
                <rect fill="#666" height="40" rx="2" width="30" x="5" y="5" />
                <circle cx="20" cy="50" fill="#666" r="5" />
              </g>
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-gray-600 mb-6">
          {content ||
            'Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.'}
        </p>

        <div className="w-full space-y-3">
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleContinue}>
            Tiếp tục
          </Button>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <Button
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            variant="outline"
            onClick={onLoginForSeller}>
            Đăng nhập với tư cách nhà bán hàng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
