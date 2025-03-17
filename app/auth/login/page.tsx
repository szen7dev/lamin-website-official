"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { TermsModal } from "@/components/auth/TermsModal"
import { VerificationMethodModal } from "@/components/auth/VerificationMethodModal"
import { OTPVerification } from "@/components/auth/OTPVerification"
import { authService } from "@/services/auth/authService"

enum LoginStep {
  PHONE_INPUT = 0,
  TERMS_AGREEMENT = 1,
  VERIFICATION_METHOD = 2,
  OTP_VERIFICATION = 3,
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.PHONE_INPUT)
  const router = useRouter()

  const validatePhoneNumber = (phone: string) => {
    // Vietnamese phone number validation
    // Formats: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx (where x is a digit)
    // Length: 10 digits (excluding country code)
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Số điện thoại không hợp lệ. Vui lòng thử lại")
      return
    }

    // Clear error if validation passes
    setError("")

    // Move to terms agreement step
    setCurrentStep(LoginStep.TERMS_AGREEMENT)
  }

  const handleTermsAccept = () => {
    setCurrentStep(LoginStep.VERIFICATION_METHOD)
  }

  const handleVerificationMethod = async (method: "zalo" | "sms") => {
    setIsLoading(true)

    try {
      // Call the appropriate service method
      const response =
        method === "zalo" ? await authService.loginWithZalo(phoneNumber) : await authService.loginWithSMS(phoneNumber)

      if (response.success) {
        setCurrentStep(LoginStep.OTP_VERIFICATION)
      } else {
        setError(response.message || "Có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true)

    try {
      const response = await authService.verifyOTP(phoneNumber, otp)

      if (response.success) {
        // In a real app, you would store the token and user data
        // localStorage.setItem('token', response.data.token)

        // Redirect to home or dashboard after successful verification
        router.push("/")
      } else {
        setError(response.message || "Mã OTP không đúng. Vui lòng thử lại.")
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      const response = await authService.sendOTP(phoneNumber)

      if (!response.success) {
        setError(response.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.")
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
    // Clear error when user starts typing again
    if (error) setError("")
  }

  const resetToPhoneInput = () => {
    setCurrentStep(LoginStep.PHONE_INPUT)
    setError("")
  }

  // Render different steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case LoginStep.PHONE_INPUT:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="flex justify-center mb-10">
                <div className="flex flex-col items-center">
                  <Image
                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/fd3ef04e572c6436a8580539e7555fd0.jpg"
                    alt="FPT Retail"
                    width={60}
                    height={60}
                    className="h-14 w-auto mb-2"
                  />
                  <div className="text-center">
                    <div className="text-sm font-medium text-primary">NHÀ THUỐC</div>
                    <div className="text-xl font-bold text-primary leading-tight">LONG CHÂU</div>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-xl font-semibold text-center mb-6">Vui lòng nhập số điện thoại</h1>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="tel"
                      placeholder="Số điện thoại *"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className={`w-full p-3 border rounded-md ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                      required
                      disabled={isLoading}
                    />

                    {error && (
                      <div className="flex items-center mt-2 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                      onClick={() => router.push("/")}
                      disabled={isLoading}
                    >
                      Thoát
                    </Button>

                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Tiếp tục"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )

      case LoginStep.OTP_VERIFICATION:
        return (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleOTPVerify}
            onResend={handleResendOTP}
            onCancel={resetToPhoneInput}
            onZaloVerification={() => handleVerificationMethod("zalo")}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderStep()}

      <TermsModal
        isOpen={currentStep === LoginStep.TERMS_AGREEMENT}
        onClose={resetToPhoneInput}
        onAccept={handleTermsAccept}
      />

      <VerificationMethodModal
        isOpen={currentStep === LoginStep.VERIFICATION_METHOD}
        onClose={resetToPhoneInput}
        phoneNumber={phoneNumber}
        onSelectZalo={() => handleVerificationMethod("zalo")}
        onSelectSMS={() => handleVerificationMethod("sms")}
      />
    </>
  )
}

