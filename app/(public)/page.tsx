import type { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import HeroWithBringSection from '@/features/homepage/components/HeroWithBringSection';
import TestimonialsSection from '@/features/homepage/components/TestimonialsSection';
import VideoWithSponsors from '@/features/homepage/components/VideoWithSponsors';
import ProductsSection from '@/features/homepage/components/ProductsSection';
import CertificationSection from '@/features/homepage/components/CertificationSection';
import PartnersSection from '@/features/homepage/components/PartnersSection';

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
      {/* Hero, Doctor, Pillars, Scientific Evidence, and Bring Sections - Client Component */}
      <HeroWithBringSection />

      {/* Testimonials Section - Client Component */}
      <section aria-labelledby="testimonials-heading" className="w-full">
        <h2 className="sr-only" id="testimonials-heading">
          Hành trình người thật
        </h2>
        <TestimonialsSection />
      </section>

      {/* Video with Sponsors Section */}
      <section aria-labelledby="video-sponsors-heading" className="w-full">
        <h2 className="sr-only" id="video-sponsors-heading">
          Video hành trình tăng chiều cao
        </h2>
        <VideoWithSponsors />
      </section>

      {/* Products Section - Client Component */}
      <section aria-labelledby="products-heading" className="w-full">
        <h2 className="sr-only" id="products-heading">
          Sản phẩm Lamin
        </h2>
        <ProductsSection />
      </section>

      {/* Certification Section */}
      <section aria-labelledby="certification-heading" className="w-full">
        <h2 className="sr-only" id="certification-heading">
          Chứng nhận GMP-WHO
        </h2>
        <CertificationSection />
      </section>

      {/* Partners Section */}
      <section aria-labelledby="partners-heading" className="w-full">
        <h2 className="sr-only" id="partners-heading">
          Hợp tác và phân phối
        </h2>
        <PartnersSection />
      </section>
    </div>
  );
}
