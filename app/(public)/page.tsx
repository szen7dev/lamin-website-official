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

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero Section with Banners */}
      <section className="w-full">
        <SimpleBanner />
      </section>
      <section className="container mx-auto px-4 py-6">
        <GridBanner />
      </section>

      {/* Feature Shortcuts */}
      <section className="container mx-auto px-4">
        <FeatureShortcuts />
      </section>

      {/* Deal Slider Section */}
      <section className="container mx-auto px-4 py-6">
        <DealSlider />
      </section>

      {/* Best Selling Products */}
      <section className="container mx-auto px-4 py-8">
        <BestSellingProducts />
      </section>

        {/* Coach Experts Section */}
      <section className="container mx-auto px-4 py-8">
        <CoachExperts />
      </section>

      {/* Health News Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-grayscale-90">Góc Sức Khỏe</h2>
        <HealthNews />
      </section>

      {/* Trusted Stores Section */}
      <section className="container mx-auto px-4 py-8">
        <TrustedStores />
      </section>
    </main>
  )
}

