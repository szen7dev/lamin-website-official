import { Breadcrumb } from "@/components/ui/Breadcrumb"
import NutritionCheckResult from "@/features/nutrition-check/components/NutritionCheckResult"

export default async function NutritionCheckResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  // Await the searchParams object before accessing its properties
  const params = await searchParams
  const resultId = params.id

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-12 pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Trang Chủ", href: "/" },
            { label: "Kiểm Tra Dinh Dưỡng", href: "/nutrition-check" },
            { label: "Kết quả phân tích" },
          ]}
        />

        {/* Main Content */}
        <div className="mx-auto max-w-xl">
          <NutritionCheckResult resultId={resultId} />
        </div>
      </div>
    </div>
  )
}

