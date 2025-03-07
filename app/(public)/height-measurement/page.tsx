import type { Metadata } from "next"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import HeightMeasurementForm from "@/features/height-measurement/components/HeightMeasurementForm"

export const metadata: Metadata = {
  title: "Đo Cao - Elena Pharmacy",
  description: "Công cụ đo và dự đoán chiều cao cho trẻ em",
}

export default function HeightMeasurementPage() {
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Trang Chủ", href: "/" }, { label: "Đo Cao" }]} />

      {/* Title Section */}
      <div className="mb-6">
        <h1 className="mb-2 text-[28px] font-bold text-grayscale-90">Hướng dẫn chiều cao</h1>
        <p className="text-base text-[#6C757D]">Hãy nhập thông tin dưới đây để nhận phân tích chi tiết</p>
      </div>

      {/* Form Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <HeightMeasurementForm />
      </div>
    </>
  )
}

