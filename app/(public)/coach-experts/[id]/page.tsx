import { Metadata } from 'next';

import { ClientCoachDetail } from './client';

import { getDetailCoach } from '@/features/coach-experts/api/getDetailCoach';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

interface CoachDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CoachDetailPageProps): Promise<Metadata> {
  try {
    // Fetch the coach data server-side for metadata
    const coach = await getDetailCoach({
      contactID: params.id,
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

export default function CoachDetailPage({ params }: CoachDetailPageProps) {
  // This is a server component that renders the client component
  return <ClientCoachDetail id={params.id} />;
}
