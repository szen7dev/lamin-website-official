'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import Chart from 'chart.js/auto';

import { useGetHeightMeasurementInfo } from '../hooks/useGetHeightMeasurementInfo';

import { useMediaQuery } from '@/hooks/useMediaQuery';

const percentiles = [
  { name: 'P3', color: '#0D6EFD' },
  { name: 'P5', color: '#DC3545' },
  { name: 'P10', color: '#FFC107' },
  { name: 'P25', color: '#198754' },
  { name: 'P50', color: '#FD7E14' },
  { name: 'P75', color: '#0DCAF0' },
  { name: 'P90', color: '#0D6EFD' },
  { name: 'P95', color: '#DC3545' },
  { name: 'P97', color: '#FFC107' },
];

// Fallback data khi không có dữ liệu từ API
const fallbackData = {
  heightData: [
    { age: 5, height: 112 },
    { age: 6, height: 113 },
    { age: 7, height: 119 },
    { age: 8, height: 125 },
    { age: 9, height: 130 },
    { age: 10, height: 135 },
    { age: 11, height: 141 },
    { age: 12, height: 148 },
    { age: 13, height: 154 },
    { age: 14, height: 158 },
    { age: 15, height: 159 },
    { age: 16, height: 160 },
    { age: 17, height: 161 },
    { age: 18, height: 162 },
    { age: 19, height: 163 },
    { age: 20, height: 164 },
  ],
  name: 'Nguyễn Văn A',
  gender: 1,
  birthDate: '2019-04-12',
  height: 112,
  predictedHeight: 161,
  growthRate: 36,
  analysisDate: '2025-03-11',
  coach: 'Hoàng Thảo',
  recommendations: [
    'Ngủ trước 10h tối',
    'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
    'Bổ sung Protein, Canxi, D3, K2',
  ],
};

interface HeightMeasurementResultProps {
  resultId: string;
}

