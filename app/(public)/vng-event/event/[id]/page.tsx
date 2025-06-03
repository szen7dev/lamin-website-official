'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useGetFundList } from '@/features/vng-event/hooks/useGetFundList';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatNumber } from '@/utils';
import { Button } from '@/components/ui/button';

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { fundList } = useGetFundList({
    eventID: (params.id as string) || undefined,
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil((fundList?.length || 0) / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="mt-6 mb-4 overflow-x-auto min-h-[200px] sm:min-h-0 bg-white rounded-2xl border border-grayscale-10">
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-heading-sm font-semibold text-primary mb-4 pt-4">
            Danh Sách Thu Chi Sự Kiện
          </h3>
          <div className="pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <p className="font-semibold text-body-base uppercase">
              HÀNH TRÌNH YÊU THƯƠNG: CÙNG NHAU GIEO MẦM TRI THỨC CHO TRẺ EM VÙNG
              CAO TÂY BẮC
            </p>
          </div>
        </div>
        <Button
          className="border-primary text-primary"
          variant="outline"
          onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-[#E6EEF6]">
          <TableRow>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
              Họ và tên
            </TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
              Địa chỉ
            </TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
              Số tiền quyên góp
            </TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
              Số tiền chi tiêu
            </TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
              Ghi chú
            </TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b text-center">
              Xem chi tiết
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fundList && fundList.length > 0 ? (
            fundList.map(item => (
              <TableRow key={item._id} className="hover:bg-gray-50">
                <TableCell className="py-3 px-4 text-sm">
                  {item.name || '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.address || '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.type === 1 && item.amount
                    ? formatNumber(item.amount)
                    : '0'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.type === 2 && item.amount
                    ? formatNumber(item.amount)
                    : '0'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.note || '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-center">
                  <Button className="text-primary p-0 h-auto" variant="link">
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center py-4" colSpan={6}>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {fundList && fundList.length > 0 && (
        <div className="my-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => {
                if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(Number(page))}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
