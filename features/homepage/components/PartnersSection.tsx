import Image from 'next/image';

const partners = [
  {
    name: 'HKCare',
    logo: '/images/stores/hkcare.png',
    width: 180,
    height: 60,
  },
  {
    name: 'Michi Baby',
    logo: '/images/stores/michi-baby.png',
    width: 80,
    height: 80,
  },
  {
    name: 'Baby Sun',
    logo: '/images/stores/baby-sun.png',
    width: 80,
    height: 80,
  },
  {
    name: 'Bababibi',
    logo: '/images/stores/bababibi.png',
    width: 80,
    height: 80,
  },
  {
    name: 'Hồng Sơn Baby',
    logo: '/images/stores/hong-son.png',
    width: 80,
    height: 80,
  },
];

export default function PartnersSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
          Hợp tác và phân phối LaminGrow
        </h2>

        {/* Subtitle */}
        <p className="mb-10 text-center text-base md:mb-12 md:text-lg lg:mb-16">
          Cốm canxi sữa hướng đích xương tăng chiều cao toàn diện cho trẻ
        </p>

        {/* Partners Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {partners.map(partner => (
            <div
              key={partner.name}
              className="flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Image
                alt={partner.name}
                className="h-auto w-auto object-contain"
                height={partner.height}
                src={partner.logo}
                width={partner.width}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
