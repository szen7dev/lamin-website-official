import type { Metadata } from 'next'

import Image from 'next/image'

import GridBanner from '@/features/homepage/components/GridBanner'
import BestSellingProducts from '@/features/homepage/components/BestSellingProducts'
import CoachExperts from '@/features/homepage/components/CoachExperts'
import DealSlider from '@/features/homepage/components/DealSlider'
import HealthNews from '@/features/homepage/components/HealthNews'
import TrustedStores from '@/features/homepage/components/TrustedStores'

export const metadata: Metadata = {
  title: 'Elena Pharmacy - Nhà thuốc trực tuyến của bạn',
  description:
    'Mua thuốc trực tuyến, nhận tư vấn sức khỏe và nhiều dịch vụ khác tại Elena Pharmacy',
  keywords: ['nhà thuốc', 'thuốc', 'sức khỏe', 'tư vấn sức khỏe', 'mua thuốc online'],
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f1f4fd]">
      {/* Hero Section with Banners */}
      {/* <SimpleBanner /> */}
      <Image
        alt="Hero Banner"
        className="w-full hidden md:block"
        height={400}
        src="/images/Banner 1.png"
        width={1200}
      />

      <div className="mx-auto max-w-[1400px] px-4">
        <div className="space-y-8 py-6">
          {/* Grid Banner Section */}
          <section className="container mx-auto px-4 py-6">
            <GridBanner />
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
        </div>
      </div>
    </div>
  )
}
