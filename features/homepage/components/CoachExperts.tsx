'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useGetCoach } from '../../coach-experts/hooks/useGetCoach';

import { apiClient } from '@/services/api/apiClient';

export default function CoachExperts() {
  const { coaches, isLoading } = useGetCoach();
  const currentYear = new Date().getFullYear();

  return (
    <section
      aria-labelledby="coaches-heading"
      className="rounded-2xl bg-gradient-primary px-4 py-5">
      <header className="mb-8">
        <h2
          className="mb-2 text-[22px] font-semibold text-white sm:text-[28px]"
          id="coaches-heading">
          Coach tư vấn chăm sóc sức khỏe
        </h2>
        <p className="mb-4 text-base font-medium text-white/90">
          Danh sách các Coach tư vấn chăm sóc sức khỏe của Lamin
        </p>
        <Link
          className="decoration-transparent inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-primary hover:bg-white/90 font-normal text-sm transition-colors"
          href="/doi-ngu-chuyen-mon">
          Xem tất cả
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
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
              <li
                key={coach._id}
                className="rounded-xl bg-white p-4 transition-all duration-300 hover:shadow-lg">
                <Link
                  className="decoration-transparent block transition-transform duration-300 hover:scale-[1.02]"
                  href={`/doi-ngu-chuyen-mon/${coach._id}`}>
                  <article className="flex items-center gap-4">
                    <Image
                      alt={coach.name}
                      className="rounded-full"
                      height={80}
                      src={imageUrl}
                      width={80}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-grayscale-40">
                        {coach.field &&
                        typeof coach.field === 'object' &&
                        coach.field.name
                          ? coach.field.name
                          : typeof coach.field === 'string'
                            ? coach.field
                            : 'Bác sĩ chuyên khoa'}
                      </span>
                      <h3 className="text-lg font-semibold text-grayscale-90 truncate">
                        {coach.name}
                      </h3>
                      <p className="text-sm text-primary">{experience}</p>
                    </div>
                  </article>
                </Link>
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
