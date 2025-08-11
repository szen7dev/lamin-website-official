'use client';

import { UserCheck } from 'lucide-react';

interface EmptyStateProps {
  debouncedSearch: string;
  isLoadingContacts: boolean;
}

export function EmptyState({
  debouncedSearch,
  isLoadingContacts,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="p-8 shadow-sm">
        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2 text-lg">
          {!debouncedSearch.trim()
            ? 'Tìm kiếm liên hệ'
            : isLoadingContacts
              ? 'Đang tìm kiếm...'
              : 'Chọn liên hệ'}
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-64 mx-auto">
          {!debouncedSearch.trim()
            ? 'Nhập từ khóa vào ô tìm kiếm phía trên để bắt đầu tìm kiếm liên hệ trong hệ thống'
            : isLoadingContacts
              ? `Đang tìm kiếm thông tin liên hệ cho "${debouncedSearch}"...`
              : 'Chọn một liên hệ từ dropdown kết quả tìm kiếm để xem thông tin chi tiết'}
        </p>
      </div>
    </div>
  );
}
