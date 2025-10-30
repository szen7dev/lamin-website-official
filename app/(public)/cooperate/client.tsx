'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { useContactInfo } from '@/hooks/useContactInfo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSendBusinessForm } from '@/features/documents/hooks/useSendBusinessForm';
import { useToast } from '@/hooks/use-toast';

export function CooperateClient() {
  const { contactInfo } = useContactInfo();
  const [openItem, setOpenItem] = useState<string>('');
  const accordionItems: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }> = [
    {
      id: 'item-1',
      title: 'TẠI SAO LAMINGROW LÀ CƠ HỘI KINH DOANH TỐT?',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">
              Sản phẩm đã được thị trường chấp nhận
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nhiều khách hàng hài lòng sau 3 năm ra mắt</li>
              <li>Tỷ lệ tái mua cao - khách hàng quay lại mua liên tục</li>
              <li>
                Nhu cầu thực tế - tăng chiều cao cho con đang là nhu cầu lớn của
                ba mẹ đang quan tâm và tìm giải pháp cho con
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">
              Thị trường chăm sóc sức khỏe đang phát triển
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Thị trường TPBVSK Việt Nam đang tăng trưởng</li>
              <li>Phân khúc chăm sóc tiêu hóa có nhu cầu cao</li>
              <li>
                Xu hướng chăm sóc sức khỏe tự nhiên ngày càng được quan tâm
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'item-2',
      title: 'QUYỀN LỢI KHI TRỞ THÀNH ĐẠI LÝ LAMINGROW',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-base mb-2">
              1. HỖ TRỢ MARKETING TOÀN DIỆN
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Mục tiêu:</span> Hỗ trợ đại lý bán
              hàng hiệu quả
            </p>
            <p className="font-semibold mb-1">Chúng tôi cung cấp:</p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>
                Bộ tài liệu marketing chuyên nghiệp - flyer, poster, standee
              </li>
              <li>Kịch bản tư vấn hỗ trợ chốt đơn</li>
              <li>Video giới thiệu sản phẩm cho social media</li>
              <li>Hỗ trợ quảng bá trên các kênh chính thức của IBSoft</li>
              <li>Hỗ trợ thiết kế ấn phẩm theo yêu cầu</li>
            </ul>
            <p>
              <span className="font-semibold">Chính sách:</span> MIỄN PHÍ
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-2">
              2. ĐÀO TẠO CHUYÊN NGHIỆP
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Mục tiêu:</span> Nâng cao kiến
              thức và kỹ năng bán hàng
            </p>
            <p className="font-semibold mb-1">Chúng tôi cung cấp:</p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>
                Khóa học do các chuyên gia trong công ty trực tiếp giảng dạy
              </li>
              <li>Chứng chỉ tham gia khóa học</li>
              <li>Kỹ năng tư vấn chuyên nghiệp</li>
              <li>Cập nhật kiến thức định kỳ hàng tháng</li>
              <li>Hỗ trợ 24/7 với đội ngũ nhân viên</li>
            </ul>
            <p>
              <span className="font-semibold">Chính sách:</span> MIỄN PHÍ
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-2">
              3. CAM KẾT NGUỒN HÀNG & CHẤT LƯỢNG
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Mục tiêu:</span> Đảm bảo kinh
              doanh ổn định
            </p>
            <p className="font-semibold mb-1">Chúng tôi cam kết:</p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>Ưu tiên giao hàng trong 24h toàn quốc</li>
              <li>Chất lượng đồng nhất - sản xuất theo chuẩn GMP</li>
              <li>Chính sách đổi trả sản phẩm lỗi hoặc hết hạn</li>
              <li>Hỗ trợ dự báo nhu cầu giúp tối ưu tồn kho</li>
              <li>Hotline hỗ trợ cho đại lý</li>
            </ul>
            <p>
              <span className="font-semibold">Chính sách:</span> CAM KẾT THỰC
              HIỆN
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'item-3',
      title: 'HỖ TRỢ ĐẶC BIỆT CHO ĐẠI LÝ MỚI',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base mb-2">
              GÓI HỖ TRỢ KHỞI NGHIỆP:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sản phẩm demo để giới thiệu khách hàng</li>
              <li>Bộ standee và poster thiết kế chuyên nghiệp</li>
              <li>Hỗ trợ marketing trong thời gian đầu</li>
              <li>Tư vấn về khu vực kinh doanh</li>
            </ul>
            <p className="mt-4 text-sm italic">
              Điều kiện áp dụng có thể thay đổi theo chính sách công ty.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'item-4',
      title: 'CHÍNH SÁCH BẢO VỆ ĐẠI LÝ',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base mb-2">CAM KẾT CỦA CÔNG TY:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hỗ trợ tối đa trong 90 ngày đầu</li>
              <li>
                Hỗ trợ chuyển đổi nếu không phù hợp với sản phẩm khác của công
                ty
              </li>
              <li>Hỗ trợ pháp lý khi cần thiết</li>
              <li>Bảo hiểm trách nhiệm sản phẩm theo quy định</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'item-5',
      title: 'ĐĂNG KÝ TRỞ THÀNH ĐẠI LÝ',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base mb-2">THÔNG TIN SẢN PHẨM</h3>
            <p className="mb-4">
              LaminGrow-Cốm canxi sữa hướng đích xương cung cấp vi chất giúp con
              cao khỏe toàn diện. Với nhu cầu chăm sóc sức khỏe ngày càng cao,
              đây là cơ hội tốt để phát triển kinh doanh.
            </p>
            <p className="font-semibold mb-2">Lợi ích khi trở thành đại lý:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kinh doanh sản phẩm có nhu cầu thực tế</li>
              <li>Được hỗ trợ toàn diện từ công ty</li>
              <li>Xây dựng nguồn thu nhập ổn định</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const schema = z.object({
    name: z.string().min(1, 'Vui lòng nhập họ tên/đơn vị'),
    phone: z
      .string()
      .min(8, 'Số điện thoại không hợp lệ')
      .regex(/^[0-9+()\-\s]*$/, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
    note: z.string().optional().or(z.literal('')),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', address: '', note: '' },
  });
  const { mutateAsync } = useSendBusinessForm();
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ ...data, type: 2 });
      reset();
      toast({
        title: 'Thành công',
        description: 'Gửi thông tin thành công. Chúng tôi sẽ liên hệ sớm nhất.',
      });
    } catch (e: any) {
      toast({
        title: 'Thất bại',
        description: e?.message || 'Gửi thông tin thất bại. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8 sm:pb-12 pt-4 sm:pt-6">
      <div className="container mx-auto px-4">
        <DynamicBreadcrumb />
        {/* Keep existing cooperate content */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-[36px] font-bold text-primary mb-4">
            CƠ HỘI KINH DOANH
          </h1>
          <p className="text-[16px] font-normal text-black">
            Trở Thành Đại Lý LaminGrow - Thương hiệu Cốm canxi sữa hướng đích
            xương cao cấp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="w-full">
            <Image
              alt="Cơ hội kinh doanh LaminGrow"
              className="w-full h-auto rounded-lg"
              height={600}
              src="/images/kinh-doanh.png"
              width={600}
            />
          </div>
          <div className="w-full">
            <Accordion
              collapsible
              className="w-full space-y-4"
              type="single"
              value={openItem}
              onValueChange={setOpenItem}>
              {accordionItems.map(item => {
                const isOpen = openItem === item.id;

                return (
                  <AccordionItem
                    key={item.id}
                    className="border rounded-lg bg-gray-50"
                    value={item.id}>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div
                          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                            isOpen ? 'bg-primary' : 'bg-black'
                          }`}>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span
                          className={`font-bold text-base transition-colors ${
                            isOpen ? 'text-primary' : 'text-black'
                          }`}>
                          {item.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-700">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-10">
          <div className="rounded-2xl bg-white shadow-md p-6 sm:p-8">
            <h1 className="text-center text-[28px] sm:text-[32px] leading-tight font-bold text-primary mb-6">
              Đăng ký trở thành
              <br className="hidden sm:block" /> đại lý LaminGrow
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <input
                className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                placeholder="Họ và tên/Tên cửa hàng / Nhà thuốc*"
                type="text"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <input
                className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                placeholder="Số điện thoại*"
                type="tel"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
              <input
                className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                placeholder="Email*"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <input
                className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                placeholder="Địa chỉ (Tỉnh/Thành phố)*"
                type="text"
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
              <textarea
                className="w-full min-h-24 rounded-md border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                placeholder="Lời nhắn / Mong muốn hợp tác/Điều gì khiến bạn muốn trở thành cộng tác viên và đồng hành cùng Lamin?"
                {...register('note')}
              />

              <p className="text-sm text-gray-600">
                Lamin sẽ liên hệ với bạn thông qua thông tin mà bạn đã đăng ký.
                Cảm ơn bạn.
              </p>

              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white font-medium hover:opacity-90 disabled:opacity-60"
                disabled={isSubmitting}
                type="submit">
                {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
              </button>
            </form>
          </div>

          <div className="mt-8 sm:mt-10">
            <h2 className="text-xl font-bold text-grayscale-90 mb-4">
              THÔNG TIN LIÊN HỆ
            </h2>
            <div className="space-y-3 text-grayscale-80">
              <p>
                <span className="font-semibold">Hotline tư vấn đại lý:</span>{' '}
                {contactInfo?.hotline1}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{' '}
                {contactInfo?.email}
              </p>
              <p>
                <span className="font-semibold">Zalo/Viber:</span>{' '}
                {contactInfo?.phone}
              </p>
              <p>
                <span className="font-semibold">Thời gian tư vấn:</span> 8h00 -
                20h00 (kể cả Chủ nhật)
              </p>
              <p>
                <span className="font-semibold">Sản phẩm của:</span>{' '}
                {contactInfo?.name}
              </p>
              <p>
                <span className="font-semibold">Địa chỉ:</span>{' '}
                {contactInfo?.address}
              </p>
            </div>

            <hr className="my-6" />

            <div className="space-y-3 text-sm text-grayscale-70">
              <h3 className="text-base font-semibold text-grayscale-90">
                LƯU Ý QUAN TRỌNG
              </h3>
              <p>
                Thực phẩm bảo vệ sức khỏe LaminGrow không phải là thuốc, không
                có tác dụng thay thế thuốc chữa bệnh. Số tiếp nhận công bố:
                661/2022/ĐKSP. Giấy xác nhận nội dung quảng cáo số:
                1023/2022/XNQC-ATTP. Công dụng: bổ sung vi chất từ cốm canxi sữa
                hướng đích xương giúp con cao khỏe.
              </p>
              <p>LaminGrow - Xây dựng thăng bằng bền vững cùng đối tác</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
