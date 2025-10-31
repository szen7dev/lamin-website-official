import Image from 'next/image';
import Link from 'next/link';

const SPONSORS_LINK =
  'https://suckhoe.vtv.vn/lamingrow-minh-bach-chat-luong-khang-dinh-cam-ket-vi-suc-khoe-tre-em-viet-102250722141954952.htm';

const sponsors = [
  {
    name: 'Vinmec',
    logo: '/images/sponsors/vinmec.png',
    width: 100,
    height: 45,
  },
  {
    name: 'VTV Sức khỏe',
    logo: '/images/sponsors/vtv.png',
    width: 90,
    height: 38,
  },
  {
    name: 'Eva',
    logo: '/images/sponsors/eva.png',
    width: 90,
    height: 38,
  },
  {
    name: 'Sức khỏe & Đời sống',
    logo: '/images/sponsors/suc-khoe.png',
    width: 110,
    height: 40,
  },
  {
    name: 'Phụ nữ & Tiếp thị',
    logo: '/images/sponsors/phu-nu.png',
    width: 110,
    height: 38,
  },
];

export default function VideoWithSponsors() {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:mb-12 md:text-3xl lg:text-4xl">
          Hành trình tăng chiều cao
          <br />
          của bé sử dụng LaminGrow
        </h2>

        {/* Video Container */}
        <div className="mx-auto mb-12 max-w-4xl md:mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gray-200 shadow-xl">
            {/* 16:9 Aspect Ratio */}
            <div className="relative pb-[56.25%]">
              <iframe
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute left-0 top-0 h-full w-full"
                src="https://www.youtube.com/embed/oi17t9sGxzk"
                title="Hành trình tăng chiều cao của bé sử dụng LaminGrow"
              />
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {sponsors.map(sponsor => (
            <Link
              key={sponsor.name}
              className="flex items-center justify-center transition-all duration-300"
              href={SPONSORS_LINK}
              rel="noopener noreferrer"
              target="_blank">
              <Image
                alt={sponsor.name}
                className="h-auto w-auto object-contain"
                height={sponsor.height}
                src={sponsor.logo}
                width={sponsor.width}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
