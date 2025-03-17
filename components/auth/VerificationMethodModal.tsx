"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VerificationMethodModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  onSelectZalo: () => void
  onSelectSMS: () => void
}

export function VerificationMethodModal({
  isOpen,
  onClose,
  phoneNumber,
  onSelectZalo,
  onSelectSMS,
}: VerificationMethodModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
        <div className="absolute right-4 top-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-10 flex flex-col items-center">
          <div className="mb-6 w-32 h-32">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="60" y="30" width="80" height="140" rx="10" fill="#0066FF" />
              <rect x="70" y="40" width="60" height="100" rx="5" fill="white" />
              <circle cx="100" cy="155" r="8" fill="white" />
              <rect x="85" y="60" width="30" height="20" rx="2" fill="#0066FF" />
              <path d="M85 90 L115 90" stroke="#0066FF" strokeWidth="2" />
              <path d="M85 100 L115 100" stroke="#0066FF" strokeWidth="2" />
              <path d="M85 110 L115 110" stroke="#0066FF" strokeWidth="2" />
              <circle cx="130" cy="60" r="15" fill="white" stroke="#0066FF" strokeWidth="2" />
              <path d="M125 60 L135 60 M130 55 L130 65" stroke="#0066FF" strokeWidth="2" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold mb-2">Mã xác thực được gửi đến số điện thoại</h2>
          <p className="font-medium mb-4">{phoneNumber}</p>

          <p className="text-center mb-6">Vui lòng chọn hình thức nhận mã</p>

          <div className="w-full space-y-3">
            <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={onSelectZalo}>
              Nhận mã qua Zalo
            </Button>

            <Button variant="link" className="w-full text-primary" onClick={onSelectSMS}>
              Nhận mã qua SMS
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

