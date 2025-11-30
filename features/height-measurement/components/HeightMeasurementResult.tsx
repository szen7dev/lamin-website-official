'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Chart from 'chart.js/auto';

import { useGetHeightMeasurementInfo } from '../hooks/useGetHeightMeasurementInfo';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import { CheckIcon } from '@/components/icons';
import { fallbackData, percentiles } from '@/data/chart';

interface HeightMeasurementResultProps {
  resultId: string;
  onSuccess?: () => void;
}

export default function HeightMeasurementResult({
  resultId,
  onSuccess,
}: HeightMeasurementResultProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user } = useAuth();

  // Lấy dữ liệu từ API qua React Query
  const { response, growTrack, isLoading, error } =
    useGetHeightMeasurementInfo(resultId);

  const [processedData, setProcessedData] = useState<
    typeof fallbackData | null
  >(null);

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = '/images/LogoLamin_Blue.webp';
    
    logoImg.onload = () => {
      logoImgRef.current = logoImg;
      if (chartInstance.current) {
        chartInstance.current.update();
      }
    };
    
    logoImg.onerror = () => {
      console.error('Failed to load logo image');
    };
    
    if (logoImg.complete) {
      logoImgRef.current = logoImg;
    }
  }, []);

  // Xử lý dữ liệu từ API
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
        heightData = growTrack.growTrack.ageHeightNow.map(item => ({
          age: Number(item.age),
          height: Number(item.height),
        }));

        // Sort data by age to ensure proper display
        heightData.sort((a, b) => a.age - b.age);

        // Extend data to age 20 if it doesn't already go that far
        const maxAgeInData = Math.max(...heightData.map(item => item.age));

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
        coach: user?.fullname || 'Chuyên gia Lamin',
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

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Lỗi khi xử lý dữ liệu:', error);
    }
  }, [response, growTrack]);

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
          // Percentile lines (mỏng hơn, opacity thấp hơn)
          ...percentiles.map(p => ({
            label: p.name,
            data: processedData.heightData.map((d, idx) => {
              // Lấy giá trị từ P3, P5, v.v. nếu có
              if (growTrackData) {
                const pData =
                  growTrackData[
                    `ageHeight${p.name}` as keyof typeof growTrackData
                  ];

                if (Array.isArray(pData)) {
                  // Find matching age in percentile data
                  const matchingPoint = pData.find(
                    point => Math.round(point.age) === Math.round(d.age),
                  );

                  if (matchingPoint) {
                    return matchingPoint.height;
                  }

                  // If we're beyond the original data, extrapolate
                  if (d.age > pData[pData.length - 1]?.age) {
                    // For ages beyond our percentile data, extend the line with a slight increase
                    const lastPoint = pData[pData.length - 1];

                    if (lastPoint) {
                      // Simple linear extrapolation
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
              color: '#000',
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#000',
              stepSize: isMobile ? 2 : 1,
              callback: value => value,
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            border: {
              color: '#000',
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
              color: '#000',
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            min: 80,
            max: 220,
            ticks: {
              color: '#000',
              stepSize: isMobile ? 40 : 20,
              font: {
                size: isMobile ? 8 : 12,
              },
            },
            grid: {
              display: false,
              // color: '#E9ECEF',
              // drawTicks: false,
            },
            border: {
              color: '#000',
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

                // Position the label higher above the point
                // Increase the offset to ensure it's above all lines
                const labelOffset = isMobile ? 20 : 27;

                ctx.fillText(`${height}`, x, y - labelOffset);

                ctx.restore();
              });
            }
          },
        },
        {
          id: 'logoWatermark',
          afterDraw(chart) {
            const { ctx, chartArea } = chart;
            const logoImg = logoImgRef.current;

            if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
              const logoHeight = isMobile ? 25 : 40;
              const aspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
              const logoWidth = logoHeight * aspectRatio;
              const padding = isMobile ? 10 : 15;

              const x = chartArea.right - logoWidth - padding;
              const y = chartArea.bottom - logoHeight - padding;

              ctx.save();
              ctx.globalAlpha = 1;
              ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
              ctx.restore();
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

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="container flex items-center justify-center py-8 sm:py-12">
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

  // Tính thời gian từ ngày dậy thì
  const calculateTimeSincePuberty = (pubertyDate: string | Date) => {
    const today = new Date();
    const puberty = new Date(pubertyDate);

    if (isNaN(puberty.getTime())) {
      console.error('Invalid puberty date:', pubertyDate);

      return null;
    }

    const diffTime = Math.abs(today.getTime() - puberty.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
      return `${diffMonths} tháng`;
    }

    return `${diffDays} ngày`;
  };

  const age = calculateAge(processedData.birthDate);

  return (
    <article
      aria-labelledby="height-measurement-result-title"
      className="flex flex-col md:flex-row overflow-hidden">
      <h2 className="sr-only" id="height-measurement-result-title">
        Kết quả phân tích đo cao
      </h2>

      {/* Column 1: Age and Height Table */}
      <aside className="w-full md:w-[200px] shrink-0 order-1">
        <div className="border border-grayscale-100 rounded-tl-md h-full rounded-bl-md">
          <header className="grid grid-cols-[60px_1fr] bg-primary text-center text-xs sm:text-sm font-medium text-white rounded-t-md sm:rounded-tr-none sm:rounded-tl-sm">
            <div className="px-1 sm:px-2 py-1">Tuổi</div>
            <div className="px-1 sm:px-2 py-1">Chiều cao (cm)</div>
          </header>
          <div>
            {processedData.heightData
              .filter(item => {
                // Tính tuổi hiện tại
                const currentAge = calculateAge(processedData.birthDate).years;

                // Chỉ hiển thị từ tuổi hiện tại trở đi
                return item.age >= currentAge;
              })
              .map((item, index, filteredArray) => (
                <div
                  key={item.age}
                  className={`grid grid-cols-[60px_1fr] text-center text-xs sm:text-sm ${
                    index === filteredArray.length - 1 ? 'text-[#FF0000]' : ''
                  } ${index % 2 === 1 ? 'bg-gray-200' : ''}`}>
                  <div className="px-2 sm:px-4 py-1.5">{item.age}</div>
                  <div className="px-2 sm:px-4 py-1.5">{item.height}</div>
                </div>
              ))}
          </div>
        </div>
      </aside>

      {/* Column 2: Growth Chart and Info */}
      <section
        className="flex-1 space-y-3 sm:space-y-4 order-1 md:order-2"
        id="print-frame">
        {/* Row 1: Growth Rate */}
        <div
          aria-label="Đường tăng trưởng"
          className="flex items-stretch border border-l-0 rounded-tr-md border-black max-h-8">
          <div className="flex items-center px-1 py-1 whitespace-nowrap text-sm font-medium border-r border-grayscale-100">
            Đường tăng trưởng: {processedData.P}
          </div>
          <div className="flex-1 px-1 py-1 flex items-center">
            <div className="w-full h-5/6 bg-gray-200 rounded-md overflow-hidden flex items-center">
              <div
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={processedData.P}
                className="h-full rounded-md bg-[#F37021]"
                role="progressbar"
                style={{
                  width: `${processedData.P}%`,
                  backgroundColor: (() => {
                    if (processedData.P === 100) return '#A9A9A9';
                    if (processedData.P >= 90) return '#006400';
                    if (processedData.P >= 80) return '#228B22';
                    if (processedData.P >= 70) return '#32CD32';
                    if (processedData.P >= 60) return '#ADFF2F';
                    if (processedData.P >= 50) return '#FFD700';
                    if (processedData.P >= 40) return '#FFA500';
                    if (processedData.P >= 30) return '#FF4500';
                    if (processedData.P >= 20) return '#DC143C';
                    if (processedData.P >= 10) return '#D3D3D3';

                    return '#D3D3D3';
                  })(),
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Chart Area */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2 p-3 border-r border-black !mt-0">
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
          <figure className="h-[300px] sm:h-[400px] sm:p-4 sm:pb-0">
            <canvas ref={chartRef} aria-label="Biểu đồ dự đoán chiều cao" />
          </figure>
        </div>

        {/* Row 3: Analysis Text */}
        <div className="grid !mt-0 text-sm sm:text-sm py-2 border-r border-b border-black rounded-br-md">
          <p className="border-b border-t border-grayscale-100">
            • Tên bé: {processedData.name} (
            {processedData.gender === 1 ? 'Nam' : 'Nữ'}), sinh ngày{' '}
            {new Date(processedData.birthDate).toLocaleDateString('vi-VN')} -{' '}
            {age.years} tuổi, {age.months} tháng, {age.days} ngày
            {response?.boneAge && Number(response.boneAge) > 0 && (
              <span className="text-red-500">
                <span className="text-black">.</span> Tuổi xương thực:{' '}
                {response.boneAge}
              </span>
            )}
            {response?.pubertyOnsetDate && (
              <span className="text-red-500">
                <span className="text-black">.</span> Đã dậy thì:{' '}
                {calculateTimeSincePuberty(response.pubertyOnsetDate)}
              </span>
            )}
          </p>
          <p className="border-b border-grayscale-100" id="test-text">
            • Chiều cao:{' '}
            {processedData.height.toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            cm. {processedData.noticeH}. Bé{' '}
            {processedData.hdfs > 0 ? 'cao' : 'thấp'} hơn so với chiều cao trung
            bình là{' '}
            {Math.abs(processedData.hdfs).toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            cm. Chuẩn WHO:{' '}
            {processedData.whoHS.toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            cm
          </p>
          <p className="border-b border-grayscale-100">
            • Cân nặng:{' '}
            {processedData.weight.toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            kg. {processedData.noticeW}.
            {/* Bé{' '}
            {processedData.wdfs > 0 ? 'nặng' : 'nhẹ'} hơn so với cân nặng trung
            bình là{' '}
            {Math.abs(processedData.wdfs).toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            kg. Chuẩn WHO:{' '}
            {processedData.whoWS.toLocaleString('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            kg */}
          </p>
          <p className="border-b border-grayscale-100 flex flex-wrap items-center gap-1">
            •{' '}
            <span className="text-[#0052a4] font-bold">
              Dự đoán chiều cao khi trưởng thành:{' '}
              {Math.abs(processedData.predictedAdultHeight).toLocaleString(
                'vi-VN',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
              cm
            </span>
            <span className="text-grayscale-90 coach-predict">
              | Ngày:{' '}
              {new Date(processedData.analysisDate).toLocaleDateString('vi-VN')}{' '}
              - Coach: {processedData.coach}
            </span>
          </p>
          <p className="border-b border-grayscale-100 font-bold">
            • Chiều cao chuẩn của bé trai là: 177cm và bé bé gái là: 163,5cm
          </p>
          <p className="border-b border-grayscale-100 text-grayscale-90">
            • Con có thể không đạt được chiều cao dự đoán nếu bị ảnh hưởng bởi
            những thói quen sinh hoạt xấu
          </p>
          <p className="border-b border-grayscale-100 text-grayscale-90">
            • Con có thể tăng thêm 7-15cm so với dự đoán khi trưởng thành nếu bố
            mẹ giúp con áp dụng giải pháp tăng chiều cao LaminGrow
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
}
