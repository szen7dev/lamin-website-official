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
        <div className="relative w-full">
          <Image
            alt="LaminGrow - Cho một đại trạng khỏe mạnh"
            className="w-full h-auto"
            width={1440}
            height={500}
            priority
            quality={100}
            src="/images/Artboard_6.jpg"
          />
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F5F5F5]">
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
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-3 sm:mb-4">
            Tinh chất sữa hướng đích xương giúp trẻ cao lớn vượt chuẩn
          </h2>

          {/* 4 Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {/* Synbiotic Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  alt="Lợi khuẩn bản địa"
                  className="w-20 h-20"
                  width={80}
                  height={80}
                  src="/images/Artboard_2.jpg"
                />
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Nguyên liệu được nhập từ các thương hiệu hàng đầu thế giới
              </h3>
            </div>

            {/* Chemistry Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  alt="Công nghệ Micap"
                  className="w-20 h-20"
                  width={80}
                  height={80}
                  src="/images/Artboard_3.jpg"
                />
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Bổ sung đầy đủ vi chất cho trẻ: D3, K2, Canxi và hệ khoáng chất
                (Canxi hướng đích xương)
              </h3>
            </div>

            {/* Lab Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  alt="Thảo dược truyền thống"
                  className="w-20 h-20"
                  width={80}
                  height={80}
                  src="/images/Artboard_4.jpg"
                />
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Kết quả kiểm nghiệm 30 tháng (gần hết vòng đời sử dụng của sản
                phẩm) đạt yêu cầu
              </h3>
            </div>

            {/* DNA Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  alt="Prebiotic"
                  className="w-20 h-20"
                  width={80}
                  height={80}
                  src="/images/Artboard_5.jpg"
                />
              </div>
              <h3 className="text-center font-semibold text-grayscale-90 mb-2">
                Nhiều trẻ đã có kết quả chiều cao vượt mong đợi của ba mẹ nhờ áp
                dụng sản phẩm và giải pháp của LaminGrow
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
            <div className="flex items-center justify-center gap-4 md:text-left">
              <div className="inline-block">
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
                  LaminGrow sẽ là thương hiệu “Top of Mind” trong tâm trí khách
                  hàng về giải pháp tăng cao trong vòng 5 năm.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="flex text-center items-center gap-4 justify-center md:text-left">
              <div className="inline-block">
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
                  Tiên phong nâng tầm vóc trẻ Việt theo chuẩn WHO, bằng mô hình
                  chăm sóc chiều cao kết hợp dinh dưỡng, vận động và giấc ngủ
                  chuẩn khoa học
                </p>
              </div>
            </div>

            {/* Core Value */}
            <div className="flex text-center items-center gap-4 justify-center md:text-left">
              <div className="inline-block">
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
                  An toàn, lành tính tự nhiên, không gây tác dụng phụ. Giải pháp
                  dựa trên chuẩn khoa học
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full">
        <Image
          alt="LaminGrow - Viên lợi khuẩn bản địa"
          className="w-full h-auto"
          width={1440}
          height={400}
          quality={100}
          src="/images/Artboard_1.jpg"
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
              <h3 className="text-xl font-bold text-black mb-4">
                Nghiên cứu khoa học uy tín
              </h3>
              <ul className="text-left text-black space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Nghiên cứu cận lâm sàng tại Glanbia (2019)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Nghiên cứu độ ổn định được Công bố trên tạp chí Molecules 24.5 (2019)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Nghiên cứu cận lâm sàng và lâm sàng được Công bố trên tạp chí Biol Trace Elem Res (2007)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Nghiên cứu cận lâm sàng tại Viện Công nghệ sinh học - Viện Hàn Lâm Khoa học công nghệ Việt Nam
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
              <h3 className="text-xl font-bold text-black mb-4">
                Sản xuất đạt chuẩn quốc tế
              </h3>
              <ul className="text-left text-black space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Sản xuất tại cơ sở đạt chuẩn GMP (Nhà máy Dược Khoa)
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
              <h3 className="text-xl font-bold text-black mb-4">
                Minh bạch thông tin
              </h3>
              <ul className="text-left text-black space-y-2">
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
