'use client';

import { Suspense } from 'react';

import Loading from '@/app/loading';
import { CoachDetail } from '@/features/coach-experts/components/CoachDetail';
import { useGetDetailCoach } from '@/features/coach-experts/hooks/useGetDetailCoach';
import { useGetCoachDocument } from '@/features/coach-experts/hooks/useGetCoachDocument';

interface ClientCoachDetailProps {
  id: string;
}

export function ClientCoachDetail({ id }: ClientCoachDetailProps) {
  const {
    data: coach,
    error: coachError,
    isLoading: coachLoading,
  } = useGetDetailCoach({
    contactID: id,
    type: 3,
  });

  // s7 chưa có "quá trình công tác/đào tạo" — chỉ gọi API tài liệu của backend cũ khi hồ sơ đang xem
  // KHÔNG đến từ s7 (`coach.__s7`, gắn ở `storeTeam.ts`), và phải CHỜ `coach` tải xong mới biết được điều
  // đó (không thể tự quyết trước — gọi nhầm sang id kiểu s7 sẽ nhận nhầm/lỗi dữ liệu ở backend cũ).
  const legacyDocsEnabled = !coachLoading && !!coach && !coach.__s7;

  const {
    data: coachDocument,
    error: coachDocumentError,
    isLoading: coachDocumentLoading,
  } = useGetCoachDocument({ contactID: id }, legacyDocsEnabled);

  const {
    data: coachEducation,
    error: coachEducationError,
    isLoading: coachEducationLoading,
  } = useGetCoachDocument({ contactID: id, type: 1 }, legacyDocsEnabled);

  const error = coachError || coachDocumentError || coachEducationError;
  const isLoading =
    coachLoading || coachDocumentLoading || coachEducationLoading;

  return (
    <Suspense fallback={<Loading />}>
      <CoachDetail
        coach={coach}
        document={coachDocument ?? []}
        education={coachEducation ?? []}
        error={error}
        isLoading={isLoading}
      />
    </Suspense>
  );
}
