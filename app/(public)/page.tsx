import type { Metadata } from "next"
import SimpleBanner from "@/features/homepage/components/SimpleBanner"
import GridBanner from "@/features/homepage/components/GridBanner"
import BestSellingProducts from "@/features/homepage/components/BestSellingProducts"
import CoachExperts from "@/features/homepage/components/CoachExperts"
import DealSlider from "@/features/homepage/components/DealSlider"
import FeatureShortcuts from "@/features/homepage/components/FeatureShortcuts"
import HealthNews from "@/features/homepage/components/HealthNews"
import TrustedStores from "@/features/homepage/components/TrustedStores"

export const metadata: Metadata = {
  title: "Elena Pharmacy - Nhà thuốc trực tuyến của bạn",
  description: "Mua thuốc trực tuyến, nhận tư vấn sức khỏe và nhiều dịch vụ khác tại Elena Pharmacy",
  keywords: ["nhà thuốc", "thuốc", "sức khỏe", "tư vấn sức khỏe", "mua thuốc online"],
}

// fix giao diện của HomePage để giống như trong figma
// Phạm vi chỉnh sửa: HomePage và các component nằm trong features/homepage/components và hooks
// Không dùng barrel export của index.ts ở thời điểm hiện tại
// Lấy sử dụng các màu và fonts từ tailwind.config.js và globals.css

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Banners */}
      <SimpleBanner />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 py-6">
          {/* Grid Banner Section */}
          <section>
            <GridBanner />
          </section>

          {/* Feature Shortcuts */}
          <section>
            <FeatureShortcuts />
          </section>

          {/* Deal Slider Section */}
          <section>
            <DealSlider />
          </section>

          {/* Best Selling Products */}
          <section>
            <BestSellingProducts />
          </section>

          {/* Coach Experts Section */}
          <section>
            <CoachExperts />
          </section>

          {/* Health News Section */}
          <section>
            <HealthNews />
          </section>

          {/* Trusted Stores Section */}
          <section>
            <TrustedStores />
          </section>
        </div>
      </div>
    </div>
  )
}

