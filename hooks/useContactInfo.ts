import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { configService } from '@/services/item/configService';

export function useContactInfo() {
  // Thêm state để theo dõi lỗi UI
  const [uiError, setUiError] = useState<string | null>(null);

  // Sử dụng React Query với xử lý lỗi tốt hơn
  const query = useQuery({
    queryKey: ['contactInfo'],
    queryFn: () => configService.getContactInfo(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Sử dụng useEffect để theo dõi thay đổi trong query.error
  useEffect(() => {
    if (query.error) {
      console.error('Error fetching contact info:', query.error);

      // Thiết lập thông báo lỗi thân thiện với người dùng
      const error = query.error as any;

      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR') {
        setUiError(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
        );
      } else if (error.code === 'SERVER_ERROR') {
        setUiError('Máy chủ đang gặp sự cố. Vui lòng thử lại sau.');
      } else {
        setUiError(
          'Đã xảy ra lỗi khi tải thông tin liên hệ. Vui lòng làm mới trang.',
        );
      }
    }
  }, [query.error]);

  // Xóa lỗi UI khi dữ liệu được tải thành công
  useEffect(() => {
    if (query.data) {
      setUiError(null);
    }
  }, [query.data]);

  // Trả về cả dữ liệu và thông báo lỗi UI
  return {
    ...query,
    contactInfo: query.data,
    uiError,
  };
}
