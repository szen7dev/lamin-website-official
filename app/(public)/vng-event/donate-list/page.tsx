'use client';
import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
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

const DonateListPage = () => {
  const donationData = Array(20)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      date: '20/07/2025',
      name: 'Nguyễn Văn A',
      address: 'TP.HCM',
      amount: '2.000.000',
      event: 'Hành trình yêu thương',
      note: 'Ủng hộ áo ấm',
    }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(donationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = donationData.slice(startIndex, endIndex);

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
    <section className="container py-6 bg-white rounded-2xl px-0">
      <div className="flex justify-between items-center gap-2 px-4">
        <div className="text-heading-sm font-semibold text-primary">
          Danh Sách Quyên Góp
        </div>
        <div className="text-white relative">
          <Input
            className="rounded-full pr-12 border-grayscale-20 min-w-[500px] h-12"
            placeholder="Tìm kiếm Họ và Tên, ngày, địa chỉ..."
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-primary rounded-full cursor-pointer">
            <SearchIcon size={20} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto my-10">
        <Table>
          <TableHeader className="bg-[#E6EEF6]">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Ngày
              </TableHead>
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
                Sự kiện
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Ghi chú
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Xem chi tiết
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50">
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Nhập ngày" />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Nhập tên" />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Nhập địa chỉ" />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Nhập số tiền" />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Nhập sự kiện" />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input className="w-full text-sm" placeholder="Viết ghi chú" />
              </TableCell>
              <TableCell className="py-2 px-4 text-center">
                <Button className="bg-primary text-white text-sm px-4 py-1 rounded-md">
                  Thêm
                </Button>
              </TableCell>
            </TableRow>

            {currentItems.map(item => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="py-3 px-4 text-sm">{item.date}</TableCell>
                <TableCell className="py-3 px-4 text-sm">{item.name}</TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.address}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.amount}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.event}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">{item.note}</TableCell>
                <TableCell className="py-3 px-4 text-sm text-center">
                  <Button className="text-primary p-0 h-auto" variant="link">
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-center">
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
      </div>
    </section>
  );
};

export default DonateListPage;
