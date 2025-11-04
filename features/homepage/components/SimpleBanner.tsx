import Image from 'next/image';
import Link from 'next/link';

interface SimpleBannerProps {
  blogHref: string;
}

export default function SimpleBanner({ blogHref }: SimpleBannerProps) {
  return (
    <section className="w-full bg-[#0066A6] overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[1440px] mx-auto">
          {/* Left Content */}
          <div className="shrink-0 text-white text-center max-w-[600px] w-full mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] font-bold mb-6 leading-normal lg:leading-[1.4] text-center">
              TẬN TÂM KIẾN TẠO CHIỀU CAO CHÍNH TRỰC NUÔI DƯỠNG TƯƠNG LAI
            </h1>

            <p className="text-base md:text-lg mb-8 leading-relaxed text-center">
              LaminGrow tin rằng mọi trẻ em xứng đáng phát triển chiều cao khoa
              học, tự nhiên và đúng thời điểm. Không chạy theo hiệu quả tức thì,
              Lamin kiên định cá nhân hoá giải pháp, kết hợp với vi chất – hành
              vi – công nghệ, đồng hành minh bạch và tận tâm cùng phụ huynh.
            </p>

            <div className="flex justify-center">
              <Link
                className="inline-block bg-[#FFA500] hover:bg-[#FF8C00] text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base md:text-lg shadow-lg"
                href={blogHref}>
                Tìm giải pháp cho con tôi
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="shrink-0 w-full max-w-[500px] lg:max-w-[600px]">
            <Image
              priority
              alt="Lamin Family"
              className="w-full h-auto"
              height={500}
              loading="eager"
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 600px, 600px"
              src="/images/hero-image-1.png"
              style={{ height: 'auto' }}
              width={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
