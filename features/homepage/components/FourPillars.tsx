import Image from 'next/image';

interface Pillar {
  number: number;
  image: string;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    number: 1,
    image: '/images/sample-product.png',
    title: 'LaminGrow',
    description:
      'LaminGrow, cung cấp canxi và hệ khoáng chất chiết tách từ sữa tươi, kết hợp với kẽm sinh học. Vitamin D3, vitamin K2, giúp tăng hấp thu, hỗ trợ phát triển hệ xương và cải thiện hệ miễn dịch ở trẻ nhỏ',
  },
  {
    number: 2,
    image: '/images/cdc-tool.png',
    title: 'CDC Tool',
    description:
      'Đánh giá chiều cao, đường phân vị và dự đoán chiều cao khi trưởng thành theo WHO - dựa trên dữ liệu CDC Hoa Kỳ - Trung tâm kiểm soát và phòng ngừa dịch bệnh, giúp cha mẹ có hành động từ sớm',
  },
  {
    number: 3,
    image: '/images/habit-app.png',
    title: 'App Habit',
    description:
      'Hỗ trợ thiết lập và duy trì thói quen tích cực, ăn uống đầy đủ, vận động hợp lý, ngủ đúng giờ là 3 yếu tố ảnh hưởng trực tiếp đến chiều cao của con',
  },
  {
    number: 4,
    image: '/images/sample-doctor.png',
    title: 'Đội ngũ chuyên môn',
    description:
      'Đội ngũ dược sĩ chuyên môn trực tiếp hướng dẫn cha mẹ cách theo dõi, điều chỉnh và chăm sóc con đúng giờ theo từng giai đoạn phát triển đảm bảo lộ trình tăng chiều cao',
  },
];

export default function FourPillars() {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0052A4] mb-4">
              Bốn trụ cột của giải pháp LaminGrow
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-[900px] mx-auto">
              Canxi muốn phát huy hiệu quả, phải đi cùng với vitamin D3, K2 giúp
              gắn và vận chuyển canxi từ ruột vào trong máu và từ máu đi vào
              trong xương. Nếu thiếu D3, canxi không hấp thụ được. Tại Lamin,
              chúng tôi đã xây dựng một giải pháp giúp trẻ Tăng cao toàn diện
              không chỉ dựa trên sản phẩm mà là một hệ sinh thái gồm 4 Trụ cột
              dựa trên khoa học và thực tiễn
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pillars.map(pillar => (
              <div
                key={pillar.number}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 relative">
                {/* Number Badge - Positioned at top-left */}
                <div className="absolute -top-6 left-5">
                  <div className="w-12 h-12 rounded-full bg-[#0099F9] flex items-center justify-center shadow-md">
                    <span className="text-white text-xl font-bold">
                      {pillar.number}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="flex justify-center mb-6 mt-4">
                  <div className="relative w-32 h-32">
                    <Image
                      fill
                      alt={pillar.title}
                      className="object-contain"
                      sizes="128px"
                      src={pillar.image}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-4">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
