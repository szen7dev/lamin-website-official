"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import Chart from "chart.js/auto"
import { useHeightMeasurementResult } from "../hooks/useHeightMeasurementMutation"
import type { HeightMeasurementResult as ResultType } from "../types/heightMeasurementTypes"

const percentiles = [
  { name: "P3", color: "#0D6EFD" },
  { name: "P5", color: "#DC3545" },
  { name: "P10", color: "#FFC107" },
  { name: "P25", color: "#198754" },
  { name: "P50", color: "#FD7E14" },
  { name: "P75", color: "#0DCAF0" },
  { name: "P90", color: "#0D6EFD" },
  { name: "P95", color: "#DC3545" },
  { name: "P97", color: "#FFC107" },
]

// Dữ liệu percentile cố định
const percentileData = {
  P3: [110, 111, 117, 123, 128, 133, 139, 146, 152, 156, 157, 158, 159, 160, 161, 162],
  P5: [111, 112, 118, 124, 129, 134, 140, 147, 153, 157, 158, 159, 160, 161, 162, 163],
  P10: [111.5, 112.5, 118.5, 124.5, 129.5, 134.5, 140.5, 147.5, 153.5, 157.5, 158.5, 159.5, 160.5, 161.5, 162.5, 163.5],
  P25: [112, 113, 119, 125, 130, 135, 141, 148, 154, 158, 159, 160, 161, 162, 163, 164],
  P50: [112.5, 113.5, 119.5, 125.5, 130.5, 135.5, 141.5, 148.5, 154.5, 158.5, 159.5, 160.5, 161.5, 162.5, 163.5, 164.5],
  P75: [113, 114, 120, 126, 131, 136, 142, 149, 155, 159, 160, 161, 162, 163, 164, 165],
  P90: [113.5, 114.5, 120.5, 126.5, 131.5, 136.5, 142.5, 149.5, 155.5, 159.5, 160.5, 161.5, 162.5, 163.5, 164.5, 165.5],
  P95: [114, 115, 121, 127, 132, 137, 143, 150, 156, 160, 161, 162, 163, 164, 165, 166],
  P97: [114.5, 115.5, 121.5, 127.5, 132.5, 137.5, 143.5, 150.5, 156.5, 160.5, 161.5, 162.5, 163.5, 164.5, 165.5, 166.5],
}

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
  name: "Nguyễn Văn A",
  gender: "male",
  birthDate: "2019-04-12",
  height: "112",
  predictedHeight: 161,
  growthRate: 36,
  analysisDate: "2025-02-27",
  coach: "Hoàng Thảo",
  recommendations: [
    "Ngủ trước 10h tối",
    "Chơi các môn thể thao kéo dãn như Bơi, Xà, Nhảy Dây",
    "Bổ sung Protein, Canxi, D3, K2",
  ],
}

interface HeightMeasurementResultProps {
  resultId?: string
}

