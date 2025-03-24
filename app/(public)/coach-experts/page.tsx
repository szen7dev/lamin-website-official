'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';

import { useGetCoach } from '@/features/homepage/hooks/coach/useGetCoach';
import { apiClient } from '@/services/api/apiClient';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { Input } from '@/components/ui/input';

export default function CoachExpertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { coaches, isLoading } = useGetCoach({ limit: 12 });
  const currentYear = new Date().getFullYear();

  // Filter coaches based on search term
  const filteredCoaches = coaches.filter(
    coach =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.field?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto">
        <DynamicBreadcrumb />
      </div>

      {/* Banner Section */}
      <section className="overflow-hidden rounded-2xl">
        <div className="relative h-[180px] w-full">
          <Image
            fill
            priority
            alt="Coach Experts Banner"
            className="object-cover"
            quality={100}
            src="/images/coach_pages.png"
          />
        </div>
      </section>

      {/* Info Grid Section */}
      <section className="px-20 mb-12 bg-[#eaeffb]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex items-center justify-center">
                <Image
                  alt="Experience Icon"
                  height={48}
                  src="/images/star_icon.png"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Giàu kinh nghiệm
              </h3>
              <p className="text-sm text-grayscale-60">
                Đội ngũ bác sĩ và dược sĩ giàu kinh nghiệm có thâm niên trong
                ngành, được tư nghiệp cả trong và ngoài nước.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  alt="Hat Icon"
                  height={48}
                  src="/images/hat_icon.png"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Nghiệp vụ chuyên môn cao
              </h3>
              <p className="text-sm text-grayscale-60">
                Các bác sĩ và dược sĩ hiện đang công tác và giảng dạy tại bệnh
                viện hàng đầu cả nước, nghiệp vụ chuyên môn cao ở lĩnh vực y
                dược.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  alt="Tick Icon"
                  height={48}
                  src="/images/tick_icon.png"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Tâm huyết và tận tâm
              </h3>
              <p className="text-sm text-grayscale-60">
                Luôn sẵn sàng tư vấn và hỗ trợ chăm sóc sức khỏe cho mọi người
                bằng sự tận tâm và nhiệt huyết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto mb-12">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grayscale-40" />
            <Input
              className="pl-10 py-6 text-base rounded-2xl bg-white"
              placeholder="Tìm kiếm đội ngũ chuyên môn..."
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Coaches Grid Section */}
      <section className="container mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-1 bg-primary" />
          <h2 className="text-lg font-semibold text-black">
            Đội ngũ chuyên môn
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="animate-pulse rounded-xl bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="h-4 w-28 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCoaches.length > 0 ? (
          <div className="flex flex-col space-y-6">
            {/* Group coaches into rows of 3 (or fewer for the last row) */}
            {Array.from({ length: Math.ceil(filteredCoaches.length / 3) }).map(
              (_, rowIndex) => {
                const startIdx = rowIndex * 3;
                const rowCoaches = filteredCoaches.slice(
                  startIdx,
                  startIdx + 3,
                );
                const isLastRow =
                  rowIndex === Math.ceil(filteredCoaches.length / 3) - 1;

                return (
                  <div key={`row-${rowIndex}`} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {rowCoaches.map(coach => {
                        // Calculate experience based on graduation year
                        const experience = coach.graduationYear
                          ? `${currentYear - coach.graduationYear} năm kinh nghiệm`
                          : 'Chuyên gia';

                        // Get image URL using apiClient.getContactImageUrl
                        const imageUrl = coach.image
                          ? apiClient.getContactImageUrl(coach.image)
                          : '/placeholder.svg';

                        return (
                          <Link
                            key={coach._id}
                            className="block rounded-xl p-6 transition-shadow hover:shadow-md hover:bg-[#F8F9FE] decoration-transparent"
                            href={`/coach-experts/${coach._id}`}>
                            <div className="flex items-center gap-4">
                              <Image
                                alt={coach.name}
                                className="rounded-full object-cover"
                                height={80}
                                src={imageUrl}
                                width={80}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-sm text-[#4A4F63]">
                                  {coach.field &&
                                  typeof coach.field === 'object' &&
                                  coach.field.name
                                    ? coach.field.name
                                    : typeof coach.field === 'string'
                                      ? coach.field
                                      : 'Bác sĩ chuyên khoa'}
                                </span>
                                <h3 className="text-lg font-semibold text-black truncate">
                                  {coach.name}
                                </h3>
                                <p className="text-sm text-[#657384]">
                                  {experience}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Add separator if not the last row */}
                    {!isLastRow && <hr className="border-grayscale-20" />}
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="text-[#4A4F63]">
              Không tìm thấy coach phù hợp với từ khóa &ldquo;{searchTerm}
              &rdquo;
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
