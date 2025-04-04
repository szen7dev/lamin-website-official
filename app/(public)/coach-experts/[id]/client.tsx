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
  });

  const {
    data: coachDocument,
    error: coachDocumentError,
    isLoading: coachDocumentLoading,
  } = useGetCoachDocument({
    contactID: id,
  });

  const {
    data: coachEducation,
    error: coachEducationError,
    isLoading: coachEducationLoading,
  } = useGetCoachDocument({
    contactID: id,
    type: 1,
  });

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
