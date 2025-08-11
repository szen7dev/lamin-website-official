'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckIcon } from 'lucide-react';
import { Chart } from 'chart.js';

import { useGetHeightMeasurementInfo } from '@/features/height-measurement';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { fallbackData, percentiles } from '@/data/chart';
import { useTabContext } from '@/contexts/TabContext';

interface TabContentProps {
  data?: any; // Contact data from tab (now optional)
}

const TabContent = ({ data }: TabContentProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [processedData, setProcessedData] = useState<
    typeof fallbackData | null
  >(null);

  // Get current tab measurement data
  const { tabs, activeTabId, updateTabMeasurement } = useTabContext();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const measurementData = activeTab?.measurementData;

  // Determine if we're loading grow track data
  const isLoadingGrowTrack =
    measurementData?.response && !measurementData?.growTrack;

  // Only use fallback API if we don't have measurement data at all
  const {
    response: fallbackResponse,
    growTrack: fallbackGrowTrack,
    isLoading: fallbackLoading,
    error: fallbackError,
  } = useGetHeightMeasurementInfo(
    !measurementData ? data?.resultId : null, // Only call if we have no measurement data
  );

  // Determine which data source to use
  const response = measurementData?.response || fallbackResponse;
  const growTrack = measurementData?.growTrack || fallbackGrowTrack;
  const isLoading = measurementData ? isLoadingGrowTrack : fallbackLoading;
  const error = measurementData ? null : fallbackError;

  useEffect(() => {
    if (!response || !growTrack) return;

    try {
      // Tạo dữ liệu chiều cao theo tuổi từ ageHeightNow hoặc hdfs
      let heightData = [];

      if (
        growTrack.growTrack.ageHeightNow &&
        Array.isArray(growTrack.growTrack.ageHeightNow)
      ) {
        // Sử dụng dữ liệu ageHeightNow nếu có
        heightData = growTrack.growTrack.ageHeightNow.map((item: any) => ({
          age: item.age,
          height: item.height,
        }));

        // Sort by age
        heightData.sort((a: any, b: any) => a.age - b.age);

        // Extend data to age 18 if needed
        const maxAgeInData = Math.max(
          ...heightData.map((item: any) => item.age),
        );

        if (maxAgeInData < 20) {
          // Get the last height value
          const lastHeight = heightData[heightData.length - 1]?.height || 0;

          // Add missing ages up to 20
          for (let age = maxAgeInData + 1; age <= 20; age++) {
            // For prediction data, we'll use the predicted adult height for ages 18-20
            const height =
              age >= 18
                ? response.predictedAdultHeight
                : lastHeight +
                  ((response.predictedAdultHeight - lastHeight) /
                    (18 - maxAgeInData)) *
                    (age - maxAgeInData);

            heightData.push({ age, height: Math.round(height * 10) / 10 });
          }
        }
      } else {
        heightData = fallbackData.heightData;

        // Extend fallback data to age 20 if needed
        const maxAgeInData = Math.max(...heightData.map(item => item.age));

        if (maxAgeInData < 20) {
          const lastHeight = heightData[heightData.length - 1]?.height || 0;

          for (let age = maxAgeInData + 1; age <= 20; age++) {
            heightData.push({ age, height: lastHeight });
          }
        }
      }

      const predictedHeight = growTrack.whoHS;

      // Tạo kết quả
      setProcessedData({
        heightData,
        name: response.name || 'Chưa có tên',
        gender: response.gender || 1,
        birthDate: response.birthday || new Date().toISOString(),
        height: response.height || 0,
        predictedHeight,
        growthRate: 36, // Giá trị mặc định
        analysisDate: response.createAt || new Date().toISOString(),
        coach: 'Chuyên gia Lamin',
        recommendations: [
          'Ngủ trước 10h tối',
          'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
          'Bổ sung Protein, Canxi, D3, K2',
        ],
        noticeH: growTrack.noticeH || 'Đạt chuẩn',
        hdfs: growTrack.hdfs || 0,
        whoHS: growTrack.whoHS || 0,
        noticeW: growTrack.noticeW || 'Đạt chuẩn',
        wdfs: growTrack.wdfs || 0,
        whoWS: growTrack.whoWS || 0,
        weight: response.weight || 0,
        predictedAdultHeight: growTrack.predictedAdultHeight || 0,
        P: growTrack.P || 0,
      });
    } catch (error) {
      console.error('❌ Lỗi khi xử lý dữ liệu:', error);
    }
  }, [response, growTrack]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) {
      console.error('Invalid birth date:', birthDate);

      return { years: 0, months: 0, days: 0 };
    }

    let years = today.getFullYear() - birth.getFullYear();

    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      days += lastMonth.getDate();
      months--;

      if (months < 0) {
        years--;
        months += 12;
      }
    }

    return { years, months, days };
  };

  // Tạo biểu đồ
  useEffect(() => {
    if (!response || !growTrack) return;
    const growTrackData = growTrack.growTrack || {};

    if (!chartRef.current || !processedData || !processedData.heightData) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    if (!ctx) {
      return;
    }

    // Hủy chart cũ nếu có
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Tính tuổi hiện tại
    const currentAge = calculateAge(processedData.birthDate).years;

    // Tạo chart mới
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: processedData.heightData.map(d => d.age),
        datasets: [
          ...percentiles.map(p => ({
            label: p.name,
            data: processedData.heightData.map(d => {
              if (growTrackData) {
                const pData =
                  growTrackData[
                    `ageHeight${p.name}` as keyof typeof growTrackData
                  ];

                if (Array.isArray(pData)) {
                  const matchingPoint = pData.find(
                    point => Math.round(point.age) === Math.round(d.age),
                  );

                  if (matchingPoint) {
                    return matchingPoint.height;
                  }

                  if (d.age > pData[pData.length - 1]?.age) {
                    const lastPoint = pData[pData.length - 1];

                    if (lastPoint) {
                      const growthRate = 1 + (p.name === 'P50' ? 0.005 : 0.003); // Slight growth per year
                      const yearsAfterLastPoint = d.age - lastPoint.age;

                      return (
                        lastPoint.height *
                        Math.pow(growthRate, yearsAfterLastPoint)
                      );
                    }
                  }
                }
              }

              return null;
            }),
            borderColor: p.color,
            borderWidth: 1,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          })),
          {
            label: 'Dự đoán',
            data: processedData.heightData.map(d => d.height),
            borderColor: '#198754',
            backgroundColor: '#198754',
            borderWidth: 2.5,
            pointRadius: isMobile ? 4 : 6,
            pointBackgroundColor: '#198754',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ dự đoán chiều cao CDC thực hiện tại lamin.com.vn',
            align: 'center',
            font: {
              size: isMobile ? 14 : 24,
              weight: 'bolder',
            },
            padding: {
              bottom: isMobile ? 20 : 30,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // Tắt tooltip mặc định
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Tuổi',
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              stepSize: isMobile ? 2 : 1,
              callback: value => value,
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            border: {
              width: 1,
            },
            min: currentAge,
            max: 20,
            bounds: 'data',
          },
          y: {
            title: {
              display: true,
              text: 'Chiều cao (cm)',
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            min: 80,
            max: 220,
            ticks: {
              stepSize: isMobile ? 40 : 20,
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            grid: {
              color: '#E9ECEF',
              drawTicks: false,
            },
            border: {
              width: 1,
            },
          },
        },
        layout: {
          padding: {
            right: isMobile ? 10 : 20,
            top: isMobile ? 10 : 20, // Thêm padding phía trên để hiển thị số liệu
          },
        },
      },
      plugins: [
        {
          id: 'heightLabels',
          afterDatasetsDraw(chart) {
            const { ctx } = chart;
            // Get only the predicted height dataset (last dataset)
            const predictedDatasetIndex = chart.data.datasets.length - 1;
            const meta = chart.getDatasetMeta(predictedDatasetIndex);

            // Only process if this is the predicted dataset
            if (
              chart.data.datasets[predictedDatasetIndex].label === 'Dự đoán'
            ) {
              meta.data.forEach((element, index) => {
                const position = element.getProps(['x', 'y']);
                const { x, y } = position;
                const height = processedData.heightData[index].height;

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.font = `bold ${isMobile ? '10px' : '12px'} Inter`;
                ctx.fillStyle = '#198754';

                const labelOffset = isMobile ? 20 : 27;

                ctx.fillText(`${height}`, x, y - labelOffset);

                ctx.restore();
              });
            }
          },
        },
      ],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedData, isMobile, response, growTrack]);

  // Show loading state for grow track data after measurement is created
  if (isLoadingGrowTrack) {
    return (
      <div className="space-y-4 p-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Đã tạo phép đo thành công!
          </h3>
          <p className="text-blue-700 text-sm">
            Chiều cao: {response?.height}cm | Cân nặng: {response?.weight}kg
          </p>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <svg
              aria-hidden="true"
              className="animate-spin h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                Đang phân tích dữ liệu tăng trưởng...
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <svg
            aria-hidden="true"
            className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-primary-40"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <p className="text-sm sm:text-base text-grayscale-60">
            Đang tải kết quả phân tích...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-error-5/10 p-6 text-[#FF0000] flex flex-col items-center gap-3">
        <AlertCircle aria-hidden="true" className="h-10 w-10 shrink-0" />
        <h2 className="text-lg font-semibold">Lỗi khi tải dữ liệu</h2>
        <p className="text-center">
          {error instanceof Error
            ? error.message
            : 'Không thể tải kết quả đo chiều cao'}
        </p>
        <button
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-20"
          type="button"
          onClick={() => (window.location.href = '/do-cao')}>
          Thử lại
        </button>
      </div>
    );
  }

  if (!processedData) {
    // Show different messages based on whether we have any data at all
    if (!measurementData && !data) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>Chưa có dữ liệu đo chiều cao nào được chọn.</p>
          <p className="text-sm mt-2">
            Vui lòng nhập chiều cao và cân nặng ở bên trái để tạo phép đo.
          </p>
        </div>
      );
    }

    return (
      <div
        aria-live="polite"
        className="flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <p className="text-sm sm:text-base text-grayscale-60">
            Không tìm thấy dữ liệu phân tích. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  const age = calculateAge(processedData.birthDate);

  return (
    <article
      aria-labelledby="height-measurement-result-title"
      className="flex flex-col md:flex-row overflow-hidden">
      <h2 className="sr-only" id="height-measurement-result-title">
        Kết quả phân tích đo cao
      </h2>

      {/* Add success notification for completed measurements */}
      {measurementData?.growTrack && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 m-4 mb-0">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ Phân tích hoàn tất!
          </h3>
          <p className="text-green-700 text-sm">
            Đã tạo phép đo và phân tích dữ liệu tăng trưởng thành công
          </p>
        </div>
      )}

      {/* Add new measurement button */}
      {measurementData?.growTrack && (
        <div className="flex justify-center p-4 pt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
            onClick={() => {
              if (activeTabId) {
                updateTabMeasurement(activeTabId, {});
              }
            }}>
            Tạo phép đo mới
          </button>
        </div>
      )}

      {/* Column 2: Growth Chart and Info */}
      <section className="flex-1 space-y-3 sm:space-y-4 order-1 md:order-2 p-4">
        {/* Row 1: Growth Rate */}
        <div
          aria-label="Đường tăng trưởng"
          className="flex items-center gap-2 sm:gap-4 p-3 border-b border-grayscale-20">
          <div className="whitespace-nowrap text-sm sm:text-base font-medium">
            Đường tăng trưởng: {processedData.P}
          </div>
          <div className="flex-1 h-3 sm:h-4 bg-gray-100 rounded-md overflow-hidden flex items-center">
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={processedData.P}
              className="h-full rounded-md bg-[#F37021]"
              role="progressbar"
              style={{ width: `${processedData.P}%` }}
            />
          </div>
        </div>

        {/* Row 2: Chart Area */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2 p-3">
          {/* Percentile Legend */}
          <div
            aria-label="Chú thích biểu đồ"
            className="flex md:flex-col flex-wrap gap-1 md:gap-1 py-2 sm:py-4">
            {[...percentiles, { name: 'Dự đoán', color: '#198754' }].map(
              item => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 sm:gap-2 whitespace-nowrap px-1 sm:px-2">
                  <div
                    className="h-0.5 w-3 sm:w-4"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm">{item.name}</span>
                </div>
              ),
            )}
          </div>

          {/* Chart */}
          <figure className="h-[300px] sm:h-[400px] sm:p-4">
            <canvas ref={chartRef} aria-label="Biểu đồ dự đoán chiều cao" />
          </figure>
        </div>

        {/* Row 3: Analysis Text */}
        <div className="space-y-1 sm:space-y-2 text-sm sm:text-sm p-3 border-t border-grayscale-20">
          <p>
            • Tên bé: {processedData.name} (
            {processedData.gender === 1 ? 'Nam' : 'Nữ'}), sinh ngày{' '}
            {new Date(processedData.birthDate).toLocaleDateString('vi-VN')} -{' '}
            {age.years} tuổi, {age.months} tháng, {age.days} ngày
          </p>
          <ul
            aria-label="Khuyến nghị"
            className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 mt-2">
            {processedData.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center gap-1 sm:gap-2">
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-success-5">
                  <CheckIcon />
                </div>
                <span className="text-xs sm:text-sm text-grayscale-90">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
};

export default memo(TabContent);
