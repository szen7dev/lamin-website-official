'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import fileDownload from 'js-file-download';
import * as XLSX from 'xlsx';

Chart.register(ChartDataLabels);

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronDoubleDown,
  ChevronNoArrowIcon,
  DownloadIcon,
  SearchIcon,
} from '@/components/icons';
import { useAuth } from '@/hooks';
import {
  useGetHeightHistory,
  useGetExcelMeasurement,
} from '@/features/height-measurement/hooks';
import { debounce, formatDate, getMineTypeExcel } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import CreateHeightMeasurementCustomerModal from '@/components/modal/CreateHeightMeasurementCustomerModal';
import { usePostImportHabitTrack } from '@/features/height-measurement/hooks/usePostImportHabbitTrack';
import { useToast } from '@/hooks/use-toast';
import { validateExcelData } from '@/features/height-measurement/validates/validateExcel';

export default function HeightMeasureHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileImportRef = useRef<HTMLInputElement>(null);
  const [visibleItems, setVisibleItems] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showImportErrors, setShowImportErrors] = useState(false);

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setSearchTerm(val);
    }, 500),
    [],
  );

  // MUTATE
  const { mutate: getExcelMeasurement, isPending: isPendingDowloadExcel } =
    useGetExcelMeasurement();
  const { mutate: postImportHabitTrack, isPending: isPendingImport } =
    usePostImportHabitTrack();

  // QUERY
  const {
    data: historyList = [],
    isLoading,
    isError,
    error,
  } = useGetHeightHistory({
    limit: 100,
    keyword: searchTerm,
  });

  const handleShowMore = () => {
    setVisibleItems(prevCount => prevCount + 5);
  };

  const handleImportClick = () => {
    if (fileImportRef.current) {
      fileImportRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImportErrors([]);
    setShowImportErrors(false);

    const allowTypes = [
      // Standard Excel formats
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls

      // Excel with macros
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.macroenabled.12', // .xlsm
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12', // .xlsb

      // Generic types sometimes used
      'application/octet-stream', // Generic binary type sometimes used for Excel files
    ];

    if (!allowTypes.includes(file.type)) {
      toast({
        title: 'Lỗi định dạng file',
        variant: 'destructive',
        description: 'Vui lòng chọn file Excel (.xls, .xlsx hoặc .xlsm).',
      });
      event.target.value = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet || !worksheet['!ref']) {
          toast({
            title: 'Sheet rỗng',
            description: 'File Excel không chứa dữ liệu.',
            variant: 'destructive',
          });
          event.target.value = '';

          return;
        }

        const range = XLSX.utils.decode_range(worksheet['!ref']!);

        // Extract row data while preserving raw values
        const rows: any[][] = [];

        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row: any[] = [];

          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            // Use raw value (v) to preserve dates as numbers

            row.push(cell ? cell.v : null);
          }
          rows.push(row);
        }

        const titleRow = rows[0];
        const headerRow = rows[1];

        const headerKeys = headerRow.map((_, idx) => {
          if (idx === 0) return titleRow[0] || 'FORM ĐO CAO';

          return `EMPTY${idx === 1 ? '' : `_${idx - 1}`}`;
        });

        const finalResult = [];

        const headerObject: any = {};

        headerKeys.forEach((key, idx) => {
          headerObject[key] = headerRow[idx];
        });
        finalResult.push(headerObject);

        const dataRows = rows
          .slice(2)
          .filter(row => row.some(cell => cell !== null && cell !== ''));

        dataRows.forEach(row => {
          const dataObject: any = {};

          headerKeys.forEach((key, idx) => {
            dataObject[key] = row[idx] !== undefined ? row[idx] : null;
          });
          finalResult.push(dataObject);
        });

        const jsonString = JSON.stringify(finalResult);

        // validate the JSON structure
        const validationErrors = validateExcelData(finalResult);

        if (validationErrors.length > 0) {
          setImportErrors(validationErrors);
          setShowImportErrors(true);
          toast({
            title: 'Lỗi dữ liệu',
            variant: 'destructive',
            description: 'File Excel không hợp lệ. Vui lòng kiểm tra lại.',
          });
          event.target.value = '';

          return;
        }

        postImportHabitTrack(jsonString, {
          onSuccess: () => {
            toast({
              title: 'Import thành công',
              description: 'Dữ liệu đã được nhập thành công.',
              variant: 'success',
            });
            event.target.value = '';
          },
          onError: error => {
            console.error('Import error:', error);
            toast({
              title: 'Lỗi khi import dữ liệu',
              variant: 'destructive',
              description:
                error instanceof Error
                  ? error.message
                  : 'Đã xảy ra lỗi không xác định.',
            });
            event.target.value = '';
          },
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast({
          title: 'Lỗi xử lý file',
          description: 'Không thể đọc nội dung file Excel.',
          variant: 'destructive',
        });
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Không thể đọc file',
        variant: 'destructive',
      });
      event.target.value = '';
    };

    reader.readAsBinaryString(file);
  };

  const formattedHistory =
    historyList?.map(item => ({
      id: item._id,
      date: new Date(item.date).toLocaleDateString('vi-VN'),
      name: item.name || user?.fullname || '',
      gender: item.gender === 1 ? 'Nam' : 'Nữ',
      birthday: formatDate(item.birthday),
      height: `${item.height} cm`,
      weight: `${item.weight} kg`,
      boneAge: item.boneAge ? formatDate(item.boneAge) : 'N/A',
      pubertyOnsetDate: item.pubertyOnsetDate
        ? formatDate(item.pubertyOnsetDate)
        : 'N/A',
      desiredHeight: `${item.desiredHeight} cm`,
      phone: item.phone,
      note: item.note || 'Đo chiều cao từ website',
      rawDate: item.date,
      rawHeight: item.height,
      rawPercentile: item.percentile || 0,
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
    <div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold text-grayscale-90 mb-2">
            Đo cao khách hàng
          </div>
          <div className="text-sm text-grayscale-40 font-normal mb-6">
            Xem thông tin chi tiết đo cao được cung cấp
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative max-w-[280px]">
            <Input
              className="rounded-full bg-background pl-4 pr-12 h-[40px] border border-[#E2E8F0] text-sm placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Tìm kiếm mẩu tin..."
              value={keyword}
              onChange={e => {
                setKeyword(e.target.value);
                debouncedSearch(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSearchTerm(keyword);
                }
              }}
            />
            <button
              aria-label="Search"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-5"
              type="button"
              onClick={() => setSearchTerm(keyword)}>
              <SearchIcon className="w-5 h-5 text-[#94A3B8] hover:text-primary" />
            </button>
          </div>
          <Button
            disabled={isPendingDowloadExcel}
            variant="outline"
            onClick={() =>
              getExcelMeasurement(undefined, {
                onSuccess: async data => {
                  try {
                    if (typeof data === 'string' && data.startsWith('http')) {
                      // Trích xuất tên file từ URL
                      const fileName =
                        data.split('/').pop() || 'cdc_grow_track_sample.xlsm';

                      // Fetch dữ liệu từ URL
                      const response = await fetch(data);

                      if (!response.ok) {
                        throw new Error(
                          `Download failed: ${response.statusText}`,
                        );
                      }

                      // Lấy dữ liệu binary của file
                      const blob = await response.blob();

                      // Xác định mime type dựa vào phần mở rộng
                      let mimeType = getMineTypeExcel(fileName);

                      // Gọi fileDownload với binary data và mime type
                      fileDownload(blob, fileName, mimeType);
                    } else {
                      // Xử lý trường hợp dữ liệu không phải URL
                      fileDownload(
                        data,
                        'cdc_grow_track_sample.xlsm',
                        'application/vnd.ms-excel.sheet.macroEnabled.12',
                      );
                    }

                    toast({
                      title: 'Tải file thành công',
                      description: 'File mẫu đã được tải xuống.',
                      variant: 'success',
                    });
                  } catch (error) {
                    console.error('Download error:', error);
                    toast({
                      title: 'Lỗi tải file',
                      description:
                        error instanceof Error
                          ? error.message
                          : 'Không thể tải file mẫu.',
                      variant: 'destructive',
                    });
                  }
                },
              })
            }>
            {isPendingDowloadExcel ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="h-4 w-4" />
            )}
            Tải về
          </Button>
          <Button
            disabled={isPendingImport}
            variant="outline"
            onClick={handleImportClick}>
            {isPendingImport && (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            )}
            Import excel
          </Button>

          <input
            ref={fileImportRef}
            accept=".xlsx, .xls, .xlsm"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />

          <Button onClick={() => setIsModalOpen(true)}>Tạo đo cao</Button>
        </div>
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

      {/* Show error when import excel*/}
      {showImportErrors && importErrors.length > 0 && (
        <div className="mt-4 mb-6 border border-red-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <div className="font-medium text-red-800">
              Phát hiện {importErrors.length} lỗi trong file Excel
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Vui lòng kiểm tra và sửa các lỗi sau trong file Excel hoặc sử
                  dụng file mẫu để đảm bảo đúng định dạng.
                </p>
              </div>
              <Button
                className="ml-4 text-sm border-primary text-primary hover:bg-primary/5"
                disabled={isPendingDowloadExcel}
                size="sm"
                variant="outline"
                onClick={() =>
                  getExcelMeasurement(undefined, {
                    onSuccess: data => {
                      fileDownload(data, 'cdc_grow_track_sample.xlsx');
                    },
                  })
                }>
                {isPendingDowloadExcel ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <DownloadIcon className="h-3.5 w-3.5 mr-1" />
                )}
                Tải file mẫu
              </Button>
            </div>

            {/* Error list */}
            <div className="bg-red-50 rounded-md p-3 max-h-60 overflow-y-auto">
              <ul className="list-disc pl-5 space-y-1.5">
                {importErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="text-gray-600 hover:text-gray-800"
                size="sm"
                variant="ghost"
                onClick={() => setShowImportErrors(false)}>
                Đóng
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowImportErrors(false);
                  fileImportRef.current?.click();
                }}>
                Thử lại với file khác
              </Button>
            </div>
          </div>
        </div>
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
                    Tuổi xương thực
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Ngày dậy thì
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
                      {item.boneAge}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {item.pubertyOnsetDate}
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
                          href={`/tai-khoan/lich-su-do-cao/${item.id}?name=${encodeURIComponent(
                            item.name,
                          )}`}>
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
      <CreateHeightMeasurementCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
