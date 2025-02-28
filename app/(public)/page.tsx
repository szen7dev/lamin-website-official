import type { Metadata } from "next"
import {
  BannerSlider,
  BestSellingProducts,
  CoachExperts,
  CommitmentsSection,
  DealSlider,
  FeatureShortcuts,
  HealthNews,
  QRCodeSection,
  TrustedShopsShowcase,
} from "@/features/homepage"
import { generateMetadata } from "@/components/seo"

export const metadata: Metadata = generateMetadata({
  title: "Elena - Mua Thuốc Online Chính Hãng, Tư Vấn Sức Khỏe Chuyên Nghiệp",
  description:
    "Elena Pharmacy - Hệ thống nhà thuốc uy tín cung cấp dịch vụ mua thuốc online chính hãng, tư vấn sức khỏe chuyên nghiệp và đo chiều cao, kiểm tra dinh dưỡng.",
  keywords: "nhà thuốc, thuốc online, tư vấn sức khỏe, elena pharmacy, đo chiều cao, kiểm tra dinh dưỡng",
})

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Banner Slider Section */}
        <section className="w-full">
          <BannerSlider />
        </section>

        {/* QR Code Section */}
        <section className="w-full py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <QRCodeSection />
          </div>
        </section>

        {/* Feature Shortcuts Section */}
        <section className="w-full py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Tính Năng Nổi Bật</h2>
            <FeatureShortcuts />
          </div>
        </section>

        {/* Deal Slider Section */}
        <section className="w-full py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Ưu Đãi Đặc Biệt</h2>
            <DealSlider />
          </div>
        </section>

        {/* Best Selling Products Section */}
        <section className="w-full py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Sản Phẩm Bán Chạy</h2>
            <BestSellingProducts />
          </div>
        </section>

        {/* Coach Experts Section */}
        <section className="w-full py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Chuyên Gia Coach Sức Khỏe</h2>
            <CoachExperts />
          </div>
        </section>

        {/* Health News Section */}
        <section className="w-full py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Góc Tin Tức Sức Khỏe</h2>
            <HealthNews />
          </div>
        </section>

        {/* Commitments Section */}
        <section className="w-full py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Cam Kết Của Chúng Tôi</h2>
            <CommitmentsSection />
          </div>
        </section>

        {/* Trusted Shops Showcase Section */}
        <section className="w-full py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Hệ Thống Shop Uy Tín</h2>
            <TrustedShopsShowcase />
          </div>
        </section>
      </main>
    </div>
  )
}

