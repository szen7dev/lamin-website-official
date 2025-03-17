"use client"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()

  const handleContinue = () => {
    onClose() // Close the modal
    router.push("/auth/login") // Redirect to the login page
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="60" y="40" width="80" height="120" rx="10" fill="#0066FF" />
              <rect x="70" y="50" width="60" height="90" rx="5" fill="white" />
              <circle cx="100" cy="150" r="8" fill="white" />
              <rect x="85" y="70" width="30" height="5" rx="2" fill="#0066FF" />
              <rect x="85" y="85" width="30" height="5" rx="2" fill="#0066FF" />
              <rect x="85" y="100" width="30" height="5" rx="2" fill="#0066FF" />
              <path d="M130 90 L150 110 L140 120" stroke="#0066FF" strokeWidth="5" fill="none" />
              <g transform="translate(50, 90) scale(0.8)">
                <rect x="0" y="0" width="40" height="60" rx="5" fill="#333" />
                <rect x="5" y="5" width="30" height="40" rx="2" fill="#666" />
                <circle cx="20" cy="50" r="5" fill="#666" />
              </g>
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.</p>

        <div className="w-full space-y-3">
          <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={handleContinue}>
            Tiếp tục
          </Button>
          <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50" onClick={onClose}>
            Thoát
          </Button>
        </div>
      </div>
    </Modal>
  )
}

