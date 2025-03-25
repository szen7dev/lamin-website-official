'use client';

import { Suspense } from 'react';

import Loading from '@/app/loading';
import { CoachDetail } from '@/features/coach-experts/components/CoachDetail';
import { useGetDetailCoach } from '@/features/coach-experts/hooks/useGetDetailCoach';

interface ClientCoachDetailProps {
  id: string;
}

export function ClientCoachDetail({ id }: ClientCoachDetailProps) {
  const {
    data: coach,
    error,
    isLoading,
  } = useGetDetailCoach({
    contactID: id,
  });

  return (
    <Suspense fallback={<Loading />}>
      <CoachDetail coach={coach} error={error} isLoading={isLoading} />
    </Suspense>
  );
}