export default function HeightMeasurementResult({ resultId }: HeightMeasurementResultProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Lấy dữ liệu từ React Query cache
  const resultData = useHeightMeasurementResult(resultId)

  // Sử dụng dữ liệu từ cache hoặc fallback data
  const data: ResultType | typeof fallbackData = resultData || fallbackData

  useEffect(() => {
    // Giả lập thời gian loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading || !chartRef.current || !data || !data.heightData) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Hủy chart cũ nếu có
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Tạo chart mới
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.heightData.map((d) => d.age),
        datasets: [
          // Percentile lines (mỏng hơn, opacity thấp hơn)
          ...percentiles.map((p, index) => ({
            label: p.name,
            data: percentileData[p.name as keyof typeof percentileData],
            borderColor: p.color,
            borderWidth: 0.5,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          })),
          // Prediction line (đậm và nổi bật hơn)
          {
            label: "Dự đoán",
            data: data.heightData.map((d) => d.height),
            borderColor: "#198754",
            backgroundColor: "#198754",
            borderWidth: 2.5,
            pointRadius: 6,
            pointBackgroundColor: "#198754",
            pointBorderColor: "#fff",
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
            text: "Biểu đồ dự đoán chiều cao CDC",
            align: "center",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: {
              bottom: 30,
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
              text: "Tuổi",
            },
            grid: {
              display: false, // Remove vertical grid lines
            },
            ticks: {
              stepSize: 1,
              callback: (value) => value + " Tuổi",
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
              text: "Chiều cao (cm)",
            },
            min: 80, // Điều chỉnh min để biểu đồ dễ nhìn hơn
            max: 220,
            ticks: {
              stepSize: 20,
            },
            grid: {
              color: "#E9ECEF",
              drawTicks: false,
            },
            border: {
              width: 1,
            },
          },
        },
        layout: {
          padding: {
            right: 20,
            top: 20, // Thêm padding phía trên để hiển thị số liệu
          },
        },
      },
      plugins: [
        {
          id: "heightLabels",
          afterDatasetsDraw(chart) {
            const { ctx } = chart
            const meta = chart.getDatasetMeta(chart.data.datasets.length - 1)

            meta.data.forEach((element, index) => {
              const { x, y } = element.getCenterPoint()
              const height = data.heightData[index].height

              ctx.save()
              ctx.textAlign = "center"
              ctx.textBaseline = "bottom"
              ctx.font = "bold 12px Inter"
              ctx.fillStyle = "#198754"
              ctx.fillText(`${height}cm`, x, y - 10)
              ctx.restore()
            })
          },
        },
      ],
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [isLoading, data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-primary-40"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-grayscale-60">Đang tải kết quả phân tích...</p>
        </div>
      </div>
    )
  }

  if (!data || !data.heightData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-grayscale-60">Không tìm thấy dữ liệu phân tích. Vui lòng thử lại.</p>
        </div>
      </div>
    )
  }

  // Tính tuổi từ ngày sinh
  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    // Tính số tháng
    let months = today.getMonth() - birth.getMonth()
    if (months < 0) {
      months += 12
    }

    // Tính số ngày
    const days = today.getDate() - birth.getDate()

    return { years: age, months, days: days > 0 ? days : 0 }
  }

  const age = calculateAge(data.birthDate)

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Column 1: Age and Height Table */}
      <div className="w-full md:w-[200px] shrink-0">
        <div className="rounded-lg border border-grayscale-20">
          <div className="grid grid-cols-2 bg-[#0D6EFD] text-center text-sm font-medium text-white">
            <div className="border-r border-white/10 px-4 py-2">Tuổi</div>
            <div className="px-4 py-2">Chiều cao (cm)</div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {data.heightData.map((item, index) => (
              <div
                key={item.age}
                className={`grid grid-cols-2 border-t border-grayscale-20 text-center ${
                  index === data.heightData.length - 1 ? "text-[#DC3545]" : ""
                }`}
              >
                <div className="border-r border-grayscale-20 px-4 py-2">{item.age}</div>
                <div className="px-4 py-2">{item.height}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Growth Chart and Info */}
      <div className="flex-1 space-y-4">
        {/* Row 1: Growth Rate */}
        <div className="flex items-center gap-4">
          <div className="whitespace-nowrap text-base font-medium">Đường tăng trưởng: {data.growthRate}</div>
          <div className="h-8 flex-1 rounded-md bg-[#FD7E14]"></div>
        </div>

        {/* Row 2: Chart Area */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2">
          {/* Percentile Legend */}
          <div className="flex md:flex-col flex-wrap gap-2 md:gap-1 py-4">
            {[...percentiles, { name: "Dự đoán", color: "#198754" }].map((item) => (
              <div key={item.name} className="flex items-center gap-2 whitespace-nowrap px-2">
                <div className="h-0.5 w-4" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="h-[400px] rounded-lg border border-grayscale-20 p-4">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Row 3: Analysis Text */}
        <div className="space-y-2 text-sm">
          <p>
            • Chiều cao: {data.height}cm. Đạt chuẩn. Bé thấp hơn so với chiều cao trung bình là 2,156cm. Chuẩn WHO:
            114,156cm
          </p>
          <p>
            • Bé {data.gender === "male" ? "Nam" : "Nữ"}, {data.name}, sinh ngày{" "}
            {new Date(data.birthDate).toLocaleDateString("vi-VN")} - {age.years} tuổi, {age.months} tháng, {age.days}{" "}
            ngày
          </p>
          <p className="flex items-center gap-1">
            • <span className="text-[#DC3545]">Dự đoán chiều cao khi trưởng thành: {data.predictedHeight}cm</span>
            <span className="text-grayscale-60">
              | Ngày: {data.analysisDate} - Coach: {data.coach}
            </span>
          </p>
          <p>
            • Giải pháp tăng chiều cao (Khi con bạn trưởng thành. Chiều cao trung bình của bé trai là: 177cm và bé Bé
            Gái là: 163,5cm)
          </p>
          <p className="text-grayscale-60">
            • Con có thể không đạt được chiều cao dự đoán nếu bị ảnh hưởng bởi những thói quen sinh hoạt xấu
          </p>
          <p className="text-grayscale-60">
            • Con có thể tăng thêm 7 - 15cm so với dự đoán khi trưởng thành nếu bố mẹ giúp con áp dụng giải pháp tăng
            chiều cao của Lamin
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#198754]">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-grayscale-60">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

