'use client';

import { useGetArticleTagList } from '@/features/article/hooks/useGetArticleTagList';
import { Hexagon } from 'lucide-react';
import Image from 'next/image';

export default function BrandingStoryClient() {
  const { articlesTags } = useGetArticleTagList({
    limit: 2,
    categoryID: '680019100d8352001f52890d',
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full">
          <Image
            alt="LaminGrow - Cho một đại trạng khỏe mạnh"
            className="object-cover"
            fill
            priority
            quality={100}
            src="/images/brand-story/brand-story-background.png"
          />
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">
                Câu Chuyện Thương Hiệu
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-grayscale-90 mb-4">
                Từ tâm huyết cá nhân đến sứ mệnh khoa học
              </h3>
              <p className="text-base sm:text-lg text-grayscale-70 leading-relaxed mb-4">
                LaminGrow ra đời từ câu chuyện thực tế đầy xúc động của Nhà sáng
                lập - Tiến sĩ, Dược sĩ Lê Thị Thu Hường. Bắt nguồn từ những kỷ
                ức tuổi thơ hải lã mơ giúp mẹ giảm đau đại trạng và chứng kiến
                người thân phải vật lộn với các vấn đề về đại trạng, Tiến sĩ
                Hường đã nuôi dưỡng một trăn trở khoa học sâu sắc: &quot;Phải có
                một giải pháp tự nhiên và hiệu quả hơn cho người Việt Nam.&quot;
              </p>
              <div className="inline-block mt-4">
                <a
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
                  href={`/bai-viet/${articlesTags[1].slug}`}>
                  XEM THÊM
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-square">
                <Image
                  alt="Tiến sĩ, Dược sĩ Lê Thị Thu Hường"
                  className="object-contain"
                  fill
                  src="/images/brand-story/brand-story-doctor.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Discovery Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-3 sm:mb-4">
            Đột phá khoa học: Synbiotic bản địa
          </h2>

          {/* 4 Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {/* Synbiotic Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    alt="Lợi khuẩn bản địa"
                    className="object-contain"
                    fill
                    src="/images/brand-story/symbiotic.png"
                  />
                </div>
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Lợi khuẩn bản địa (Lactobacillus casei) được tuyển chọn từ đại
                trạng người Việt
              </h3>
            </div>

            {/* Chemistry Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    alt="Công nghệ Micap"
                    className="object-contain"
                    fill
                    src="/images/brand-story/chemistry.png"
                  />
                </div>
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Công nghệ Micap hướng dịch bảo vệ lợi khuẩn với tỷ lệ sống sót
                {'>'}90%
              </h3>
            </div>

            {/* Lab Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    alt="Thảo dược truyền thống"
                    className="object-contain"
                    fill
                    src="/images/brand-story/lab.png"
                  />
                </div>
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Thảo dược truyền thống như cao lá mơ tam thế và L-Theanin từ trà
                xanh
              </h3>
            </div>

            {/* DNA Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    alt="Prebiotic"
                    className="object-contain"
                    fill
                    src="/images/brand-story/DNA.png"
                  />
                </div>
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Prebiotic tự nhiên (FOS, maltodextrin kháng) nuôi dưỡng lợi
                khuẩn
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Target Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Vision */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-6">
                <div className="relative w-32 h-32">
                  <Hexagon
                    className="w-full h-full text-white/20"
                    fill="currentColor"
                    strokeWidth={2}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold leading-tight">
                      TẦM
                    </span>
                    <span className="text-2xl font-bold leading-tight">
                      NHÌN
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-white/90 leading-relaxed">
                  Phát triển Lamin thành thương hiệu hàng đầu trong lĩnh vực
                  thực phẩm bảo vệ sức khỏe đại trạng, ứng dụng nguồn thảo dược
                  Việt Nam kết hợp công nghệ sinh học tiên tiến, góp phần nâng
                  tầm ngành dược Việt Nam trên bản đồ thế giới.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-6">
                <div className="relative w-32 h-32">
                  <Hexagon
                    className="w-full h-full text-white/20"
                    fill="currentColor"
                    strokeWidth={2}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold leading-tight">SỨ</span>
                    <span className="text-2xl font-bold leading-tight">
                      MỆNH
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-white/90 leading-relaxed">
                  Kế thừa thành tựu y học bản địa và tinh hoa thảo dược Việt
                  Nam, kết hợp ứng dụng công nghệ hướng dịch hiện đại để mang
                  lại giải pháp hỗ trợ chăm sóc đại trạng an toàn, hiệu quả và
                  phù hợp với thể trạng người Việt.
                </p>
              </div>
            </div>

            {/* Core Value */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-6">
                <div className="relative w-32 h-32">
                  <Hexagon
                    className="w-full h-full text-white/20"
                    fill="currentColor"
                    strokeWidth={2}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold leading-tight">
                      GIÁ TRỊ
                    </span>
                    <span className="text-xl font-bold leading-tight">
                      CỐT LÕI
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-white/90 leading-relaxed">
                  Lãnh tính tự nhiên. Hỗ trợ dựa trên bằng chứng khoa học. Công
                  nghệ tiên tiến bản địa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full h-[300px] sm:h-[400px]">
        <Image
          alt="LaminGrow - Viên lợi khuẩn bản địa"
          className="object-cover"
          fill
          quality={100}
          src="/images/brand-story/background-2.png"
        />
      </div>

      {/* Quality Promise Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-3 sm:mb-4">
            Cam kết chất lượng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mt-8 sm:mt-12">
            {/* Research Card */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <Image
                    alt="Nghiên cứu khoa học uy tín"
                    className="object-contain"
                    fill
                    src="/images/brand-story/research.png"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-grayscale-90 mb-4">
                Nghiên cứu khoa học uy tín
              </h3>
              <ul className="text-left text-grayscale-70 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Nghiên cứu căn lâm sàng tại Đại học Y Dược - Đại học Quốc
                    gia Hà Nội
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Công bố trên Tạp chí Y Dược Cổ Truyền Việt Nam (2019)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Được thẩm định bởi các chuyên gia hàng đầu trong lĩnh vực
                  </span>
                </li>
              </ul>
            </div>

            {/* Quality Card */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <Image
                    alt="Sản xuất đạt chuẩn quốc tế"
                    className="object-contain"
                    fill
                    src="/images/brand-story/quality.png"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-grayscale-90 mb-4">
                Sản xuất đạt chuẩn quốc tế
              </h3>
              <ul className="text-left text-grayscale-70 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Sản xuất tại cơ sở đạt chuẩn GMP (Good Manufacturing
                    Practice)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Kiểm soát chất lượng nghiêm ngặt từ nguyên liệu đến thành
                    phẩm
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Tuân thủ đầy đủ các quy định của Cục An toàn thực phẩm - Bộ
                    Y tế
                  </span>
                </li>
              </ul>
            </div>

            {/* Information Card */}
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <Image
                    alt="Minh bạch thông tin"
                    className="object-contain"
                    fill
                    src="/images/brand-story/information.png"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-grayscale-90 mb-4">
                Minh bạch thông tin
              </h3>
              <ul className="text-left text-grayscale-70 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Công khai đầy đủ thành phần và hàm lượng</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Cung cấp thông tin khoa học dễ hiểu cho người tiêu dùng
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tư vấn trực tiếp từ đội ngũ chuyên gia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
