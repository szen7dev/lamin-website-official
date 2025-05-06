'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
import { ChevronDoubleDown, ChevronNoArrowIcon } from '@/components/icons';
import { useAuth } from '@/hooks';
import { useGetHeightHistory } from '@/features/height-measurement/hooks';
import { formatDate } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HeightMeasureHistoryPage() {
  const { user } = useAuth();
  const [visibleItems, setVisibleItems] = useState(5);
  const heightChartRef = useRef<HTMLCanvasElement | null>(null);
  const percentileChartRef = useRef<HTMLCanvasElement | null>(null);
  const heightChartInstance = useRef<Chart | null>(null);
  const percentileChartInstance = useRef<Chart | null>(null);

  const {
    data: historyList = [],
    isLoading,
    isError,
    error,
  } = useGetHeightHistory({
    phone: user?.phone || '',
    limit: 100, // Increased limit to get more data for charts
  });

  const handleShowMore = () => {
    setVisibleItems(prevCount => prevCount + 5);
  };

  // Format history data for display
  const formattedHistory =
    historyList?.map(item => ({
      id: item._id,
      date: new Date(item.date).toLocaleDateString('vi-VN'),
      name: item.name || user?.fullname || '',
      parentName: item.parentName || '',
      gender: item.gender === 1 ? 'Nam' : 'Nữ',
      birthday: formatDate(item.birthday),
      height: `${item.height} cm`,
      weight: `${item.weight} kg`,
      desiredHeight: `${item.desiredHeight} cm`,
      phone: item.phone,
      note: item.note || 'Đo chiều cao từ website',
      rawDate: item.date,
      rawHeight: item.height,
      rawPercentile: item.percentile || 0,
    })) || [];

  // Create charts when data is available
  useEffect(() => {
    if (
      isLoading ||
      formattedHistory.length === 0 ||
      !heightChartRef.current ||
      !percentileChartRef.current
    ) {
      return;
    }

    // Process data for charts - get unique dates and latest values for each date
    const dateMap = new Map();

    // Sort by date (newest first) to ensure we get the latest data for each date
    const sortedHistory = [...formattedHistory].sort(
      (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
    );

    // Get unique dates with latest data
    sortedHistory.forEach(item => {
      const dateKey = new Date(item.rawDate).toLocaleDateString('vi-VN');

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          height: item.rawHeight,
          percentile: item.rawPercentile,
        });
      }
    });

    // Convert to arrays for chart data
    const chartData = Array.from(dateMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()) // Sort by date (oldest first)
      .slice(-6); // Get last 6 entries

    const labels = chartData.map(([date]) => date);
    const heightData = chartData.map(([, data]) => data.height);
    const percentileData = chartData.map(([, data]) => data.percentile);

    // Destroy existing charts if they exist
    if (heightChartInstance.current) {
      heightChartInstance.current.destroy();
    }

    if (percentileChartInstance.current) {
      percentileChartInstance.current.destroy();
    }

    // Create height chart
    heightChartInstance.current = new Chart(heightChartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Chiều cao (cm)',
            data: heightData,
            backgroundColor: '#0052A4',
            borderColor: '#0052A4',
            borderWidth: 1,
            barPercentage: 0.5, // Control the width of bars as a percentage of the available width
            categoryPercentage: 0.8, // Control the width of the category
            maxBarThickness: 50, // Set maximum thickness in pixels
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ đo chiều cao',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            display: true,
            color: '#000',
            anchor: 'end',
            align: 'top',
            formatter: value => `${value}`,
            font: {
              weight: 'bold',
              size: 12,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#f0f0f0',
            },
            ticks: {
              precision: 0,
            },
            min: 0,
            max: 250,
          },
          x: {
            grid: {
              display: false,
            },
            title: {
              display: false,
              text: 'Ngày đo',
            },
          },
        },
      },
    });

    // Create percentile chart
    percentileChartInstance.current = new Chart(percentileChartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Đường phân vị',
            data: percentileData,
            backgroundColor: '#00BBF2',
            borderColor: '#00BBF2',
            borderWidth: 1,
            barPercentage: 0.5, // Control the width of bars as a percentage of the available width
            categoryPercentage: 0.8, // Control the width of the category
            maxBarThickness: 50, // Set maximum thickness in pixels
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ đường phân vị',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            display: true,
            color: '#000',
            anchor: 'end',
            align: 'top',
            formatter: value => `${value}`,
            font: {
              weight: 'bold',
              size: 12,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#f0f0f0',
            },
            ticks: {
              precision: 1,
            },
            min: 0,
            max: 25,
          },
          x: {
            grid: {
              display: false,
            },
            title: {
              display: false,
              text: 'Ngày đo',
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (heightChartInstance.current) {
        heightChartInstance.current.destroy();
        heightChartInstance.current = null;
      }

      if (percentileChartInstance.current) {
        percentileChartInstance.current.destroy();
        percentileChartInstance.current = null;
      }
    };
  }, [formattedHistory, isLoading]);

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
                    Họ và tên con
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    Họ và tên cha mẹ
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
                      {item.parentName}
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

      {/* Charts */}
      {!isLoading && !isError && formattedHistory.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="h-[300px]">
                <canvas
                  ref={heightChartRef}
                  aria-label="Biểu đồ đo chiều cao"
                  role="img"
                />
              </div>
              <div className="text-center text-sm text-grayscale-90 mt-2 flex justify-center gap-3 items-center">
                <p>
                  <span className="text-grayscale-50">Trục dọc:</span> Chiều cao
                  (cm)
                </p>
                <p>
                  <span className="text-grayscale-50">Trục ngang:</span> Ngày đo
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="h-[300px]">
                <canvas
                  ref={percentileChartRef}
                  aria-label="Biểu đồ đường phân vị"
                  role="img"
                />
              </div>
              <div className="text-center text-sm text-grayscale-90 mt-2 flex justify-center gap-3 items-center">
                <p>
                  <span className="text-grayscale-50">Trục dọc:</span> Đường
                  phân vị
                </p>
                <p>
                  <span className="text-grayscale-50">Trục ngang:</span> Ngày đo
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
