import Image from 'next/image';
import Link from 'next/link';

import { VerifyIcon } from '@/components/icons';

interface BringSectionProps {
  blogHref: string;
}

const benefits = [
  {
    title: 'Phát triển chiều cao theo chuẩn WHO',
    description:
      'LaminGrow hỗ trợ con tăng trưởng theo đúng phần vị nhỏ bổ sung vi chất thiết yếu và hành vi khoa học mỗi ngày.',
    quote:
      'Cha mẹ thấy rõ tiến trình con lớn lên mỗi tháng - đúng theo tiêu chuẩn y khoa.',
  },
  {
    title: 'Cá nhân hóa theo độ tuổi và thể trạng',
    description:
      'Từng bé có lộ trình riêng - từ sản phẩm đến thói quen - được thiết kế phù hợp với độ tuổi và sinh lý tăng trưởng.',
    quote:
      'Cha mẹ không cần lo lắng "con mình có phù hợp không?" - đã có hệ thống cá nhân hóa hỗ trợ.',
  },
  {
    title: 'Kết hợp công nghệ - hành vi - y khoa',
    description:
      'Phần mềm do và dự đoán chiều cao CDC do Lamin phát triển giúp cha mẹ theo dõi tiến độ tăng trưởng, nhận cảnh báo và gợi ý điều chỉnh kịp thời.',
    quote:
      'Cha mẹ bắt ấp lực nhắc nhở, vận động hành sắt sao cùng con mỗi ngày.',
  },
  {
    title: 'Đồng hành cùng chuyên gia',
    description:
      'Cha mẹ không hành động một mình - có đội ngũ được sĩ và chuyên gia hỗ trợ suốt hành trình phát triển của con.',
    quote:
      'Cha mẹ không còn phải tự tìm hiểu một mình - cỏ người thật chuyên môn thật cùng đi.',
  },
];

export default function BringSection({ blogHref }: BringSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden lg:h-[840px]"
      style={{
        background:
          'linear-gradient(180deg, #00A8E8 0%, #0090C8 50%, #0078A8 100%)',
      }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          fill
          priority
          alt="Background"
          className="h-full w-full object-cover object-center opacity-30"
          src="/images/bring-background.png"
          style={{ objectPosition: 'center center' }}
        />
      </div>

      <div className="container relative z-10 mx-auto flex h-full min-h-[600px] items-center px-4 py-8 sm:px-6 lg:min-h-0 lg:px-8 lg:py-12">
        <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10 max-w-full overflow-hidden">
          {/* Left Column - Image */}
          <div className="flex items-center justify-center lg:justify-start min-w-0">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px] xl:h-[500px] xl:w-[500px]">
              <Image
                fill
                priority
                alt="LaminGrow - Phát triển chiều cao cho trẻ em"
                className="h-full w-full object-contain drop-shadow-2xl"
                src="/images/lamin-bring.png"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center text-white min-w-0">
            {/* Heading */}
            <h2 className="mb-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-[38px] xl:text-[42px]">
              LaminGrow mang lại điều gì cho con và cha mẹ?
            </h2>

            {/* Subheading */}
            <p className="mb-5 text-sm sm:text-base lg:text-lg">
              Chúng tôi không chỉ tăng chiều cao – chúng tôi xây hành trình lớn
              khôn an toàn
            </p>

            {/* Benefits List */}
            <div className="space-y-3 lg:space-y-3.5">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2.5">
                  {/* Icon */}
                  <div className="shrink-0 pt-0.5">
                    <VerifyIcon
                      className="text-green-400"
                      height="16"
                      width="16"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-1 text-base font-bold sm:text-lg lg:text-[19px]">
                      {benefit.title}
                    </h3>
                    <p className="mb-1 text-xs leading-relaxed sm:text-sm lg:text-[15px]">
                      {benefit.description}
                    </p>
                    <blockquote className="border-l-2 border-white/30 pl-3 text-xs italic opacity-90 sm:text-sm">
                      {benefit.quote}
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-5 lg:mt-6">
              <Link
                className="inline-block rounded-lg bg-[#FF8C00] px-8 py-3 text-center text-base font-semibold text-white transition-colors duration-200 hover:bg-[#FF7A00] md:text-lg"
                href={blogHref}>
                Khám phá hành trình tăng trưởng cho con bạn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
