import HeightMeasurementResult from "@/features/height-measurement/components/HeightMeasurementResult"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default function HeightMeasurementResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const resultId = searchParams.id

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Trang Chủ", href: "/" },
            { label: "Đo Cao", href: "/height-measurement" },
            { label: "Kết quả phân tích" },
          ]}
        />

        {/* Main Content - Wider container for the chart */}
        <div className="mx-auto max-w-[1000px] rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-grayscale-90">Kết quả phân tích đo cao</h1>
          <p className="mb-6 text-grayscale-60">Dựa vào thông tin được cung cấp, bạn có thể tham khảo</p>

          <HeightMeasurementResult resultId={resultId} />
        </div>
      </div>
    </div>
  )
}

