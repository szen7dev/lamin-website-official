'use client';

import { useRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Chart from 'chart.js/auto';

interface MeasurementResultProps {
  measurementData: {
    response?: any;
    growTrack?: any;
  };
  isLoadingGrowTrack?: boolean;
  onNewMeasurement?: () => void;
}

export function MeasurementResult({
  measurementData,
  isLoadingGrowTrack,
  onNewMeasurement,
}: MeasurementResultProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);

  const { response, growTrack } = measurementData;

  // Process data when we have both response and growTrack
  useEffect(() => {
    if (!response || !growTrack) {
      setProcessedData(null);

      return;
    }

    try {
      const heightData: any[] = [];

      if (
        growTrack.growTrack?.ageHeightNow &&
        Array.isArray(growTrack.growTrack.ageHeightNow)
      ) {
        const ageHeightData = growTrack.growTrack.ageHeightNow.map(
          (item: any) => ({
            age: Number(item.age),
            height: Number(item.height),
          }),
        );

        heightData.push(
          ...ageHeightData.sort((a: any, b: any) => a.age - b.age),
        );
      }

      // Calculate age from birth date
      const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0) {
          years--;
          months += 12;
        }

        return { years, months };
      };

      const age = calculateAge(response.birthday);

      setProcessedData({
        heightData,
        name: response.name || 'Chưa có tên',
        gender: response.gender || 1,
        birthDate: response.birthday || new Date().toISOString(),
        height: response.height || 0,
        weight: response.weight || 0,
        age,
        noticeH: growTrack.noticeH || 'Đạt chuẩn',
        hdfs: growTrack.hdfs || 0,
        whoHS: growTrack.whoHS || 0,
        noticeW: growTrack.noticeW || 'Đạt chuẩn',
        wdfs: growTrack.wdfs || 0,
        whoWS: growTrack.whoWS || 0,
        predictedAdultHeight: growTrack.predictedAdultHeight || 0,
        P: growTrack.P || 0,
      });
    } catch (error) {
      console.error('Error processing measurement data:', error);
      setProcessedData(null);
    }
  }, [response, growTrack]);

  // Create chart
  useEffect(() => {
    if (!chartRef.current || !processedData?.heightData?.length) return;

    const ctx = chartRef.current.getContext('2d');

    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const currentAge = processedData.age.years;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: processedData.heightData.map((d: any) => d.age),
        datasets: [
          {
            label: 'Dự đoán chiều cao',
            data: processedData.heightData.map((d: any) => d.height),
            borderColor: '#198754',
            backgroundColor: '#198754',
            borderWidth: 2,
            pointRadius: 4,
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
            text: 'Biểu đồ dự đoán chiều cao',
            font: { size: 14, weight: 'bold' },
          },
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            title: { display: true, text: 'Tuổi' },
            min: Math.max(0, currentAge - 1),
            max: 20,
          },
          y: {
            title: { display: true, text: 'Chiều cao (cm)' },
            min: 80,
            max: 220,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedData]);

  // Loading state for grow track data
  if (isLoadingGrowTrack || (!growTrack && response)) {
    return (
      <div className="space-y-4">
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

  // Error state
  if (response && !growTrack && !isLoadingGrowTrack) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Đã tạo phép đo thành công!
          </h3>
          <p className="text-blue-700 text-sm">
            Chiều cao: {response?.height}cm | Cân nặng: {response?.weight}kg
          </p>
        </div>

        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <h3 className="font-medium text-red-900">
                Không thể tải dữ liệu phân tích
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Phép đo đã được tạo nhưng không thể phân tích dữ liệu tăng
                trưởng. Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600">Đang xử lý dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Success notification */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">
          ✅ Phân tích hoàn tất!
        </h3>
        <p className="text-green-700 text-sm">
          Đã tạo phép đo và phân tích dữ liệu tăng trưởng thành công
        </p>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Thông tin cơ bản</h4>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Tên:</span> {processedData.name} (
            {processedData.gender === 1 ? 'Nam' : 'Nữ'})
          </p>
          <p>
            <span className="font-medium">Tuổi:</span> {processedData.age.years}{' '}
            tuổi {processedData.age.months} tháng
          </p>
          <p>
            <span className="font-medium">Chiều cao:</span>{' '}
            {processedData.height}cm - {processedData.noticeH}
          </p>
          <p>
            <span className="font-medium">Cân nặng:</span>{' '}
            {processedData.weight}kg - {processedData.noticeW}
          </p>
          <p>
            <span className="font-medium">Dự đoán chiều cao trưởng thành:</span>{' '}
            {processedData.predictedAdultHeight}cm
          </p>
          <p>
            <span className="font-medium">Đường tăng trưởng:</span> P
            {processedData.P}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Biểu đồ tăng trưởng</h4>
        <div className="h-64">
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* New measurement button */}
      {onNewMeasurement && (
        <div className="flex justify-center pt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
            onClick={onNewMeasurement}>
            Tạo phép đo mới
          </button>
        </div>
      )}
    </div>
  );
}
