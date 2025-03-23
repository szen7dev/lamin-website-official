'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { useGetCoach } from '../hooks/coach/useGetCoach';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api/apiClient';

export default function CoachExperts() {
  const { coaches, isLoading } = useGetCoach();
  const currentYear = new Date().getFullYear();

  return (
    <section
      aria-labelledby="coaches-heading"
      className="rounded-2xl bg-gradient-3 p-8">
      <header className="mb-8">
        <h2
          className="mb-2 text-3xl font-semibold text-white"
          id="coaches-heading">
          Coach tư vấn chăm sóc sức khỏe
        </h2>
        <p className="mb-4 text-base font-medium text-white/90">
          Danh sách các Coach tư vấn chăm sóc sức khỏe của Elela
        </p>
        <Button
          className="flex items-center gap-2 rounded-full bg-white text-primary hover:bg-white/90"
          variant="secondary">
          Tìm hiểu thêm
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <li className="rounded-xl bg-white p-4">
            <p className="text-grayscale-40">Đang tải...</p>
          </li>
        ) : coaches.length > 0 ? (
          coaches.map(coach => {
            // Calculate experience based on graduation year
            const experience = coach.graduationYear
              ? `${currentYear - coach.graduationYear} năm kinh nghiệm`
              : 'Chuyên gia';

            // Get image URL using apiClient.getContactImageUrl
            const imageUrl = coach.image
              ? apiClient.getContactImageUrl(coach.image)
              : '/placeholder.svg';

            return (
              <li key={coach._id} className="rounded-xl bg-white p-4">
                <article className="flex items-center gap-4">
                  <Image
                    alt={coach.name}
                    className="rounded-full"
                    height={80}
                    src={imageUrl}
                    width={80}
                  />
                  <div>
                    <span className="text-sm text-grayscale-40">
                      Bác sĩ chuyên khoa
                    </span>
                    <h3 className="text-lg font-semibold text-grayscale-90">
                      {coach.name}
                    </h3>
                    <p className="text-sm text-primary">{experience}</p>
                  </div>
                </article>
              </li>
            );
          })
        ) : (
          <li className="rounded-xl bg-white p-4">
            <p className="text-grayscale-40">Không có dữ liệu coach</p>
          </li>
        )}
      </ul>
    </section>
  );
}
