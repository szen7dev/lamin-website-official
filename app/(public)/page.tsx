import type { Metadata } from 'next';

import dynamic from 'next/dynamic';

// import GridBanner from '@/features/homepage/components/GridBanner';
import BestSellingProducts from '@/features/menu/components/BestSellingProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import SimpleBanner from '@/features/homepage/components/SimpleBanner';

// Client components with interactivity - load without SSR to avoid hydration issues
// const FeatureShortcuts = dynamic(
//   () => import('@/features/homepage/components/FeatureShortcuts'),
//   {
//     ssr: true,
//     loading: () => (
//       <div className="h-24 w-full animate-pulse bg-gray-100 rounded-lg" />
//     ),
//   },
// );

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
  title: 'Lamin-Nâng chiều cao Dựng tầm vóc Việt',
  description: 'Khát vọng Nâng chiều cao Dựng tầm vóc Việt',
  keywords: [
    'cửa hàng thực phẩm bảo vệ sức khỏe',
    'thực phẩm bảo vệ sức khỏe',
    'sức khỏe',
    'tư vấn sức khỏe',
    'mua thực phẩm bảo vệ sức khỏe online',
  ],
});

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section with Banner - Server Component for immediate display */}
      <section aria-labelledby="hero-heading" className="w-full">
        <SimpleBanner />
      </section>

      {/* Promotions - Server Component for immediate display */}
      {/* <section
        aria-labelledby="promotions-heading"
        className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="sr-only" id="promotions-heading">
          Ưu đãi nổi bật
        </h2>
        <GridBanner />
      </section> */}

      {/* Feature Shortcuts - Client Component for interactivity */}
      {/* <section
        aria-labelledby="shortcuts-heading"
        className="container mx-auto px-3 sm:px-4">
        <h2 className="sr-only" id="shortcuts-heading">
          Truy cập nhanh
        </h2>
        <FeatureShortcuts />
      </section> */}

      {/* Health News - Server Component for SEO */}
      <section className="container mx-auto px-3 sm:px-4 sm:py-5 min-h-[500px] sm:min-h-0">
        <HealthNews />
      </section>

      {/* Coach Experts - Server Component for SEO */}
      <section
        aria-labelledby="coaches-heading"
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-5 min-h-[450px] sm:min-h-0">
        <h2 className="sr-only" id="coaches-heading">
          Chuyên gia tư vấn
        </h2>
        <CoachExperts />
      </section>

      {/* Deal Slider - Client Component for carousel */}
      <section
        aria-labelledby="deals-heading"
        className="container mx-auto px-3 sm:px-4">
        <h2 className="sr-only" id="deals-heading">
          Ưu đãi hấp dẫn
        </h2>
        <DealSlider />
      </section>

      {/* Best Selling Products - Server Component for SEO */}
      <section
        aria-labelledby="bestselling-heading"
        className="container mx-auto px-3 sm:px-4 sm:py-0">
        <h2 className="sr-only" id="bestselling-heading">
          Sản phẩm bán chạy
        </h2>
        <BestSellingProducts />
      </section>

      {/* Trusted Stores - Client Component for carousel */}
      <section
        aria-labelledby="trusted-stores-heading"
        // className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        className="sm:container sm:mx-auto sm:px-4 py-6 sm:py-5">
        <h2 className="sr-only" id="trusted-stores-heading">
          Cửa hàng uy tín
        </h2>
        <TrustedStores />
      </section>
    </div>
  );
}
