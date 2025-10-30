'use client';

import { useMemo } from 'react';

import SimpleBanner from '@/features/homepage/components/SimpleBanner';
import BringSection from '@/features/homepage/components/BringSection';
import DoctorSection from '@/features/homepage/components/DoctorSection';
import FourPillars from '@/features/homepage/components/FourPillars';
import ScientificEvidence from '@/features/homepage/components/ScientificEvidence';
import { useGetHeroBlogLink } from '@/features/homepage/hooks/banner/useGetHeroBlogLink';

const HERO_CATEGORY_ID = '680019100d8352001f52890d';

export default function HeroWithBringSection() {
  // Fetch hero blog link once - this will be shared by both SimpleBanner and BringSection
  const { blogSlug } = useGetHeroBlogLink({
    categoryID: HERO_CATEGORY_ID,
    limit: 2,
    optionSeller: 1,
  });

  // Memoize the href to prevent unnecessary recalculations
  const blogHref = useMemo(() => {
    return blogSlug ? `/bai-viet/${blogSlug}` : '/do-cao';
  }, [blogSlug]);

  return (
    <>
      {/* Hero Banner */}
      <SimpleBanner blogHref={blogHref} />

      {/* Doctor Section */}
      <section aria-labelledby="doctor-heading" className="w-full">
        <h2 className="sr-only" id="doctor-heading">
          Tiến sĩ Lê Thị Thu Hương
        </h2>
        <DoctorSection />
      </section>

      {/* Four Pillars Section */}
      <section aria-labelledby="pillars-heading" className="w-full">
        <h2 className="sr-only" id="pillars-heading">
          Bốn trụ cột của giải pháp LaminGrow
        </h2>
        <FourPillars />
      </section>

      {/* Scientific Evidence Section */}
      <section aria-labelledby="evidence-heading" className="w-full">
        <h2 className="sr-only" id="evidence-heading">
          Bằng chứng khoa học của LaminGrow
        </h2>
        <ScientificEvidence />
      </section>

      {/* Bring Section - comes after Scientific Evidence */}
      <BringSection blogHref={blogHref} />
    </>
  );
}
