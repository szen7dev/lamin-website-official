'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDoubleDown, ChevronNoArrowIcon } from '@/components/icons';
import { useAuth } from '@/hooks';
import { useGetHeightHistory } from '@/features/height-measurement/hooks';
import { formatDate } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HeightMeasureHistoryPage() {
  const { user } = useAuth();
  const [visibleItems, setVisibleItems] = useState(5);

  const {
    data: historyList = [],
    isLoading,
    isError,
    error,
  } = useGetHeightHistory({
    phone: user?.phone || '',
    limit: 5,
  });

  const handleShowMore = () => {
    setVisibleItems(prevCount => prevCount + 5);
  };

  // Format history data for display
  const formattedHistory =
    historyList?.map(item => ({
      id: item._id,
      date: formatDate(item.createAt),
      name: item.name || user?.fullname || '',
      gender: item.gender === 1 ? 'Nam' : 'Nữ',
      birthday: formatDate(item.birthday),
      height: `${item.height} cm`,
      weight: `${item.weight} kg`,
      desiredHeight: `${item.desiredHeight} cm`,
      phone: item.phone,
      note: item.note || 'Đo chiều cao từ website',
    })) || [];

  // Loading skeleton component
  const TableSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              {Array(9)
                .fill(0)
                .map((_, index) => (
                  <TableHead
                    key={index}
                    className="text-white font-medium text-center">
                    <Skeleton className="h-6 w-20 bg-primary-400/30 mx-auto" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(9)
                    .fill(0)
                    .map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="text-center border-r">
                        <Skeleton className="h-5 w-16 mx-auto" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="text-lg font-semibold text-grayscale-90 mb-2">
        Lịch sử đo cao
      </div>
      <div className="text-sm text-grayscale-40 font-normal mb-6">
        Dựa vào thông tin được cung cấp, bạn có thể xem lại lịch sử
      </div>

      {/* Loading state */}
      {isLoading && <TableSkeleton />}

      {/* Error state */}
      {isError && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Đã xảy ra lỗi khi tải lịch sử đo cao. Vui lòng thử lại sau.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!isLoading && !isError && formattedHistory.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Không có lịch sử đo cao
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bạn chưa có lịch sử đo cao nào. Vui lòng thực hiện đo cao để xem
            lịch sử.
          </p>
        </div>
      )}

      {/* Data table */}
      {!isLoading && !isError && formattedHistory.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-white font-medium text-center">
                    Ngày đo
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Họ và tên
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Giới tính
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Ngày sinh
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Chiều cao (cm)
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Cân nặng (kg)
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Chiều cao mong muốn
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Liên hệ
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Ghi chú
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedHistory.slice(0, visibleItems).map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="text-center border-r">
                      {item.date}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.gender}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.birthday}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.height}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.weight}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.desiredHeight}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.phone}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div>{item.note}</div>
                        <Link
                          className="text-primary text-sm flex items-center hover:underline"
                          href={`/tai-khoan/lich-su-do-cao/${item.id}?name=${encodeURIComponent(item.name)}`}>
                          Xem chi tiết{' '}
                          <ChevronNoArrowIcon className="w-4 h-3" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {visibleItems < formattedHistory.length && (
            <div className="flex justify-center py-4 border-t bg-background">
              <Button
                className="flex items-center gap-1 hover:bg-inherit hover:text-primary"
                variant="ghost"
                onClick={handleShowMore}>
                <ChevronDoubleDown className="h-4 w-4" fill="currentColor" />{' '}
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
