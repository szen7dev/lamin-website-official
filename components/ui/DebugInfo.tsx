'use client';

import { useState, useEffect } from 'react';

import { API_MODE } from '@/config/apiConfig';

export function DebugInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const [apiMode, setApiMode] = useState(API_MODE);

  useEffect(() => {
    // Kiểm tra xem có đang ở môi trường development không
    const isDev = process.env.NODE_ENV === 'development';

    setIsVisible(isDev);

    // Lấy API mode từ localStorage hoặc environment variable
    const storedMode =
      typeof window !== 'undefined' ? localStorage.getItem('API_MODE') : null;

    setApiMode((storedMode as 'mock' | 'real') || API_MODE);
  }, []);

  const toggleApiMode = () => {
    const newMode = apiMode === 'mock' ? 'real' : 'mock';

    setApiMode(newMode);
    localStorage.setItem('API_MODE', newMode);
    window.location.reload(); // Reload để áp d���ng thay đổi
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">Debug Info</span>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setIsVisible(false)}>
          ✕
        </button>
      </div>
      <div className="space-y-1">
        <p>
          Environment: <span className="font-mono">{process.env.NODE_ENV}</span>
        </p>
        <p>
          API Mode:
          <span
            className={`font-mono ml-1 ${apiMode === 'mock' ? 'text-yellow-400' : 'text-green-400'}`}>
            {apiMode.toUpperCase()}
          </span>
          <button
            className="ml-2 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            onClick={toggleApiMode}>
            Toggle
          </button>
        </p>
      </div>
    </div>
  );
}
