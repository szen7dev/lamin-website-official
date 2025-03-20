'use client';

import type React from 'react';

import { Component, type ErrorInfo } from 'react';

// Thêm các props cho thông báo lỗi tùy chỉnh
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  apiErrorFallback?: React.ReactNode;
  networkErrorFallback?: React.ReactNode;
  authErrorFallback?: React.ReactNode;
}

// Cập nhật state để phân biệt các loại lỗi
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorType: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorType: null,
  };

  // Cập nhật phương thức getDerivedStateFromError để phân loại lỗi
  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    let errorType = 'unknown';

    if (error.name === 'ApiError') {
      errorType = error.code || 'api';
    } else if (
      error.message &&
      (error.message.includes('network') ||
        error.message.includes('Network') ||
        error.message.includes('Failed to fetch'))
    ) {
      errorType = 'network';
    } else if (error.status === 401 || error.status === 403) {
      errorType = 'auth';
    }

    return { hasError: true, error, errorType };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  // Cập nhật phương thức render để hiển thị fallback phù hợp
  render() {
    const { hasError, error, errorType } = this.state;
    const {
      children,
      fallback,
      apiErrorFallback,
      networkErrorFallback,
      authErrorFallback,
    } = this.props;

    if (hasError) {
      // Hiển thị fallback tùy thuộc vào loại lỗi
      if (errorType === 'network' && networkErrorFallback) {
        return networkErrorFallback;
      }

      if (errorType === 'auth' && authErrorFallback) {
        return authErrorFallback;
      }

      if (errorType === 'api' && apiErrorFallback) {
        return apiErrorFallback;
      }

      // Fallback mặc định
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'}
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => window.location.reload()}>
            Làm mới trang
          </button>
        </div>
      );
    }

    return children;
  }
}

export { ErrorBoundary };
