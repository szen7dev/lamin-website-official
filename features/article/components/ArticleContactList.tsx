'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetCoach } from '@/features/coach-experts/hooks/useGetCoach';
import { apiClient } from '@/services';
import { Button } from '@/components/ui/button';

export default function ArticleContactList() {
  const { coaches, isLoading, error } = useGetCoach({ limit: 5 });

  return (
    <section>
      {coaches.map(coach => {
        const imageUrl = coach.image
          ? apiClient.getContactImageUrl(coach.image)
          : '/placeholder.svg';

        return (
          <Link
            key={coach._id}
            className="block rounded-xl p-6 hover:bg-primary-5/50 decoration-transparent"
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
                <p className="text-base font-semibold text-[#4A4F63]">
                  {coach.field &&
                  typeof coach.field === 'object' &&
                  'name' in coach.field
                    ? coach.field.name
                    : 'Chuyên gia'}
                </p>
                <h3 className="text-lg font-medium truncate">{coach.name}</h3>
                <p className="text-base font-medium text-[#657384]">
                  {coach.position?.name || 'Chuyên gia'}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
      <section className="flex justify-center items-center p-4 sm-p-6">
        <Link
          className="decoration-transparent w-full"
          href="/doi-ngu-chuyen-mon">
          <Button className="text-white w-full rounded-full">Xem tất cả</Button>
        </Link>
      </section>
    </section>
  );
}
