'use client';
import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EditIcon } from '@/components/icons';
import {
  AddEventModal,
  EventFormValues,
} from '@/components/modal/AddEventModal';

const EventPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = (data: EventFormValues) => {
    console.log('Form data:', data);
  };
  const eventList = [
    {
      id: 1,
      name: 'HÀNH TRÌNH YÊU THƯƠNG: CÙNG NHAU GIEO MẦM TRI THỨC CHO TRẺ EM VÙNG CAO TÂY BẮC',
      address:
        'Địa điểm: Trường Tiểu học Bán trú Nậm Mười – bản Tà Chử, xã Nậm Mười, huyện Văn Chấn, tỉnh Yên Bái',
      date: 'Thời gian: 08:00 – 17:00, Thứ Bảy, ngày 20 tháng 7 năm 2025',
      income: 'Thu: 20.000.000',
      expense: 'Chi: 15.000.000',
    },
    {
      id: 2,
      name: 'HÀNH TRÌNH YÊU THƯƠNG: CÙNG NHAU GIEO MẦM TRI THỨC CHO TRẺ EM VÙNG CAO TÂY BẮC',
      address:
        'Địa điểm: Trường Tiểu học Bán trú Nậm Mười – bản Tà Chử, xã Nậm Mười, huyện Văn Chấn, tỉnh Yên Bái',
      date: 'Thời gian: 08:00 – 17:00, Thứ Bảy, ngày 20 tháng 7 năm 2025',
      income: 'Thu: 20.000.000',
      expense: 'Chi: 15.000.000',
    },
    {
      id: 3,
      name: 'HÀNH TRÌNH YÊU THƯƠNG: CÙNG NHAU GIEO MẦM TRI THỨC CHO TRẺ EM VÙNG CAO TÂY BẮC',
      address:
        'Địa điểm: Trường Tiểu học Bán trú Nậm Mười – bản Tà Chử, xã Nậm Mười, huyện Văn Chấn, tỉnh Yên Bái',
      date: 'Thời gian: 08:00 – 17:00, Thứ Bảy, ngày 20 tháng 7 năm 2025',
      income: 'Thu: 20.000.000',
      expense: 'Chi: 15.000.000',
    },
  ];

  return (
    <section className="container py-6 bg-white rounded-2xl px-0">
      <div className="flex justify-between items-center gap-2 px-4">
        <div className="text-heading-sm font-semibold text-primary">
          Danh Sách Sự Kiện
        </div>
        <div className="text-white">
          <Button className="rounded-lg" onClick={() => setIsModalOpen(true)}>
            Tạo sự kiện
          </Button>
        </div>
      </div>
      <Separator className="my-4" />

      {eventList.map((event, index) => (
        <div key={event.id}>
          <div className="px-4">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4">
              <div className="rounded-full bg-[#E6F8FF] border-[#00BBF2] border-[1px] text-[#00BBF2] text-xs font-medium px-2 py-1 h-max">
                20/07/2025
              </div>

              <div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <h3 className="text-base font-bold">{event.name}</h3>
                </div>

                <div className="mt-3 text-sm text-grayscale-50 space-y-2 ml-4">
                  <p>{event.address}</p>
                  <p>
                    {event.date} <span> | </span> {event.income} |{' '}
                    {event.expense}
                  </p>
                </div>
              </div>

              <div className="flex items-center border border-grayscale-20 rounded-lg p-2 cursor-pointer hover:bg-grayscale-10 transition-colors h-max">
                <EditIcon />
              </div>

              <div className="col-start-2 col-end-4 row-start-2 row-end-2">
                <div
                  className="w-full px-6 py-7 rounded-2xl bg-[#eaeffb] text-gray-700"
                  style={{ boxShadow: '6px 6px 0px 0px #DDE3E9' }}>
                  <h4 className="font-medium mb-2">Ghi chú sự kiện:</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      - Mục tiêu: Góp phần cải thiện điều kiện học tập và sinh
                      hoạt cho học sinh dân tộc thiểu số tại vùng cao.
                    </li>
                    <li>
                      - Các hoạt động chính: Trao tặng cặp sách, sách vở, áo ấm,
                      dép và nhu yếu phẩm. Giao lưu văn nghệ, tổ chức trò chơi
                      cho thiếu nhi. Khám sức khỏe miễn phí và tư vấn dinh dưỡng
                      cho các em nhỏ
                    </li>
                    <li>
                      - Liên hệ tham gia hoặc tài trợ: [0123456789 /
                      Lamin@gmail.com / Fanpage Nhóm Thiện Nguyện Trẻ]
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-start-2 col-end-4 row-start-3 row-end-3 flex justify-end">
                <Button className="mr-2" size="sm" variant="outline">
                  Chỉnh sửa
                </Button>
                <Button className="text-white" size="sm">
                  Tham gia
                </Button>
              </div>
            </div>
          </div>
          {index < eventList.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default EventPage;
