import { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientCoachDetail } from './client';

import { getDetailCoach } from '@/features/coach-experts/api/getDetailCoach';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import Loading from '@/app/loading';

interface CoachDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CoachDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await Promise.resolve(params);
    // Fetch the coach data server-side for metadata
    const coach = await getDetailCoach({
      contactID: id,
    });

    const fieldDisplay = coach.field
      ? typeof coach.field === 'object' && coach.field.name
        ? coach.field.name
        : typeof coach.field === 'string'
          ? coach.field
          : 'Bác sĩ chuyên khoa'
      : 'Bác sĩ chuyên khoa';

    // Use the coach's name in the metadata
    return generateSeoMetadata({
      title: `${coach.name} - ${fieldDisplay}`,
      description: coach.note
        ? `${coach.note.substring(0, 150)}...`
        : 'Thông tin chi tiết về chuyên gia y tế, kinh nghiệm và chuyên môn',
      keywords: ['chuyên gia y tế', 'bác sĩ', 'tư vấn sức khỏe', coach.name],
    });
  } catch (error) {
    // Fallback metadata if coach data can't be fetched
    return generateSeoMetadata({
      title: 'Thông tin chuyên gia',
      description: 'Thông tin chi tiết về chuyên gia y tế',
    });
  }
}

export default async function CoachDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Access the id directly from params
  const { id } = await Promise.resolve(params);

  // This is a server component that renders the client component
  return (
    <Suspense fallback={<Loading />}>
      <ClientCoachDetail id={id} />
    </Suspense>
  );
}
