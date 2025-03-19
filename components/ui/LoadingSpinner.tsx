"use client"

// Cập nhật LoadingSpinner để hỗ trợ hiển thị lỗi

// Thêm prop error
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
  error?: string | null
  onRetry?: () => void
}

// Cập nhật component để hiển thị lỗi nếu có
export const LoadingSpinner = ({ size = "md", fullScreen = false, error = null, onRetry }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 z-50"
    : "flex items-center justify-center p-4"

  // Nếu có lỗi, hiển thị thông báo lỗi thay vì spinner
  if (error) {
    return (
      <div className={containerClasses}>
        <div className="text-center max-w-md p-4 rounded-lg bg-background shadow-sm">
          <div className="text-destructive mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    )
  }

  // Hiển thị spinner nếu không có lỗi
  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} rounded-full border-t-transparent border-primary animate-spin`} />
    </div>
  )
}

export default LoadingSpinner

