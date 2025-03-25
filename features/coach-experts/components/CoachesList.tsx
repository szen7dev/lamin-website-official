'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';

import { useGetCoach } from '@/features/coach-experts/hooks/useGetCoach';
import { apiClient } from '@/services/api/apiClient';
import { Input } from '@/components/ui/input';

export default function CoachesList() {
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
    <>
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
                            href={`/doi-ngu-chuyen-mon/${coach._id}`}>
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
                                  'name' in coach.field
                                    ? coach.field.name
                                    : 'Chuyên gia'}
                                </span>
                                <h3 className="text-base font-semibold text-grayscale-90 truncate">
                                  {coach.name}
                                </h3>
                                <span className="text-xs text-primary">
                                  {experience}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="text-[#4A4F63]">
              Không tìm thấy chuyên gia phù hợp với từ khóa &ldquo;{searchTerm}
              &rdquo;
            </p>
          </div>
        )}
      </section>
    </>
  );
}
