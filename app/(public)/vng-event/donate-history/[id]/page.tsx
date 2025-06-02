'use client';

import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import DetailTable from '@/features/vng-event/components/DetailTable';
import { useGetFundList } from '@/features/vng-event/hooks/useGetFundList';

export default function DonationHistoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { fundDetail, isLoading, error } = useGetFundList({
    fundID: id as string,
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleDownloadImages = async () => {
    if (!fundDetail?.images || fundDetail.images.length === 0) {
      toast.error('Không có hình ảnh nào để tải');

      return;
    }

    try {
      fundDetail.images.forEach((image, index) => {
        const link = document.createElement('a');

        link.href = image;
        link.setAttribute(
          'download',
          `fund-image-${fundDetail._id}-${index + 1}.jpg`,
        );
        link.setAttribute('target', '_blank');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      toast.success(`Đang tải ${fundDetail.images.length} hình ảnh`);
    } catch (error) {
      console.error('Error downloading images:', error);
      toast.error('Có lỗi xảy ra khi tải hình ảnh');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !fundDetail || Array.isArray(fundDetail)) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <h2 className="text-2xl font-bold text-red-500">
            {error
              ? 'Đã xảy ra lỗi khi tải dữ liệu'
              : 'Không tìm thấy dữ liệu quyên góp'}
          </h2>
          <Button className="mt-4" onClick={handleGoBack}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-2xl mb-8">
        <div className="flex px-4 py-3 justify-between items-center">
          <div className="text-heading-sm font-semibold text-primary">
            Chi Tiết Quyên Góp
          </div>
          <div className="flex gap-3">
            {/* <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              disabled={!fundDetail?.images || fundDetail.images.length === 0}
              size="sm"
              onClick={handleDownloadImages}>
              Tải ảnh sự kiện
            </Button> */}
            <Button
              className="flex items-center gap-2"
              size="sm"
              variant="outline"
              onClick={handleGoBack}>
              Quay lại
            </Button>
          </div>
        </div>

        <DetailTable donation={fundDetail} />
      </div>
    </div>
  );
}
