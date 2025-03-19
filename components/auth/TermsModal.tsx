'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-medium">Thông tin</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 mb-4">
            Nội dung Điều khoản dịch vụ (sẽ bổ sung nội dung chi tiết sau)
          </p>

          <div className="flex items-start space-x-2 mb-6">
            <input
              checked={accepted}
              className="mt-1 h-4 w-4 rounded border-gray-300"
              id="terms"
              type="checkbox"
              onChange={e => setAccepted(e.target.checked)}
            />
            <label className="text-sm" htmlFor="terms">
              Tôi đồng ý với điều khoản dịch vụ, chính sách thu thập và xử lý dữ
              liệu cá nhân của Elela
            </label>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            className={`w-full py-2 rounded-md text-center ${
              !accepted ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white'
            }`}
            disabled={!accepted}
            onClick={onAccept}>
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