export default function HeightMeasurementResult({
  resultId,
}: HeightMeasurementResultProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Lấy dữ liệu từ API qua React Query
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetHeightMeasurementInfo(resultId);

  const [processedData, setProcessedData] = useState<
    typeof fallbackData | null
  >(null);

  // Xử lý dữ liệu từ API
  useEffect(() => {
    if (!apiResponse) return;

    try {
      // Thông tin cá nhân từ API
      const userData = apiResponse.data || {};
      const growTrackData = apiResponse.growTrack || {};

      // Tạo dữ liệu chiều cao theo tuổi từ ageHeightNow hoặc hdfs
      let heightData = [];

      if (
        growTrackData.ageHeightNow &&
        Array.isArray(growTrackData.ageHeightNow)
      ) {
        // Sử dụng dữ liệu ageHeightNow nếu có
        heightData = growTrackData.ageHeightNow;
      } else if (growTrackData.hdfs && Array.isArray(growTrackData.hdfs)) {
        // Sử dụng dữ liệu hdfs nếu có
        heightData = growTrackData.hdfs.map((item: any) => ({
          age: item.age,
          height: item.height,
        }));
      } else {
        heightData = fallbackData.heightData;
      }

      const predictedHeight =
        growTrackData.ageHeightP50 && growTrackData.ageHeightP50.length > 0
          ? Math.round(
              growTrackData.ageHeightP50[growTrackData.ageHeightP50.length - 1]
                .height,
            )
          : userData.gender === 1
            ? 170
            : 160;

      // Tạo kết quả
      setProcessedData({
        heightData,
        name: userData.name || 'Chưa có tên',
        gender: userData.gender || 1,
        birthDate: userData.birthday || new Date().toISOString(),
        height: userData.height || 0,
        predictedHeight,
        growthRate: 50, // Giá trị mặc định
        analysisDate: userData.createAt || new Date().toISOString(),
        coach: 'Chuyên gia Lamin',
        recommendations: [
          'Ngủ trước 10h tối',
          'Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây',
          'Bổ sung Protein, Canxi, D3, K2',
        ],
      });
    } catch (error) {
      console.error('❌ Lỗi khi xử lý dữ liệu:', error);
    }
  }, [apiResponse]);

  // Tạo biểu đồ
  useEffect(() => {
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

    // Tạo chart mới
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: processedData.heightData.map(d => d.age),
        datasets: [
          // Percentile lines (mỏng hơn, opacity thấp hơn)
          ...percentiles.map(p => ({
            label: p.name,
            data: Array(processedData.heightData.length)
              .fill(0)
              .map((_, idx) => {
                // Lấy giá trị từ P3, P5, v.v. nếu có
                if (apiResponse?.growTrack) {
                  const pData =
                    apiResponse.growTrack[
                      `ageHeight${p.name}` as keyof typeof apiResponse.growTrack
                    ];

                  return Array.isArray(pData) && idx < pData.length
                    ? pData[idx].height
                    : null;
                }

                return null;
              }),
            borderColor: p.color,
            borderWidth: 0.5,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          })),
          // Prediction line (đậm và nổi bật hơn)
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
            text: 'Biểu đồ dự đoán chiều cao CDC',
            align: 'center',
            font: {
              size: isMobile ? 14 : 16,
              weight: 'bold',
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
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tuổi',
              font: {
                size: isMobile ? 10 : 12,
              },
            },
            grid: {
              display: false, // Remove vertical grid lines
            },
            ticks: {
              stepSize: isMobile ? 2 : 1,
              callback: value => value + (isMobile ? '' : ' Tuổi'),
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            border: {
              width: 1,
            },
            min: 5, // Bắt đầu từ 5 tuổi
            max: 20, // Kết thúc ở 20 tuổi
          },
          y: {
            title: {
              display: true,
              text: 'Chiều cao (cm)',
              font: {
                size: isMobile ? 10 : 12,
              },
            },
            min: 80, // Điều chỉnh min để biểu đồ dễ nhìn hơn
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
            const meta = chart.getDatasetMeta(chart.data.datasets.length - 1);

            meta.data.forEach((element, index) => {
              const position = element.getProps(['x', 'y']);
              const { x, y } = position;
              const height = processedData.heightData[index].height;

              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.font = `bold ${isMobile ? '10px' : '12px'} Inter`;
              ctx.fillStyle = '#198754';
              ctx.fillText(`${height}cm`, x, y - (isMobile ? 6 : 10));
              ctx.restore();
            });
          },
        },
      ],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedData, isMobile, apiResponse]);

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
      <div className="rounded-lg bg-error-5/10 p-6 text-error-5 flex flex-col items-center gap-3">
        <AlertCircle aria-hidden="true" className="h-10 w-10 shrink-0" />
        <h2 className="text-lg font-semibold">Lỗi khi tải dữ liệu</h2>
        <p className="text-center">
          {error instanceof Error
            ? error.message
            : 'Không thể tải kết quả đo chiều cao'}
        </p>
        <button
          className="mt-2 px-4 py-2 bg-primary-5 text-white rounded-lg hover:bg-primary-20"
          type="button"
          onClick={() => (window.location.href = '/height-measurement')}>
          Thử lại
        </button>
      </div>
    );
  }

  if (!processedData) {
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

  // Tính tuổi từ ngày sinh
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Tính số tháng
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      months += 12;
    }

    // Tính số ngày
    const days = today.getDate() - birth.getDate();

    return { years: age, months, days: days > 0 ? days : 0 };
  };

  const age = calculateAge(processedData.birthDate);

  return (
    <article
      aria-labelledby="height-measurement-result-title"
      className="flex flex-col md:flex-row gap-4 sm:gap-6">
      <h2 className="sr-only" id="height-measurement-result-title">
        Kết quả phân tích đo cao
      </h2>

      {/* Column 1: Age and Height Table */}
      <aside className="w-full md:w-[200px] shrink-0 order-2 md:order-1">
        <div className="rounded-lg border border-grayscale-20">
          <header className="grid grid-cols-2 bg-primary-5 text-center text-xs sm:text-sm font-medium text-white">
            <div className="border-r border-white/10 px-2 sm:px-4 py-2">
              Tuổi
            </div>
            <div className="px-2 sm:px-4 py-2">Chiều cao (cm)</div>
          </header>
          <div className="max-h-[300px] md:max-h-[600px] overflow-y-auto">
            {processedData.heightData.map((item, index) => (
              <div
                key={item.age}
                className={`grid grid-cols-2 border-t border-grayscale-20 text-center text-xs sm:text-sm ${
                  index === processedData.heightData.length - 1
                    ? 'text-error-5'
                    : ''
                }`}>
                <div className="border-r border-grayscale-20 px-2 sm:px-4 py-2">
                  {item.age}
                </div>
                <div className="px-2 sm:px-4 py-2">{item.height}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Column 2: Growth Chart and Info */}
      <section className="flex-1 space-y-3 sm:space-y-4 order-1 md:order-2">
        {/* Row 1: Growth Rate */}
        <div
          aria-label="Đường tăng trưởng"
          className="flex items-center gap-2 sm:gap-4">
          <div className="whitespace-nowrap text-sm sm:text-base font-medium">
            Đường tăng trưởng: {processedData.growthRate}
          </div>
          <div
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={processedData.growthRate}
            className="h-6 sm:h-8 flex-1 rounded-md bg-primary-5"
            role="progressbar"
          />
        </div>

        {/* Row 2: Chart Area */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2">
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
          <figure className="h-[300px] sm:h-[400px] rounded-lg border border-grayscale-20 p-2 sm:p-4">
            <canvas ref={chartRef} aria-label="Biểu đồ dự đoán chiều cao" />
          </figure>
        </div>

        {/* Row 3: Analysis Text */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <p>
            • Chiều cao: {processedData.height}cm. Bé{' '}
            {apiResponse?.growTrack.hdfs > 0 ? 'cao' : 'thấp'} hơn so với chiều
            cao trung bình là {Math.abs(apiResponse?.growTrack.hdfs)}cm. Chuẩn
            WHO: {processedData.height - apiResponse?.growTrack.hdfs}cm
          </p>
          <p>
            • Bé {processedData.gender === 1 ? 'Nam' : 'Nữ'},{' '}
            {processedData.name}, sinh ngày{' '}
            {new Date(processedData.birthDate).toLocaleDateString('vi-VN')} -{' '}
            {age.years} tuổi, {age.months} tháng, {age.days} ngày
          </p>
          <p className="flex flex-wrap items-center gap-1">
            •{' '}
            <span className="text-error-5">
              Dự đoán chiều cao khi trưởng thành:{' '}
              {processedData.predictedHeight}cm
            </span>
            <span className="text-grayscale-60">
              | Ngày:{' '}
              {new Date(processedData.analysisDate).toLocaleDateString('vi-VN')}{' '}
              - Coach: {processedData.coach}
            </span>
          </p>
          <p>
            • Giải pháp tăng chiều cao (Khi con bạn trưởng thành. Chiều cao
            trung bình của bé trai là: 177cm và bé Bé Gái là: 163,5cm)
          </p>
          <p className="text-grayscale-60">
            • Con có thể không đạt được chiều cao dự đoán nếu bị ảnh hưởng bởi
            những thói quen sinh hoạt xấu
          </p>
          <p className="text-grayscale-60">
            • Con có thể tăng thêm 7 - 15cm so với dự đoán khi trưởng thành nếu
            bố mẹ giúp con áp dụng giải pháp tăng chiều cao của Lamin
          </p>
          <ul
            aria-label="Khuyến nghị"
            className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 mt-2">
            {processedData.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center gap-1 sm:gap-2">
                <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-success-5">
                  <Check
                    aria-hidden="true"
                    className="h-2 w-2 sm:h-3 sm:w-3 text-white"
                  />
                </div>
                <span className="text-xs sm:text-sm text-grayscale-60">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
