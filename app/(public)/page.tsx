import type { Metadata } from 'next';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import SimpleBanner from '@/features/homepage/components/SimpleBanner';
import GridBanner from '@/features/homepage/components/GridBanner';
import BestSellingProducts from '@/features/homepage/components/BestSellingProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

// Client components with interactivity - load without SSR to avoid hydration issues
const FeatureShortcuts = dynamic(
  () => import('@/features/homepage/components/FeatureShortcuts'),
  {
    ssr: true,
    loading: () => (
      <div className="h-24 w-full animate-pulse bg-gray-100 rounded-lg" />
    ),
  },
);

const DealSlider = dynamic(
  () => import('@/features/homepage/components/DealSlider'),
  {
    ssr: true,
    loading: () => (
      <div className="rounded-xl overflow-hidden bg-gradient-1 p-4 min-h-[200px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ),
  },
);

const TrustedStores = dynamic(
  () => import('@/features/homepage/components/TrustedStores'),
  {
    ssr: true,
    loading: () => <LoadingSpinner />,
  },
);

// Server components with important content - use SSR for SEO benefits
const CoachExperts = dynamic(
  () => import('@/features/homepage/components/CoachExperts'),
  {
    ssr: true,
    loading: () => <LoadingSpinner />,
  },
);

const HealthNews = dynamic(
  () => import('@/features/homepage/components/HealthNews'),
  {
    ssr: true,
    loading: () => <LoadingSpinner />,
  },
);

export const metadata: Metadata = generateSeoMetadata({
  title: 'Elena Pharmacy - Nhà thuốc trực tuyến của bạn',
  description:
    'Mua thuốc trực tuyến, nhận tư vấn sức khỏe và nhiều dịch vụ khác tại Elena Pharmacy',
  keywords: [
    'nhà thuốc',
    'thuốc',
    'sức khỏe',
    'tư vấn sức khỏe',
    'mua thuốc online',
  ],
});

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero Section with Banner - Server Component for immediate display */}
      <section aria-labelledby="hero-heading" className="w-full">
        <h2 className="sr-only" id="hero-heading">
          Khuyến mãi đặc biệt
        </h2>
        <SimpleBanner />
      </section>

      {/* Promotions - Server Component for immediate display */}
      <section
        aria-labelledby="promotions-heading"
        className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="sr-only" id="promotions-heading">
          Ưu đãi nổi bật
        </h2>
        <GridBanner />
      </section>

      {/* Feature Shortcuts - Client Component for interactivity */}
      <section
        aria-labelledby="shortcuts-heading"
        className="container mx-auto px-3 sm:px-4">
        <h2 className="sr-only" id="shortcuts-heading">
          Truy cập nhanh
        </h2>
        <Suspense
          fallback={
            <div className="h-24 w-full animate-pulse bg-gray-100 rounded-lg" />
          }>
          <FeatureShortcuts />
        </Suspense>
      </section>

      {/* Deal Slider - Client Component for carousel */}
      <section
        aria-labelledby="deals-heading"
        className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="sr-only" id="deals-heading">
          Ưu đãi hấp dẫn
        </h2>
        <Suspense
          fallback={
            <div className="rounded-xl overflow-hidden bg-gradient-1 p-4 min-h-[200px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
          <DealSlider />
        </Suspense>
      </section>

      {/* Best Selling Products - Server Component for SEO */}
      <section
        aria-labelledby="bestselling-heading"
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h2 className="sr-only" id="bestselling-heading">
          Sản phẩm bán chạy
        </h2>
        <BestSellingProducts />
      </section>

      {/* Coach Experts - Server Component for SEO */}
      <section
        aria-labelledby="coaches-heading"
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h2 className="sr-only" id="coaches-heading">
          Chuyên gia tư vấn
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <CoachExperts />
        </Suspense>
      </section>

      {/* Health News - Server Component for SEO */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <HealthNews />
        </Suspense>
      </section>

      {/* Trusted Stores - Client Component for carousel */}
      <section
        aria-labelledby="trusted-stores-heading"
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h2 className="sr-only" id="trusted-stores-heading">
          Cửa hàng uy tín
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <TrustedStores />
        </Suspense>
      </section>
    </main>
  );
}
