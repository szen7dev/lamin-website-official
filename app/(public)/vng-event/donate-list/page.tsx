'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { formatDate } from 'date-fns';
import Link from 'next/link';

import { useCreateFund } from '@/features/vng-event/hooks/useCreateFund';
import { useGetEventList } from '@/features/vng-event/hooks/useGetEventList';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { PageHeader } from '@/features/vng-event/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { FundUpsertParams } from '@/features/vng-event/types/fund';
import { useGetFundList } from '@/features/vng-event/hooks/useGetFundList';
import { formatNumber } from '@/utils';

const DonateListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, setValue, control } =
    useForm<FundUpsertParams>({
      defaultValues: {
        date: '',
        name: '',
        address: '',
        amount: 0,
        eventID: '',
        note: '',
      },
    });

  const { createFund, isLoading } = useCreateFund();

  const { eventList } = useGetEventList();
  const { fundList } = useGetFundList({ type: 1, keyword: searchTerm });

  const onSubmit = (data: FundUpsertParams) => {
    createFund({
      optionSeller: 1,
      type: 1,
      date: data.date,
      name: data.name,
      address: data.address,
      amount: Number(data.amount),
      eventID: data.eventID,
      note: data.note,
    });
    reset();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((fundList?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = fundList?.slice(startIndex, endIndex);

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
      <PageHeader
        placeholder="Tìm kiếm Họ và Tên, ngày, địa chỉ..."
        title="Danh Sách Quyên Góp"
        onSearch={value => setSearchTerm(value)}
      />

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
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DateInput
                      className="w-full text-sm min-h-9 sm:min-h-0"
                      placeholder="Nhập ngày"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{ required: true }}
                />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input
                  className="w-full text-sm min-h-9 sm:min-h-0"
                  placeholder="Nhập tên"
                  {...register('name', { required: true })}
                />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input
                  className="w-full text-sm min-h-9 sm:min-h-0"
                  placeholder="Nhập địa chỉ"
                  {...register('address', { required: true })}
                />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input
                  className="w-full text-sm min-h-9 sm:min-h-0"
                  placeholder="Nhập số tiền"
                  {...register('amount', { required: true })}
                />
              </TableCell>
              <TableCell className="py-2 px-4">
                <Select onValueChange={value => setValue('eventID', value)}>
                  <SelectTrigger className="w-full text-sm min-h-9 sm:min-h-0">
                    <SelectValue placeholder="Chọn sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventList?.map(event => (
                      <SelectItem key={event._id} value={event._id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-2 px-4">
                <Input
                  className="w-full text-sm min-h-9 sm:min-h-0"
                  placeholder="Viết ghi chú"
                  {...register('note')}
                />
              </TableCell>
              <TableCell className="py-2 px-4 text-center">
                <Button
                  className="bg-primary text-white text-sm px-4 py-1 rounded-md"
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}>
                  {isLoading ? 'Đang thêm...' : 'Thêm'}
                </Button>
              </TableCell>
            </TableRow>

            {currentItems?.map(item => (
              <TableRow key={item._id} className="hover:bg-gray-50">
                <TableCell className="py-3 px-4 text-sm">
                  {item.date
                    ? formatDate(new Date(item.date), 'dd/MM/yyyy')
                    : '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">{item.name}</TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.address}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.amount ? formatNumber(item.amount) : '0'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item?.event?.name || '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm">
                  {item.note || '-'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-center">
                  <Link href={`/vng-event/donate-list/${item._id}`}>
                    <Button className="text-primary p-0 h-auto" variant="link">
                      Xem chi tiết
                    </Button>
                  </Link>
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
