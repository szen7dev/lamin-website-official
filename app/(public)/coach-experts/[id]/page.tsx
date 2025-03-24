'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { useGetDetailCoach } from '@/features/homepage/hooks/coach/useGetDetailCoach';
import { apiClient } from '@/services/api/apiClient';

export default function CoachDetailPage() {
  const { id } = useParams();

  const {
    data: coach,
    error,
    isLoading,
  } = useGetDetailCoach({
    contactID: id as string,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <DynamicBreadcrumb />
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !coach) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <DynamicBreadcrumb />
        </div>
        <div className="mb-6">
          <Link
            className="inline-flex items-center text-primary hover:underline"
            href="/coach-experts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách chuyên gia
          </Link>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 text-yellow-600">
          Không tìm thấy thông tin chuyên gia
        </div>
      </div>
    );
  }

  // Get image URL
  const imageUrl = coach.image
    ? apiClient.getContactImageUrl(coach.image)
    : '/placeholder.svg';

  // Format field display
  const fieldDisplay = coach.field
    ? typeof coach.field === 'object' && coach.field.name
      ? coach.field.name
      : typeof coach.field === 'string'
        ? coach.field
        : 'Bác sĩ chuyên khoa'
    : 'Bác sĩ chuyên khoa';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <DynamicBreadcrumb />
      </div>

      <div className="container">
        <div className="flex justify-between items-start">
          {/* Doctor Profile Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative h-48 w-48 overflow-hidden rounded-full">
                <Image
                  fill
                  alt={coach.name}
                  className="object-cover"
                  src={imageUrl}
                />
              </div>
            </div>
            <div className="text-base font-medium text-[#4A4F63]">
              {coach.position.name}
            </div>
            <h1 className="mb-1 text-3xl font-medium">{coach.name}</h1>
            <div className="text-primary text-base font-medium">
              {fieldDisplay}
            </div>
          </div>

          {/* Chat Bubble */}
          <div className="w-[400px]">
            <div
              className="max-w-3xl px-6 py-7 rounded-2xl bg-[#eaeffb] text-gray-700"
              style={{ boxShadow: '6px 6px 0px 0px #DDE3E9' }}>
              <p className="text-gray-700">{coach.note}</p>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <div className="flex items-center justify-start">
            <div className="mr-2">
              <Image
                alt="Experience"
                className="object-cover"
                height={24}
                src="/images/star_icon.png"
                width={24}
              />
            </div>
            <h2 className="text-xl font-semibold">Kinh nghiệm</h2>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 font-medium">Quá trình công tác</h3>
            <ul className="ml-6 list-disc space-y-2">
              {coach.workStartDate && (
                <li>
                  2003 - 2006: Bác sĩ điều trị, Bệnh viện Da khoa Đống Đa, Hà
                  Nội.
                </li>
              )}
              <li>
                2006 - 2011: Bác sĩ điều trị, Bệnh viện Bệnh Nhiệt đới Trung
                ương.
              </li>
              <li>
                2018 - Nay: Có văn chuyên môn trong lĩnh vực Tiêm chủng Vắc xin,
                đặc biệt là lĩnh vực xử trí các phản ứng sau tiêm.
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-medium">Quá trình đào tạo</h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>1996 - 2002: Bác sĩ Y khoa, trường Đại học Y Hà Nội.</li>
              <li>2002 - 2003: Chuyên khoa định hướng, Đại học Y Hà Nội.</li>
              <li>
                2020 - Nay: Nghiên cứu sinh, Khoa Y học Lâm sàng các bệnh Nhiệt
                đới, Trường Đại học Mahidol, Vương quốc Thái Lan.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
